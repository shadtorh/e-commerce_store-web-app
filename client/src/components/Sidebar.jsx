import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Package, ShoppingCart, BarChart } from "lucide-react";

const Sidebar = () => {
	const location = useLocation(); // get the current path

	const sidebarVariants = {
		hidden: { x: -250, opacity: 0 },
		visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
	}; // animation for the sidebar

	const isActive = (path) => {
		return location.pathname === path;
	}; // check if the current path is the same as the path in the sidebar

	const links = [
		{ path: "/admin-dashboard", icon: Home, label: "Dashboard" },
		{ path: "/admin/products", icon: Package, label: "Products" },
		{ path: "/admin/orders", icon: ShoppingCart, label: "Orders" },
		{ path: "/admin/analytics", icon: BarChart, label: "Analytics" },
	]; // links for the sidebar

	return (
		<motion.aside
			className="w-64 bg-base-300 text-base-content p-4 h-full"
			initial="hidden"
			animate="visible"
			variants={sidebarVariants}
		>
			<nav className="space-y-4">
				{links.map((link) => {
					const Icon = link.icon;
					const active = isActive(link.path);

					return (
						<motion.div key={link.path} whileHover={{ x: 5 }}>
							<Link
								to={link.path}
								className={`flex items-center space-x-2 p-2 rounded-lg transition-colors
									${active ? "bg-gray-800 text-white" : "hover:bg-gray-300 hover:text-black"}`}
							>
								<motion.div
									animate={{
										scale: active ? 1.1 : 1,
										color: active ? "white" : "currentColor",
									}}
								>
									<Icon size={20} />
								</motion.div>
								<span className={active ? "font-medium" : ""}>
									{link.label}
								</span>
							</Link>
						</motion.div>
					);
				})}
			</nav>
		</motion.aside>
	);
};

export default Sidebar;
