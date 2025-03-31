import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import Loading from "../components/Loading";
import {
	CartItem,
	Coupon,
	OderSummary,
	RecommendedProducts,
} from "../components";
const Cart = () => {
	const { user } = useUserStore();
	const { cart, getCartItems, isLoading } = useCartStore();

	useEffect(() => {
		if (user) {
			getCartItems();
		}
	}, [user, getCartItems]);

	if (isLoading) {
		return <Loading />;
	}

	if (!user || cart.length === 0) {
		return (
			<div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50">
				<div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
					<ShoppingBag size={48} className="text-gray-400 mx-auto mb-4" />
					<h2 className="text-2xl font-semibold text-gray-900 mb-2">
						{!user ? "Sign in to view your cart" : "Your cart is empty"}
					</h2>
					<p className="text-gray-500 mb-6">
						{!user
							? "Please sign in to start shopping"
							: "Add items to your cart to see them here"}
					</p>
					<Link
						to={!user ? "/login" : "/"}
						className="inline-flex items-center justify-center w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
					>
						{!user ? "Sign In" : "Continue Shopping"}
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-gray-50 min-h-screen py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center mb-6">
					<Link
						to="/"
						className="flex items-center text-gray-600 hover:text-gray-900"
					>
						<ArrowLeft size={20} className="mr-2" />
						Continue Shopping
					</Link>
				</div>

				<div className="flex flex-col lg:flex-row gap-8">
					{/* Cart Items Section */}
					<div className="flex-grow">
						<CartItem />
					</div>

					{/* Order Summary Section */}
					<div className="lg:w-96">
						<OderSummary />

						{/* Coupon Section */}
						<Coupon />
					</div>
				</div>

				{/* Add Recommended section after the cart content */}
				<div className="mt-8">
					<RecommendedProducts />
				</div>
			</div>
		</div>
	);
};

export default Cart;
