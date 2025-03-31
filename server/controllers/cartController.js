//

import Product from "../models/Product.js";

// Add to Cart
export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		// Check if product exists
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product not found",
			});
		}

		// Find if product already exists in cart
		const existingCartItem = user.cart.find(
			(item) => item.product.toString() === productId
		);

		if (existingCartItem) {
			// If exists, increment quantity
			existingCartItem.quantity += 1;
		} else {
			// If doesn't exist, add new item
			user.cart.push({
				product: productId,
				quantity: 1,
			});
		}

		await user.save();

		// Populate cart items with product details
		await user.populate("cart.product");

		res.status(200).json({
			success: true,
			message: "Product added to cart",
			cart: user.cart,
		});
	} catch (error) {
		console.error("Add to cart error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

// Remove from Cart
export const removeFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		if (!productId) {
			user.cart = [];
		} else {
			user.cart = user.cart.filter(
				(item) => item.product.toString() !== productId
			);
		}

		await user.save();

		res.status(200).json({
			success: true,
			message: "Product removed from cart",
			cart: user.cart,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

// Update Quantity
export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantity } = req.body;
		const user = req.user;

		// Find the product in the cart by comparing ObjectId properly
		const existingProduct = user.cart.find(
			(item) => item.product.toString() === productId
		);

		if (existingProduct) {
			if (quantity === 0) {
				// Remove product from cart when quantity is 0
				user.cart = user.cart.filter(
					(item) => item.product.toString() !== productId
				);
				await user.save();
				return res.status(200).json({
					success: true,
					message: "Product removed from cart",
					cart: user.cart,
				});
			}

			// Update the quantity
			existingProduct.quantity = quantity;
			await user.save();
			return res.status(200).json({
				success: true,
				message: "Quantity updated",
				cart: user.cart,
			});
		}

		return res.status(404).json({
			success: false,
			message: "Product not found in cart",
		});
	} catch (error) {
		console.error("Update Cart Error:", error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

// Get Cart
export const getCart = async (req, res) => {
	try {
		const products = await Product.find({
			_id: { $in: req.user.cart.map((item) => item.product) },
		});
		// console.log(products);
		const cart = products.map((product) => {
			const item = req.user.cart.find(
				(cartItem) => cartItem.product.toString() === product._id.toString()
			);
			return {
				...product.toJSON(),
				quantity: item.quantity,
			};
		});
		res.status(200).json({ success: true, cart });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};
