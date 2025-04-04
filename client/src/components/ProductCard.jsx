import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
	const { addToCart } = useCartStore();
	const { user } = useUserStore();

	const handleAddToCart = async () => {
		if (!user) {
			toast.error("Please login to add to cart");
			return;
		}

		try {
			await addToCart(product._id);
		} catch (error) {
			console.error("Add to cart error:", error);
		}
	};

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.3,
			},
		},
	};

	return (
		<motion.div
			variants={cardVariants}
			whileHover={{ y: -5 }}
			className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 w-full sm:w-56 md:w-64 lg:w-72"
		>
			{/* Image Container */}
			<div className="relative">
				<img
					src={product.image}
					alt={product.name}
					className="w-full h-40 md:h-48 object-cover object-center"
				/>

			{/* Product Info */}
			<div className="p-4 space-y-4">
				{/* Product Name */}
				<h2 className="text-sm md:text-base font-semibold text-gray-800 mb-1 line-clamp-1">
					{product.name}
				</h2>

				{/* Price and Stock Section */}
				<div className="flex items-center justify-between">
					<div className="flex flex-col">
						<p className="text-indigo-600 font-bold text-lg md:text-xl">
							${product.price}
						</p>
						{product.oldPrice && (
							<p className="text-xs md:text-sm text-gray-500 line-through">
								${product.oldPrice}
							</p>
						)}
					</div>
					{/* Stock Status */}
					{product.stock <= 10 && product.stock > 0 ? (
						<span className="text-xs md:text-sm text-orange-500 whitespace-nowrap">
							Only {product.stock} left
						</span>
					) : product.stock === 0 ? (
						<span className="text-xs md:text-sm text-red-500">
							Out of stock
						</span>
					) : null}
				</div>

				{/* Add to Cart Button */}
				<motion.button
					onClick={handleAddToCart}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-colors duration-200
                        ${
													product.stock === 0
														? "bg-gray-100 text-gray-400 cursor-not-allowed"
														: "bg-indigo-600 text-white hover:bg-indigo-700"
												}`}
					disabled={product.stock === 0}
				>
					<ShoppingCart size={16} />
					<span>Add to Cart</span>
				</motion.button>
			</div>
		</motion.div>
	);
};

export default ProductCard;
