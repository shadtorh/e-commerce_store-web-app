import { create } from "zustand";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import { useUserStore } from "./useUserStore";
export const useCartStore = create((set, get) => ({
	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	isLoading: false,
	isCouponApplied: false,
	coupons: [],

	getCartItems: async () => {
		set({ isLoading: true });
		const { user } = useUserStore.getState();
		if (!user) {
			set({ isLoading: false });
			return;
		}
		try {
			const response = await axios.get("/cart");

			if (response.data.success) {
				set({ cart: response.data.cart });
				// Calculate totals after setting cart
				get().calculateTotals();
			}
		} catch (error) {
			set({ cart: [], subtotal: 0, total: 0 });
			console.log(error);
			toast.error("Failed to get cart items");
		} finally {
			set({ isLoading: false });
		}
	},

	addToCart: async (productId) => {
		try {
			// set({ cart: [...get().cart, productId] }); // add the productId to the cart
			await axios.post("/cart", { productId });
			toast.success("Product added to cart");
			// await get().getCartItems();

			set((state) => {
				const cartItem = state.cart.find((item) => item._id === productId);
				const newCart = cartItem
					? state.cart.map((item) =>
							item._id === productId
								? { ...item, quantity: item.quantity + 1 }
								: item
						)
					: [...state.cart, { _id: productId, quantity: 1 }];

				return { cart: newCart };
			});
			get().calculateTotals();
		} catch (error) {
			console.error("Add to cart error:", error);
			toast.error(error.response?.data?.message || "Failed to add to cart");
		} finally {
			set({ isLoading: false });
		}
	},

	calculateTotals: () => {
		const { cart, coupon } = get();
		if (!cart.length) {
			set({ subtotal: 0, total: 0 });
			return;
		}

		const subtotal = cart.reduce((sum, item) => {
			// Check if price and quantity exist and are numbers
			const price = Number(item.price) || 0;
			const quantity = Number(item.quantity) || 0;
			return sum + price * quantity;
		}, 0);

		let total = subtotal;
		if (coupon && coupon.discount) {
			const discount = (subtotal * Number(coupon.discount)) / 100;
			total = subtotal - discount;
		}

		set({ total, subtotal });
	},

	getCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			if (response.data.success) {
				set({
					coupons: response.data.coupons || [],
				});
			}
		} catch (error) {
			console.log(error);
			toast.error("Failed to get coupons");
			set({ coupons: [] });
		}
	},

	applyCoupon: async (couponCode) => {
		try {
			const response = await axios.post("/coupons/validate", { couponCode });
			if (!response.data.success) {
				toast.error(response.data.message || "Invalid coupon code");
				return;
			}
			if (response.data.success) {
				set({
					coupon: response.data.coupon,
					isCouponApplied: true,
				});
				toast.success("Coupon applied successfully");
				get().calculateTotals();
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},

	removeCoupon: async () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals(); // Recalculate totals after removing coupon
		toast.success("Coupon removed successfully");
	},

	increaseQuantity: async (productId) => {
		try {
			const response = await axios.put(`/cart/${productId}`, {
				quantity:
					get().cart.find((item) => item._id === productId).quantity + 1,
			});
			if (response.data.success) {
				await get().getCartItems();
			}
		} catch (error) {
			console.log(error);
			toast.error("Failed to update quantity");
		}
	},

	decreaseQuantity: async (productId) => {
		try {
			const currentQuantity = get().cart.find(
				(item) => item._id === productId
			).quantity;
			if (currentQuantity <= 1) return;

			const response = await axios.put(`/cart/${productId}`, {
				quantity: currentQuantity - 1,
			});
			if (response.data.success) {
				await get().getCartItems();
			}
		} catch (error) {
			console.log(error);
			toast.error("Failed to update quantity");
		}
	},

	removeFromCart: async (productId) => {
		try {
			const response = await axios.delete(`/cart`, {
				data: { productId },
			});
			console.log(response);
			if (response.data.success) {
				await get().getCartItems();
				toast.success("Item removed from cart");
			}
		} catch (error) {
			toast.error("Failed to remove item");
			console.log(error);
		}
	},

	clearCart: async () => {
		await axios.delete("/cart");
		set({ cart: [], subtotal: 0, total: 0 });
		await get().getCartItems();
	},
}));
