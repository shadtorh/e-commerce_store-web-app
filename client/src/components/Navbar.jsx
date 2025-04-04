import React, { useState, useRef, useEffect } from "react";
import { Search, ShoppingCart, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import Loading from "./Loading";

const Navbar = () => {
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const { user, logout, isLoading } = useUserStore();
	const { cart, getCartItems } = useCartStore();

	const isUser = user?.role === "user";
	const isAdmin = user?.role === "admin";

	const profileRef = useRef(null);

	// Fetch cart items and user authentication status on load
	useEffect(() => {
		if (user) {
			getCartItems();
		}
	}, [user]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (profileRef.current && !profileRef.current.contains(event.target)) {
				setIsProfileOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleLinkClick = () => {
		setIsProfileOpen(false);
	};

	const handleLogout = () => {
		logout();
		handleLinkClick();
		cart.length = 0; // Clear cart on logout
	};

	if (isLoading) {
		return null; // Show loading state
	}

	return (
		<nav className="bg-white shadow-md sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center h-16">
					{/* Logo */}
					<Link
						to="/"
						className="text-xl sm:text-2xl font-bold text-indigo-600 whitespace-nowrap shrink-0"
					>
						Torh<span className="text-gray-600">Mart</span>
					</Link>

					{/* Search Bar */}
					<div className="flex-1 px-2 sm:px-4 lg:px-6 min-w-0">
						<div className="relative max-w-2xl mx-auto">
							<input
								type="text"
								placeholder="Search products..."
								className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
							<Search
								className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400"
								size={18}
							/>
						</div>
					</div>

					{/* Navigation Items */}
					<div className="flex items-center gap-2 sm:gap-4 lg:gap-6 shrink-0">
						{/* Cart - Only for users */}

						<Link
							to="/cart"
							className="relative text-gray-700 hover:text-indigo-600 p-1"
							onClick={handleLinkClick}
						>
							<ShoppingCart size={22} />
							{cart.length > 0 && (
								<span className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
									{/* {cart.reduce((total, item) => total + item.quantity, 0)}  */}
									{cart.length}
								</span>
							)}
						</Link>

						{/* Admin Dashboard Link */}
						{isAdmin && (
							<Link
								to="/admin-dashboard"
								className="text-gray-700 hover:text-indigo-600 font-medium whitespace-nowrap text-sm sm:text-base"
								onClick={handleLinkClick}
							>
								<button className="bg-indigo-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 whitespace-nowrap text-sm sm:text-base">
									Dashboard
								</button>
							</Link>
						)}

						{/* Auth Section */}
						{!user ? (
							<div className="flex items-center gap-2 sm:gap-3">
								<Link
									to="/login"
									className="text-gray-700 hover:text-indigo-600 font-medium whitespace-nowrap text-sm sm:text-base"
									onClick={handleLinkClick}
								>
									Login
								</Link>
								<Link
									to="/signup"
									className="bg-indigo-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 whitespace-nowrap text-sm sm:text-base"
									onClick={handleLinkClick}
								>
									Sign up
								</Link>
							</div>
						) : (
							<div className="relative" ref={profileRef}>
								<button
									onClick={() => setIsProfileOpen(!isProfileOpen)}
									className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 p-1"
								>
									<User size={20} />
									<span className="hidden sm:inline text-sm sm:text-base">
										{user?.name || "Profile"}
									</span>
								</button>

								{isProfileOpen && (
									<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
										<Link
											to="/update-profile"
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
											onClick={handleLinkClick}
										>
											My Profile
										</Link>
										<button
											onClick={handleLogout}
											className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
										>
											<div className="flex items-center gap-2">
												<LogOut size={16} />
												<span>Logout</span>
											</div>
										</button>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
