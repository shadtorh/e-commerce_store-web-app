import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
// import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { Loading } from "../components";
import ErrorPage from "../components/ErrorPage";
import axios from "../utils/axios";
import Confetti from "react-confetti";

const PurchaseSuccess = () => {
	const navigate = useNavigate();
	const [isProcessing, setIsProcessing] = useState(true);
	const [error, setError] = useState(null);

	const { clearCart } = useCartStore();

	useEffect(() => {
		const handleCheckout = async (sessionId) => {
			try {
				// const stripe = await stripePromise;
				const response = await axios.post("/payment/checkout-success", {
					sessionId,
				});

				if (response.data.success) {
					clearCart(); // Clear the cart after successful checkout
				} else {
					throw new Error(response.data.message || "Payment processing failed");
				}
			} catch (error) {
				console.error("Error creating checkout session:", error);
			} finally {
				setIsProcessing(false); // Set isProcessing to false after checkout attempt
			}
		};

		const sessionId = new URLSearchParams(window.location.search).get(
			"session_id"
		);
		if (sessionId) {
			handleCheckout(sessionId);
		} else {
			setIsProcessing(false); // Set isProcessing to false if no session ID is found in URL
			console.error("No session ID found in URL");
			setError("No session ID found in URL");
		}
	}, [clearCart]);

	// Redirect to homepage after 5 seconds
	useEffect(() => {
		setTimeout(() => {
			navigate("/");
		}, 10000);
	});

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
	};

	const buttonVariants = {
		hover: {
			scale: 1.1,
			boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.3)",
			transition: { yoyo: Infinity, duration: 0.4 },
		},
	};

	const carryOnVariants = {
		hidden: { x: "-100vw" },
		visible: {
			x: 0,
			transition: { type: "spring", stiffness: 120, duration: 1 },
		},
	};

	if (isProcessing) {
		return <Loading />;
	}

	if (error) {
		return <ErrorPage />;
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500">
			<Confetti width={window.innerWidth} height={window.innerHeight} />
			<motion.div
				className="bg-white rounded-lg shadow-lg p-8 text-center"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				<motion.h1
					className="text-3xl font-bold text-green-600 mb-4"
					initial={{ y: -50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.8 }}
				>
					Congratulations!
				</motion.h1>
				<p className="text-gray-700 mb-6">
					Your purchase was successful. Thank you for shopping with us!
				</p>
				<motion.img
					src="https://cdn-icons-png.flaticon.com/512/1055/1055183.png"
					alt="Success"
					className="w-24 h-24 mx-auto mb-6"
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
				/>
				<motion.button
					className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
					variants={buttonVariants}
					whileHover="hover"
					onClick={() => navigate("/")}
				>
					Go to Homepage
				</motion.button>
				<motion.div
					className="mt-6 text-indigo-600 font-medium"
					variants={carryOnVariants}
					initial="hidden"
					animate="visible"
				>
					Carry on shopping for more amazing deals!
				</motion.div>
			</motion.div>
		</div>
	);
};

export default PurchaseSuccess;
