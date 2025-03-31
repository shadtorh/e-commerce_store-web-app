import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
	return (
		<div className="relative bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row items-center justify-between py-20">
					{/* Left Content */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						className="md:w-1/2 space-y-6"
					>
						<motion.span
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="inline-block bg-black text-white px-4 py-2 rounded-full text-sm font-medium"
						>
							New Collection
						</motion.span>

						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
							className="text-5xl md:text-6xl font-bold text-gray-900"
						>
							Summer Essentials 2025
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
							className="text-xl text-gray-600 max-w-lg"
						>
							Discover our latest collection of summer essentials. Perfect for
							your vacation and everyday style.
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
							className="flex gap-4 pt-4"
						>
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Link
									to="/products"
									className="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors duration-200"
								>
									Shop Now
								</Link>
							</motion.div>
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Link
									to="/collection"
									className="inline-block bg-white text-black px-8 py-3 rounded-lg font-medium border border-black hover:bg-gray-50 transition-colors duration-200"
								>
									Explore Collection
								</Link>
							</motion.div>
						</motion.div>
					</motion.div>

					{/* Right Image */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						className="md:w-1/2 mt-10 md:mt-0"
					>
						<div className="relative">
							<div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent z-10" />
							<motion.img
								initial={{ scale: 1.1 }}
								animate={{ scale: 1 }}
								transition={{ duration: 0.8 }}
								src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070"
								alt="Summer Collection"
								className="rounded-lg object-cover w-full h-[500px]"
							/>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default Hero;
