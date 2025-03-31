import { create } from "zustand";
import axios from "../utils/axios";
import { toast } from "react-toastify";

export const useAnalyticsStore = create((set) => ({
	// Default state
	data: {
		totalRevenue: 0,
		totalOrders: 0,
		products: 0,
		users: 0,
	},
	dailySalesData: [], // Renamed for consistency with the frontend
	// categoryData: [],
	// recentOrders: [],
	isLoading: false,
	error: null,

	// Fetch analytics data
	getAnalytics: async () => {
		set({ isLoading: true, error: null }); // Reset loading and error state
		try {
			const response = await axios.get("/analytics");
			console.log("Analytics data fetched:", response.data);

			if (response.data.success) {
				const { data, dailySalesData } = response.data;
				console.log("Analytics data:", data);

				// Update the store with fetched data
				set({
					data,
					dailySalesData,
					isLoading: false,
				});
			} else {
				// Handle unsuccessful response
				toast.error(response.data.message || "Failed to fetch analytics data");
				set({
					isLoading: false,
					error: response.data.message || "Unknown error",
				});
			}
		} catch (error) {
			// Handle request errors
			console.error("Error fetching analytics:", error);
			toast.error("Failed to fetch analytics data");
			set({ error: error.message, isLoading: false });
		}
	},
}));
