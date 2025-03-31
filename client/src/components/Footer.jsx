import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
		},
	};

	return (
		<motion.footer
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true }}
			className="bg-white border-t"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid grid-cols-1 md:grid-cols-4 gap-8"
				>
					{/* Logo and Description */}
					<motion.div variants={itemVariants} className="col-span-1">
						<Link to="/" className="text-2xl font-bold text-indigo-600">
							Torh<span className="text-gray-600">Mart</span>
						</Link>
						<p className="mt-4 text-gray-600">
							Your one-stop shop for all your needs.
						</p>
					</motion.div>

					{/* Shop Links */}
					<motion.div variants={itemVariants}>
						<h3 className="text-gray-900 font-semibold mb-4">Shop</h3>
						<ul className="space-y-3">
							<li>
								<Link
									to="/products"
									className="text-gray-600 hover:text-indigo-600"
								>
									All Products
								</Link>
							</li>
							<li>
								<Link
									to="/new-arrivals"
									className="text-gray-600 hover:text-indigo-600"
								>
									New Arrivals
								</Link>
							</li>
							<li>
								<Link
									to="/best-sellers"
									className="text-gray-600 hover:text-indigo-600"
								>
									Best Sellers
								</Link>
							</li>
							<li>
								<Link
									to="/sale"
									className="text-gray-600 hover:text-indigo-600"
								>
									Sale
								</Link>
							</li>
						</ul>
					</motion.div>

					{/* Support Links */}
					<motion.div variants={itemVariants}>
						<h3 className="text-gray-900 font-semibold mb-4">Support</h3>
						<ul className="space-y-3">
							<li>
								<Link
									to="/contact"
									className="text-gray-600 hover:text-indigo-600"
								>
									Contact Us
								</Link>
							</li>
							<li>
								<Link
									to="/faqs"
									className="text-gray-600 hover:text-indigo-600"
								>
									FAQs
								</Link>
							</li>
							<li>
								<Link
									to="/shipping"
									className="text-gray-600 hover:text-indigo-600"
								>
									Shipping & Returns
								</Link>
							</li>
							<li>
								<Link
									to="/track-order"
									className="text-gray-600 hover:text-indigo-600"
								>
									Track Order
								</Link>
							</li>
						</ul>
					</motion.div>

					{/* Company Links */}
					<motion.div variants={itemVariants}>
						<h3 className="text-gray-900 font-semibold mb-4">Company</h3>
						<ul className="space-y-3">
							<li>
								<Link
									to="/about"
									className="text-gray-600 hover:text-indigo-600"
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									to="/blog"
									className="text-gray-600 hover:text-indigo-600"
								>
									Blog
								</Link>
							</li>
							<li>
								<Link
									to="/careers"
									className="text-gray-600 hover:text-indigo-600"
								>
									Careers
								</Link>
							</li>
							<li>
								<Link
									to="/privacy"
									className="text-gray-600 hover:text-indigo-600"
								>
									Privacy Policy
								</Link>
							</li>
						</ul>
					</motion.div>
				</motion.div>

				{/* Bottom Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="mt-12 pt-8 border-t border-gray-100"
				>
					<div className="flex flex-col md:flex-row justify-between items-center">
						<p className="text-gray-600">
							© {new Date().getFullYear()} TorhMart. All rights reserved.
						</p>
						<div className="flex space-x-6 mt-4 md:mt-0">
							{[Facebook, Instagram, Twitter].map((Icon, index) => (
								<motion.a
									key={index}
									whileHover={{ scale: 1.2, rotate: 5 }}
									whileTap={{ scale: 0.9 }}
									href="#"
									className="text-gray-600 hover:text-indigo-600"
								>
									<Icon size={20} />
								</motion.a>
							))}
						</div>
					</div>
				</motion.div>
			</div>
		</motion.footer>
	);
};

export default Footer;
