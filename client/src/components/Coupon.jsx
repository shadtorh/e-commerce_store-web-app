import React, { useState, useEffect } from "react";
import { Tag, X } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { motion, AnimatePresence } from "framer-motion";

const Coupon = () => {
	const [couponCode, setCouponCode] = useState("");
	const {
		coupon,
		coupons,
		isCouponApplied,
		applyCoupon,
		removeCoupon,
		getCoupon,
	} = useCartStore();

	useEffect(() => {
		getCoupon();
	}, []);

	const handleApplyCoupon = async () => {
		if (couponCode) {
			await applyCoupon(couponCode);
		}
	};

	const handleRemoveCoupon = () => {
		setCouponCode("");
		removeCoupon();
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white rounded-lg shadow-sm p-6 w-full"
		>
			<motion.div
				initial={{ x: -20 }}
				animate={{ x: 0 }}
				className="flex items-center gap-2 mb-4"
			>
				<Tag size={20} className="text-indigo-600" />
				<h2 className="text-lg font-medium text-gray-900">Apply Coupon</h2>
			</motion.div>

			<AnimatePresence mode="wait">
				{!isCouponApplied ? (
					<motion.div
						key="input"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="flex gap-2"
					>
						<input
							type="text"
							placeholder="Enter coupon code"
							value={couponCode}
							onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
							className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
						/>
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={handleApplyCoupon}
							disabled={!couponCode}
							className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
						>
							Apply
						</motion.button>
					</motion.div>
				) : (
					<motion.div
						key="applied"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						className="bg-green-50 border border-green-200 rounded-md p-4"
					>
						<div className="flex items-center justify-between">
							<div>
								<motion.div
									initial={{ x: -20 }}
									animate={{ x: 0 }}
									className="flex items-center gap-2"
								>
									<span className="text-green-600 font-medium">
										{coupon?.code}
									</span>
									<span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
										Applied
									</span>
								</motion.div>
								<p className="text-sm text-green-600 mt-1">
									{coupon?.discount}% off applied to your order
								</p>
							</div>
							<motion.button
								whileHover={{ scale: 1.1, rotate: 90 }}
								whileTap={{ scale: 0.9 }}
								onClick={handleRemoveCoupon}
								className="text-gray-400 hover:text-gray-500"
							>
								<X size={20} />
							</motion.button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="mt-6"
			>
				<h3 className="text-sm font-medium text-gray-900 mb-3">
					Available Coupons
				</h3>
				<div className="space-y-3">
					{coupons && coupons.length > 0 ? (
						coupons.map((couponItem) => (
							<motion.div
								key={couponItem.code}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								className="border border-dashed border-gray-200 rounded-md p-3"
							>
								<div className="flex items-center justify-between">
									<div>
										<span className="text-indigo-600 font-medium">
											{couponItem.code}
										</span>
										<p className="text-sm text-gray-500 mt-1">
											{couponItem.discount}% off on your order
										</p>
									</div>
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => setCouponCode(couponItem.code)}
										className="text-sm text-indigo-600 hover:text-indigo-700"
									>
										Use Code
									</motion.button>
								</div>
							</motion.div>
						))
					) : (
						<p className="text-sm text-gray-500">No coupons available</p>
					)}
				</div>
			</motion.div>
		</motion.div>
	);
};

export default Coupon;
