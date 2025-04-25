import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Package, ShoppingCart, BarChart, Menu, X } from "lucide-react";

const Sidebar = () => {
	const location = useLocation();
	const [isOpen, setIsOpen] = useState(false);

	const toggleSidebar = () => setIsOpen(!isOpen);

	const sidebarVariants = {
		hidden: {
			x: -300,
			opacity: 0,
		},
		visible: {
			x: 0,
			opacity: 1,
			transition: {
				duration: 0.3,
			},
		},
	};

	const isActive = (path) => {
		return location.pathname === path;
	};

	const links = [
		{ path: "/admin-dashboard", icon: Home, label: "Dashboard" },
		{ path: "/admin/products", icon: Package, label: "Products" },
		{ path: "/admin/analytics", icon: BarChart, label: "Analytics" },
	];

	return (
		<>
			{/* Mobile menu button */}
			<button
				onClick={toggleSidebar}
				className="lg:hidden fixed top-20 left-4 z-30 p-2 rounded-md bg-gray-800 text-white shadow-lg"
				aria-label="Toggle menu"
			>
				{isOpen ? <X size={20} /> : <Menu size={20} />}
			</button>

			{/* Overlay for mobile when sidebar is open */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.5 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black lg:hidden z-20"
						onClick={toggleSidebar}
					/>
				)}
			</AnimatePresence>

			{/* Sidebar */}
			<AnimatePresence>
				<motion.aside
					className={`fixed lg:static top-0 left-0 z-30 h-full w-64 bg-gray-800 text-white shadow-lg transform ${
						isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
					} transition-transform duration-300 ease-in-out lg:transition-none`}
					initial="hidden"
					animate="visible"
					variants={sidebarVariants}
				>
					{/* Brand/Logo Area */}
					<div className="p-4 border-b border-gray-700">
						<h2 className="text-xl font-bold">Admin Panel</h2>
					</div>

					{/* Navigation Links */}
					<nav className="p-4 space-y-2">
						{links.map((link) => {
							const Icon = link.icon;
							const active = isActive(link.path);

							return (
								<motion.div
									key={link.path}
									whileHover={{ x: 4 }}
									onClick={() => setIsOpen(false)} // Close sidebar on mobile when link clicked
								>
									<Link
										to={link.path}
										className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
											active
												? "bg-blue-600 text-white"
												: "text-gray-300 hover:bg-gray-700 hover:text-white"
										}`}
									>
										<motion.div
											animate={{
												scale: active ? 1.1 : 1,
											}}
										>
											<Icon size={18} />
										</motion.div>
										<span className={`${active ? "font-medium" : ""}`}>
											{link.label}
										</span>
									</Link>
								</motion.div>
							);
						})}
					</nav>
				</motion.aside>
			</AnimatePresence>
		</>
	);
};

export default Sidebar;
