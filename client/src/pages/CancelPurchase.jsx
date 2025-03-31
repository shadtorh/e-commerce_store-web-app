import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

const CancelPurchase = () => {
	const containerVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				when: "beforeChildren",
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: { opacity: 1, scale: 1 },
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
			<motion.div
				className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center"
				initial="hidden"
				animate="visible"
				variants={containerVariants}
			>
				<motion.div
					variants={itemVariants}
					className="flex justify-center mb-6"
				>
					<XCircle className="text-red-500 h-16 w-16" />
				</motion.div>
				<motion.h1
					variants={itemVariants}
					className="text-3xl font-bold text-gray-800"
				>
					Purchase Cancelled
				</motion.h1>
				<motion.p variants={itemVariants} className="text-gray-600 mt-4">
					Your purchase has been cancelled. If this was a mistake, you can try
					again or contact support for assistance.
				</motion.p>
				<motion.div
					variants={itemVariants}
					className="mt-6 flex justify-center space-x-4"
				>
					<Link
						to="/cart"
						className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all"
					>
						Back to Shop
					</Link>
					<Link
						to="/support"
						className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all"
					>
						Contact Support
					</Link>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default CancelPurchase;
