import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import airpodesImage from "../assets/products/airpodes/boAt Airdopes 111 1.webp";
import cameraImage from "../assets/products/camera/CP PLUS 3MP Full HD Smart Wi-fi CCTV Home Security Camera 1.jpg";
import speakersImage from "../assets/products/speakers/boAt Stone 1200 1.webp";
import printersImage from "../assets/products/printers/Canon PIXMA MG2470 All-in-One Inkjet Printer (White, Grey, Ink Cartridge) 1.webp";

const categories = [
	{
		href: "/airpod",
		label: "Wireless Earbuds",
		description: "Premium audio for everyday life",
		image: airpodesImage,
	},
	{
		href: "/camera",
		label: "Security Cameras",
		description: "Keep your home safe and secure",
		image: cameraImage,
	},
	{
		href: "/speaker",
		label: "Speakers",
		description: "Immersive sound experience",
		image: speakersImage,
	},
	{
		href: "/printer",
		label: "Printers",
		description: "Professional printing solutions",
		image: printersImage,
	},
];

const Categories = () => {
	return (
		<div className="bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
					<div>
						<h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
							Shop by Category
						</h2>
						<p className="mt-2 text-gray-600 max-w-2xl">
							Explore our curated collection of premium electronics and
							accessories
						</p>
					</div>
					{/* <Link
						to="/products"
						className="mt-4 md:mt-0 inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
					>
						View All Categories
						<ArrowRight size={16} className="ml-2" />
					</Link> */}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{categories.map((category) => (
						<motion.div
							key={category.href}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
						>
							<Link to={"/category" + category.href} className="group block">
								<div className="relative overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-[350px]">
									{/* Image Container */}
									<div className="h-[180px] bg-gray-100 flex items-center justify-center">
										<img
											src={category.image}
											alt={category.label}
											className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
										/>
									</div>

									{/* Content */}
									<div className="p-4 flex flex-col flex-grow">
										<h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors text-center">
											{category.label}
										</h3>
										<p className="mt-2 text-sm text-gray-600 text-center">
											{category.description}
										</p>

										<div className="mt-auto flex items-center justify-center">
											<span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700 flex items-center">
												Browse
												<ArrowRight
													size={14}
													className="ml-1 transition-transform group-hover:translate-x-1"
												/>
											</span>
										</div>
									</div>
								</div>
							</Link>
						</motion.div>
					))}
				</div>

				{/* Featured Category Banner */}
				<div className="mt-16 bg-indigo-600 rounded-2xl overflow-hidden">
					<div className="px-8 py-12 relative">
						<div className="relative z-10 max-w-xl">
							<h3 className="text-2xl font-semibold text-white mb-4">
								New Arrivals in Audio
							</h3>
							<p className="text-indigo-100 mb-6">
								Discover our latest collection of premium audio devices
							</p>
							<Link
								to="/category/audio"
								className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
							>
								Explore Collection
							</Link>
						</div>
						<div className="absolute right-0 bottom-0 opacity-10">
							{/* You can add a decorative SVG or pattern here */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Categories;
