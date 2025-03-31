import stripe from "../config/stripe.js";
import dotenv from "dotenv";
dotenv.config();
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body; // get the products and coupon code from the request body

		if (!Array.isArray(products)) {
			return res.status(400).json({
				success: false,
				message: "Products must be an array",
			});
		} // if the products is not an array, return an error

		if (products.length === 0) {
			return res.status(400).json({
				success: false,
				message: "Products array cannot be empty",
			});
		} // if the products array is empty, return an error

		let totalAmount = 0;
		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100);
			totalAmount += amount * product.quantity;
			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity,
			};
		}); // create a line items array

		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({
				code: couponCode,
				userId: req.user._id,
				isActive: true,
				expiryDate: { $gte: new Date() },
			});
			if (coupon) {
				totalAmount = Math.round((totalAmount * coupon.discount) / 100);
			} else {
				return res.status(400).json({
					success: false,
					message: "Invalid coupon code",
				});
			}
		} // if the coupon code is valid, apply the discount

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.FRONTEND_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.FRONTEND_URL}/purchase-cancel?session_id={CHECKOUT_SESSION_ID}`,
			customer_email: req.user.email,
			discounts: coupon
				? [
						{
							coupon: await createStripeCoupon(coupon.discount),
						},
					]
				: [],
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((product) => ({
						id: product._id.toString(),
						name: product.name,
						price: product.price,
						quantity: product.quantity,
					}))
				),
			}, // metadata is used to store the user id, coupon code, and products
		}); // create a new checkout session

		if (totalAmount >= 20000 && totalAmount < 100000) {
			await createNewCoupon(req.user._id);
		} // if the total amount is greater than 20000, create a new coupon

		if (totalAmount >= 100000) {
			await createVipCoupon(req.user._id);
		} // if the total amount is greater than 50000, create a new VIP coupon

		res.status(200).json({
			success: true,
			sessionId: session.id,
			totalAmount: totalAmount / 100, // Convert cents to dollars
			message: "Checkout session created successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Create a new Stripe coupon
const createStripeCoupon = async (discount) => {
	const coupon = await stripe.coupons.create({
		percent_off: discount,
		duration: "once",
	});
	return coupon.id; // return the coupon id
};

// Create a new coupon
const createNewCoupon = async (userId) => {
	await Coupon.findOneAndDelete({ userId }); // delete all coupons for the user

	const newCoupon = await Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 15),
		discount: 10,
		expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		userId,
		isActive: true,
	});
	await newCoupon.save(); // save the new coupon
	return newCoupon; // return the new coupon
};

// Create a new VIP coupon
const createVipCoupon = async (userId) => {
	await Coupon.findOneAndDelete({ userId }); // delete all coupons for the user
	const newCoupon = await Coupon({
		code: "VIP" + Math.random().toString(36).substring(2, 15),
		discount: 25,
		expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		userId,
		isActive: true,
	});
	await newCoupon.save(); // save the new coupon
	return newCoupon; // return the new coupon
};

export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body; // get the session id from the request body
		const session = await stripe.checkout.sessions.retrieve(sessionId); // retrieve the session

		if (session.payment_status === "paid") {
			// Handle Coupon code  if the payment is successful and provided
			if (session.metadata.couponCode) {
				await Coupon.findOneAndUpdate(
					{
						code: session.metadata.couponCode,
						userId: session.metadata.userId,
						isActive: true,
					},
					{
						isActive: false,
					}
				);
			} // if the coupon code is valid, update the coupon
			// // create a new order
			const products = JSON.parse(session.metadata.products);
			const newOrder = new Order({
				userId: session.metadata.userId,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})),
				totalAmount: session.amount_total / 100, // convert from cents to dollars,
				stripeSessionId: sessionId,
			});

			// console.log("Products metadata:", session.metadata.products);

			await newOrder.save(); // save the new order
			res.status(200).json({
				success: true,
				session,
				message: "Payment successful, order created ",
				orderId: newOrder._id,
			}); // return the session
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
