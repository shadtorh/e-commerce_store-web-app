import React, { useEffect } from "react";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useAnalyticsStore } from "../stores/useAnalyticsStore";
import { Sidebar, Charts, Loading } from "../components";

const Analytics = () => {
	const {
		data = {},
		dailySalesData = [],
		isLoading,
		getAnalytics,
	} = useAnalyticsStore();

	useEffect(() => {
		getAnalytics();
	}, [getAnalytics]);

	const StatCard = ({ title, value, icon: Icon, color }) => (
		<motion.div
			className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300"
			whileHover={{ scale: 1.03 }}
			whileTap={{ scale: 0.98 }}
		>
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<p className="text-xs sm:text-sm text-gray-500 font-medium">
						{title}
					</p>
					<h3 className="text-xl sm:text-2xl font-bold">{value}</h3>
				</div>
				<div className={`p-2 sm:p-3 rounded-full ${color}`}>
					<Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
				</div>
			</div>
		</motion.div>
	);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div className="flex flex-col lg:flex-row h-screen bg-gray-100 overflow-hidden">
			{/* Sidebar - will be responsive based on Sidebar component changes */}
			<Sidebar />

			{/* Main Content - with improved scrolling and padding */}
			<motion.main
				className="flex-1 p-4 sm:p-6 overflow-y-auto pb-24"
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5 }}
			>
				<h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
					Analytics Dashboard
				</h1>

				{/* Stats Grid - improved responsive breakpoints */}
				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
					initial="hidden"
					animate="visible"
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: {
							opacity: 1,
							y: 0,
							transition: { staggerChildren: 0.1 },
						},
					}}
				>
					<StatCard
						title="Total Revenue"
						value={`$${data.totalRevenue || 0}`}
						icon={DollarSign}
						color="bg-green-500"
					/>
					<StatCard
						title="Total Sales"
						value={data.totalSales || 0}
						icon={ShoppingCart}
						color="bg-blue-500"
					/>
					<StatCard
						title="Total Products"
						value={data.products || 0}
						icon={Package}
						color="bg-purple-500"
					/>
					<StatCard
						title="Total Users"
						value={data.users || 0}
						icon={Users}
						color="bg-orange-500"
					/>
				</motion.div>

				{/* Charts - add top margin for better spacing */}
				<div className="mt-6 sm:mt-8">
					<Charts dailySalesData={dailySalesData} />
				</div>
			</motion.main>
		</div>
	);
};

export default Analytics;
