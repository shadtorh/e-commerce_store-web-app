import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, ShoppingBag, Box, Users } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useProductStore } from "../stores/useProductStore";
import { useUserStore } from "../stores/useUserStore";
const AdminPanel = () => {
	const { getAllProducts, products } = useProductStore();
	const { users, isLoading, getAllUsers } = useUserStore();

	useEffect(() => {
		getAllProducts();
		getAllUsers();
	}, [getAllProducts, getAllUsers]);

	const contentVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				when: "beforeChildren",
				staggerChildren: 0.1,
			},
		},
	};

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<div className="flex h-screen bg-gray-50">
			<Sidebar />

			<motion.main
				className="flex-1 p-8"
				initial="hidden"
				animate="visible"
				variants={contentVariants}
			>
				<motion.h1 className="text-3xl font-bold mb-8" variants={cardVariants}>
					Dashboard
				</motion.h1>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<motion.div
						className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
						variants={cardVariants}
						whileHover={{ scale: 1.02 }}
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 mb-1">Total Revenue</p>
								<h3 className="text-2xl font-bold">$45,231.89</h3>
								<p className="text-green-600 text-sm">+20.1% from last month</p>
							</div>
							<DollarSign className="text-gray-400" size={24} />
						</div>
					</motion.div>

					<motion.div
						className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
						variants={cardVariants}
						whileHover={{ scale: 1.02 }}
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 mb-1">Sales</p>
								<h3 className="text-2xl font-bold">+12,234</h3>
								<p className="text-green-600 text-sm">+19% from last month</p>
							</div>
							<ShoppingBag className="text-gray-400" size={24} />
						</div>
					</motion.div>

					<motion.div
						className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
						variants={cardVariants}
						whileHover={{ scale: 1.02 }}
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 mb-1">Products</p>
								<h3 className="text-2xl font-bold">
									{isLoading ? (
										<span className="animate-pulse">...</span>
									) : (
										products?.length || 0
									)}
								</h3>
								<p className="text-gray-600 text-sm">+201 new products</p>
							</div>
							<Box className="text-gray-400" size={24} />
						</div>
					</motion.div>

					<motion.div
						className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
						variants={cardVariants}
						whileHover={{ scale: 1.02 }}
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 mb-1">Total Users</p>
								<h3 className="text-2xl font-bold">
									{isLoading ? (
										<span className="animate-pulse">...</span>
									) : (
										users?.length || 0
									)}
								</h3>
							</div>
							<Users className="text-gray-400" size={24} />
						</div>
					</motion.div>
				</div>

				{/* Sales Overview */}
				<motion.div
					className="bg-white p-6 rounded-lg shadow-sm"
					variants={cardVariants}
				>
					<h2 className="text-xl font-bold mb-2">Sales Overview</h2>
					<p className="text-gray-600 mb-4">
						Monthly sales performance for the current year
					</p>
					<div className="h-64 bg-gray-50 rounded-lg"></div>
				</motion.div>
			</motion.main>
		</div>
	);
};

export default AdminPanel;
