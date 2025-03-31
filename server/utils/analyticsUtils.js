import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

export const getAdminAnalyticsData = async () => {
	try {
		// Count total users and products
		const totalUsers = await User.countDocuments();
		const totalProducts = await Product.countDocuments();

		// Aggregate total sales and revenue
		const salesData = await Order.aggregate([
			{
				$group: {
					_id: null,
					totalSales: { $sum: 1 },
					totalRevenue: { $sum: "$totalAmount" }, // Ensure correct field name
				},
			},
		]);

		// Avoid errors if no sales data exists
		const { totalSales, totalRevenue } = salesData[0] || {
			totalSales: 0,
			totalRevenue: 0,
		};

		return {
			users: totalUsers,
			products: totalProducts,
			totalRevenue,
			totalSales,
		};
	} catch (error) {
		console.error("Error fetching admin analytics data:", error);
		throw new Error("Failed to retrieve admin analytics data");
	}
};

export const getDailyRevenue = async (startDate, endDate) => {
	try {
		const start = new Date(startDate);
		const end = new Date(endDate);

		console.log("Start Date:", start);
		console.log("End Date:", end);

		const dailyRevenue = await Order.aggregate([
			{
				$match: {
					createdAt: { $gte: start, $lte: end },
				},
			},
			{
				$group: {
					_id: {
						year: { $year: "$createdAt" },
						dayOfYear: { $dayOfYear: "$createdAt" },
					},
					sales: { $sum: 1 },
					revenue: { $sum: "$totalAmount" },
				},
			},
			{
				$sort: { "_id.dayOfYear": 1 },
			},
		]);

		console.log("Daily Revenue Aggregation Result:", dailyRevenue);

		const dateArray = getDatesInRange(startDate, endDate);

		const dailyData = dateArray.map((dateString) => {
			// Convert dateString back to a Date object
			const date = new Date(dateString);

			const dayOfYear = Math.floor(
				(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
					Date.UTC(date.getFullYear(), 0, 0)) /
					(1000 * 60 * 60 * 24)
			);

			const dailyData = dailyRevenue.find(
				(item) => item._id.dayOfYear === dayOfYear
			);

			return {
				date: date.toISOString().split("T")[0], // Convert back to string for output
				sales: dailyData?.sales || 0,
				revenue: dailyData?.revenue || 0,
			};
		});

		console.log("Mapped Daily Data:", dailyData);

		return dailyData;
	} catch (error) {
		console.error("Error getting daily revenue:", error);
		throw new Error("Failed to retrieve daily revenue");
	}
};

// get all dates in range
export const getDatesInRange = (startDate, endDate) => {
	const dates = [];
	const currentDate = new Date(startDate);
	while (currentDate <= endDate) {
		dates.push(currentDate.toISOString().split("T")[0]);
		currentDate.setDate(currentDate.getDate() + 1);
	}
	return dates;
};
