import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-[80vh] flex items-center justify-center px-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-center"
			>
				{/* 404 Text with Animation */}
				<motion.h1
					className="text-9xl font-bold text-indigo-600"
					initial={{ scale: 0.5 }}
					animate={{ scale: 1 }}
					transition={{
						type: "spring",
						stiffness: 260,
						damping: 20,
					}}
				>
					404
				</motion.h1>

				{/* Error Messages */}
				<h2 className="text-3xl font-semibold text-gray-900 mt-4">
					Oops! Page not found
				</h2>
				<p className="text-gray-600 mt-2 mb-8">
					The page you're looking for doesn't seem to exist
				</p>

				{/* Home Button */}
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => navigate("/")}
					className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white 
                   rounded-lg hover:bg-indigo-700 transition-colors duration-200
                   shadow-lg hover:shadow-xl"
				>
					<Home className="w-5 h-5 mr-2" />
					Back to Home
				</motion.button>

				{/* Decorative Elements */}
				<div className="mt-12 space-y-2 text-gray-400">
					<motion.div
						animate={{
							rotate: [0, 10, -10, 0],
							y: [0, -10, 10, 0],
						}}
						transition={{
							duration: 5,
							repeat: Infinity,
							repeatType: "reverse",
						}}
						className="text-6xl"
					>
						🤔
					</motion.div>
					<p className="text-sm">Lost in the digital wilderness...</p>
				</div>
			</motion.div>
		</div>
	);
};

export default NotFound;
