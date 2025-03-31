import React, { useEffect } from "react";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useAnalyticsStore } from "../stores/useAnalyticsStore"; // Import the store
import { Sidebar, Charts, Loading } from "../components"; // Import the Sidebar component

const Analytics = () => {
	const {
		data = {}, // Default to an empty object to avoid undefined errors
		dailySalesData = [], // Default to an empty array
		isLoading,
		getAnalytics,
	} = useAnalyticsStore(); // Destructure store data and methods

	useEffect(() => {
		getAnalytics(); // Fetch analytics data on component mount
	}, [getAnalytics]);

	const StatCard = ({ title, value, icon: Icon, color }) => (
		<motion.div
			className="bg-white rounded-lg shadow p-6"
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
		>
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm text-gray-500">{title}</p>
					<h3 className="text-2xl font-semibold mt-2">{value}</h3>
				</div>
				<div className={`p-3 rounded-full ${color}`}>
					<Icon className="w-6 h-6 text-white" />
				</div>
			</div>
		</motion.div>
	);

	if (isLoading) {
		return <Loading />; // Show loading state
	}

	return (
		<div className="flex h-screen bg-gray-100">
			{/* Sidebar */}
			<Sidebar />

			{/* Main Content */}
			<motion.main
				className="flex-1 p-6 space-y-6"
				initial={{ opacity: 0, x: -50 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5 }}
			>
				<h1 className="text-2xl font-semibold text-gray-900">
					Analytics Dashboard
				</h1>

				{/* Stats Grid */}
				<motion.div
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
					initial="hidden"
					animate="visible"
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: {
							opacity: 1,
							y: 0,
							transition: { staggerChildren: 0.2 },
						},
					}}
				>
					<StatCard
						title="Total Revenue"
						value={`$${data.totalRevenue || 0}`} // Fallback to 0 if undefined
						icon={DollarSign}
						color="bg-green-500"
					/>
					<StatCard
						title="Total Sales"
						value={data.totalSales || 0} // Fallback to 0 if undefined
						icon={ShoppingCart}
						color="bg-blue-500"
					/>
					<StatCard
						title="Total Products"
						value={data.products || 0} // Fallback to 0 if undefined
						icon={Package}
						color="bg-purple-500"
					/>
					<StatCard
						title="Total Users"
						value={data.users || 0} // Fallback to 0 if undefined
						icon={Users}
						color="bg-orange-500"
					/>
				</motion.div>

				{/* Charts */}
				<Charts dailySalesData={dailySalesData} />
			</motion.main>
		</div>
	);
};

export default Analytics;
