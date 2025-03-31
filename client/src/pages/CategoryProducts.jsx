import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ErrorPage from "../components/ErrorPage";

const CategoryProducts = () => {
	const { getProductsByCategory, isLoading, error, products } =
		useProductStore();
	const { category } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		getProductsByCategory(category);
	}, [getProductsByCategory, category]);

	if (isLoading) return <Loading />;
	if (error) return <ErrorPage />;

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4">
				{/* Back Button */}
				<motion.button
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					onClick={() => navigate("/")}
					className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 group"
				>
					<ArrowLeft
						size={20}
						className="group-hover:-translate-x-1 transition-transform duration-200"
					/>
					<span>Back to Home</span>
				</motion.button>

				{/* Category Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8 text-center"
				>
					<h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
						{category.charAt(0).toUpperCase() + category.slice(1)}
					</h1>
					<div className="w-20 h-1 bg-indigo-600 mx-auto"></div>
				</motion.div>

				{/* Products Grid */}
				{products.length === 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center text-gray-600 text-xl"
					>
						No products found for {category}
					</motion.div>
				) : (
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
					>
						{products.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default CategoryProducts;
