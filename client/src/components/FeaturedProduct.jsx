import React, { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore"; // Import the store
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
import Slider from "react-slick"; // Import react-slick for the slider
import "slick-carousel/slick/slick.css"; // Import slick styles
import "slick-carousel/slick/slick-theme.css";

const FeaturedProduct = () => {
	const { products, getFeaturedProducts } = useProductStore(); // Destructure store data

	useEffect(() => {
		getFeaturedProducts(); // Fetch featured products on component mount
	}, [getFeaturedProducts]);

	// Slider settings for react-slick
	const sliderSettings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 1024, // For tablets
				settings: {
					slidesToShow: 3,
				},
			},
			{
				breakpoint: 768, // For mobile devices
				settings: {
					slidesToShow: 2,
				},
			},
			{
				breakpoint: 480, // For smaller screens
				settings: {
					slidesToShow: 1,
				},
			},
		],
	};

	return (
		<div className="p-6 bg-gray-200 rounded-lg shadow">
			<motion.h1
				className="text-2xl font-semibold text-gray-900 mb-6"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				Featured Products
			</motion.h1>

			{/* If more than 4 products, use slider */}
			{products.length > 4 ? (
				<Slider {...sliderSettings}>
					{products.map((product) => (
						<motion.div
							key={product._id}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}
						>
							<ProductCard product={product} />
						</motion.div>
					))}
				</Slider>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{products.map((product) => (
						<motion.div
							key={product._id}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}
						>
							<ProductCard product={product} />
						</motion.div>
					))}
				</div>
			)}
		</div>
	);
};

export default FeaturedProduct;
