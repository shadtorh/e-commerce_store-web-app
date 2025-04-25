import React from "react";
import { useCartStore } from "../stores/useCartStore";

import { loadStripe } from "@stripe/stripe-js";
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

import axios from "../utils/axios";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
const OderSummary = () => {
	const { subtotal, total, isCouponApplied, coupon, cart } = useCartStore();

	const savings = subtotal - total;

	const handlePayment = async () => {
		const stripe = await stripePromise;
		const response = await axios.post("/payment/create-checkout-session", {
			products: cart,
			couponCode: coupon ? coupon.code : null,
		});
		const { sessionId, totalAmount } = response.data;
		console.log("Session ID: ", sessionId, "Total Amount: ", totalAmount);

		const result = await stripe.redirectToCheckout({ sessionId });
	};

	return (
		<div>
			<div className="bg-white rounded-lg shadow-sm p-6 top-24 mb-4">
				<h2 className="text-lg font-medium text-gray-900 mb-6">
					Order Summary
				</h2>

				<div className="space-y-4 mb-6">
					<div className="flex justify-between text-sm">
						<span className="text-gray-600">Subtotal</span>
						<span className="text-gray-900">${subtotal.toFixed(2)}</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-gray-600">Shipping</span>
						<span className="text-green-600">Free</span>
					</div>
					{isCouponApplied && coupon && (
						<div className="flex justify-between text-sm">
							<span className="text-gray-600">Coupon</span>
							{/* <span className="text-gray-900">{coupon.code}</span> */}
							<span className="text-gray-500">
								{coupon.discount}% off on your order
							</span>
						</div>
					)}
				</div>

				{savings > 0 && (
					<div className="flex justify-between text-sm">
						<span className="text-gray-600">Savings</span>
						<span className="text-red-600">${savings.toFixed(2)}</span>
					</div>
				)}

				<div className="border-t border-gray-200 pt-4 mb-6">
					<div className="flex justify-between">
						<span className="text-base font-medium text-gray-900">Total</span>
						<span className="text-xl font-medium text-gray-900">
							${total.toFixed(2)}
						</span>
					</div>
					<p className="text-sm text-gray-500 mt-1">Including shipping</p>
				</div>

				<button
					onClick={handlePayment}
					className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center cursor-pointer"
				>
					Proceed to Checkout
				</button>

				<div className="mt-4 text-xs text-gray-500 text-center">
					Secure checkout powered by Stripe
				</div>
			</div>
		</div>
	);
};

export default OderSummary;
