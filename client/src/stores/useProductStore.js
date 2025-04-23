import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "../utils/axios";

export const useProductStore = create((set, get) => ({
	products: [],
	isLoading: false,
	error: null,
	setProducts: (products) => set({ products }),

	createProduct: async ({
		image,
		name,
		price,
		description,
		category,
		stock,
	}) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post("/products", {
				name,
				price,
				description,
				image,
				category,
				stock,
			});
			set({ products: [...get().products, response.data] });

			toast.success("Product created successfully");
		} catch (error) {
			set({ error: error.response?.data?.message || "An error occurred" });
			toast.error(error.response?.data?.message || "An error occurred");
		} finally {
			set({ isLoading: false });
		}
	},

	getAllProducts: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get("/products");
			console.log("Products:", response.data);
			set({ products: response.data.products });
		} catch (error) {
			set({ error: error.response?.data?.message || "An error occurred" });
			toast.error(error.response?.data?.message || "An error occurred");
		} finally {
			set({ isLoading: false });
		}
	},

	deleteProduct: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axios.delete(`/products/${id}`);
			set({ products: get().products.filter((product) => product._id !== id) });
			toast.success("Product deleted successfully");
		} catch (error) {
			set({ error: error.response?.data?.message || "An error occurred" });
			toast.error(error.response?.data?.message || "An error occurred");
		} finally {
			set({ isLoading: false });
		}
	},

	toggleFeaturedProduct: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.patch(`/products/${id}`);
			set((state) => ({
				products: state.products.map((product) =>
					product._id === id
						? { ...product, isFeatured: response.data.isFeatured }
						: product
				),
			}));
			toast.success("Product featured status updated successfully");
		} catch (error) {
			set({ error: error.response?.data?.message || "An error occurred" });
			toast.error(error.response?.data?.message || "An error occurred");
		} finally {
			set({ isLoading: false });
		}
	},

	updateProduct: async (id, data) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.put(`/products/${id}`, data);
			set({
				products: get().products.map((product) =>
					product._id === id ? { ...product, ...response.data } : product
				),
			});
			toast.success("Product updated successfully");
		} catch (error) {
			set({ error: error.response?.data?.message || "An error occurred" });
			toast.error(error.response?.data?.message || "An error occurred");
		} finally {
			set({ isLoading: false });
		}
	},

	getProductsByCategory: async (category) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(`/products/category/${category}`);

			set({ products: response.data.products });
		} catch (error) {
			set({ error: error.response?.data?.message || "An error occurred" });
			toast.error(error.response?.data?.message || "An error occurred");
		} finally {
			set({ isLoading: false });
		}
	},

	getRecommendedProducts: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get("/products/recommended");
			// console.log(response.data);
			set({ products: response.data.products });
		} catch (error) {
			set({ error: error.response?.data?.message || "An error occurred" });
			// toast.error(error.response?.data?.message || "An error occurred");
		} finally {
			set({ isLoading: false });
		}
	},

	getFeaturedProducts: async () => {
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data.products });
		} catch (error) {
			set({ error: error.response?.data?.message || "An error occurred" });
			toast.error(error.response?.data?.message || "An error occurred");
		}
	},
}));
