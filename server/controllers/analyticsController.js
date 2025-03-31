import {
	getAdminAnalyticsData,
	getDailyRevenue,
} from "../utils/analyticsUtils.js";

export const getAdminAnalytics = async (req, res) => {
	try {
		const analyticsData = await getAdminAnalyticsData();

		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

		const dailySalesData = await getDailyRevenue(startDate, endDate);

		res.status(200).json({
			success: true,
			message: "Admin analytics fetched successfully",
			data: analyticsData,
			dailySalesData,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching admin analytics",
			error: error.message,
		});
	}
};
