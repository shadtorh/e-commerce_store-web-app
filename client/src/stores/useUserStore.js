import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "../utils/axios";

export const useUserStore = create((set) => ({
	user: null,
	isLoading: false, // Ensure isLoading is initialized as false
	error: null,
	checkingAuth: true,

	// setUser: (user) => set({ user }),

	signup: async ({ name, email, password, confirmPassword }, navigate) => {
		set({ isLoading: true, error: null });
		if (password !== confirmPassword) {
			set({ isLoading: false });
			toast.error("Passwords do not match");
			return;
		}
		try {
			await axios.post("/auth/signup", {
				name,
				email,
				password,
			});
			toast.success("Account created successfully");
			navigate("/login");
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || "Something went wrong";

			toast.error(errorMessage);
			// throw error;
		} finally {
			set({ isLoading: false }); // Reset isLoading after signup attempt
		}
	},

	login: async ({ email, password }, navigate) => {
		set({ isLoading: true, error: null });

		if (!email || !password) {
			set({ isLoading: false });
			toast.error("Please enter email and password");
			return;
		}
		try {
			const response = await axios.post("/auth/login", { email, password });
			//store token in local storage
			localStorage.setItem("token", response.data.token);

			toast.success(response.data.message);
			navigate("/");
			set({ user: response.data.user });
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || "Something went wrong";
			toast.error(errorMessage);
		} finally {
			set({ isLoading: false }); // Reset isLoading after login attempt
		}
	},

	logout: async () => {
		set({ isLoading: true });
		try {
			await axios.post("/auth/logout");
			localStorage.removeItem("token"); // Remove token from local storage
			set({ user: null, isLoading: false });
			toast.success("Logged out successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Something went wrong");
		} finally {
			set({ isLoading: false }); // Reset isLoading after logout attempt
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true, isLoading: true }); // Ensure both states are set
		try {
			const response = await axios.get("/auth/profile");
			set({ user: response.data.user, checkingAuth: false, isLoading: false }); // Reset both states on success
		} catch (error) {
			set({ user: null, checkingAuth: false, isLoading: false }); // Reset both states on failure
			set({ error: error.response?.data?.message || "Something went wrong" });
		}
	},

	getAllUsers: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get("/auth/users");
			set({ users: response.data });
		} catch (error) {
			set({ error: error.response?.data?.message || "Something went wrong" });
		} finally {
			set({ isLoading: false }); // Reset isLoading after fetching users
		}
	},

	updateProfile: async (updateData) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.put("/auth/update-profile", updateData);
			// console.log("Update response:", response.data); // Debugging log

			set({ user: response.data.user }); // Update user state with the updated user data
			toast.success(response.data.message);
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || "Something went wrong";
			toast.error(errorMessage);
		} finally {
			set({ isLoading: false }); // Reset isLoading after update attempt
		}
	},
}));
