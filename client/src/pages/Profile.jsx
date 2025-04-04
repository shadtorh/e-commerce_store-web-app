import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const Profile = () => {
	const { user, isLoading, updateProfile } = useUserStore();
	const [formData, setFormData] = useState({
		name: "",
	});

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		await getAllUsers();
	// 	};
	// 	fetchData();
	// }, [getAllUsers]);

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || "",
			});
		}
	}, [user]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageClick = () => {
		fileInputRef.current.click();
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateProfile(formData);
			// await fetchUser();
		} catch (error) {
			console.error("Failed to update profile:", error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-2xl mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="bg-white rounded-lg shadow p-6 md:p-8"
				>
					<h1 className="text-2xl font-bold mb-2">Your Profile</h1>
					<p className="text-gray-600 mb-6">Update your profile information</p>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Profile Picture */}

						{/* Name */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Name
							</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
								required
							/>
						</div>

						{/* Location */}

						{/* Email (Read-only) */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Email
							</label>
							<input
								type="email"
								value={user?.email || ""}
								className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200"
								disabled
							/>
							<p className="mt-1 text-sm text-gray-500">
								Email cannot be changed
							</p>
						</div>

						{/* Submit Button */}
						<motion.button
							type="submit"
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
							className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
							disabled={isLoading}
						>
							{isLoading ? (
								<div className="flex items-center justify-center">
									<Loader2 className="animate-spin mr-2" size={20} />
									<span>Saving Changes...</span>
								</div>
							) : (
								"Save Changes"
							)}
						</motion.button>
					</form>
				</motion.div>
			</div>
		</div>
	);
};

export default Profile;
