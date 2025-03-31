import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const Profile = () => {
	const { user, isLoading, updateProfile } = useUserStore();
	const [formData, setFormData] = useState({
		name: user?.name || "",
		location: user?.location || "",
		avatar: user?.avatar || "",
	});
	const [imagePreview, setImagePreview] = useState(user?.avatar || "");
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef(null);

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

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file && file.type.startsWith("image/")) {
			setIsUploading(true);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
				setFormData((prev) => ({
					...prev,
					avatar: reader.result,
				}));
				setIsUploading(false);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateProfile(formData);
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
						<div className="flex flex-col items-center">
							<div className="relative">
								<div
									className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer group"
									onClick={handleImageClick}
								>
									{isUploading ? (
										<Loader2 className="h-8 w-8 animate-spin text-gray-400" />
									) : imagePreview ? (
										<img
											src={imagePreview}
											alt="Profile"
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="text-gray-400">
											<Camera size={32} />
										</div>
									)}
									<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
										<Camera className="text-white" size={24} />
									</div>
								</div>
								<input
									type="file"
									ref={fileInputRef}
									onChange={handleImageChange}
									accept="image/*"
									className="hidden"
								/>
							</div>
							<p className="text-sm text-gray-500 mt-2">
								Click the camera icon to upload a photo
							</p>
						</div>

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
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Location
							</label>
							<input
								type="text"
								name="location"
								value={formData.location}
								onChange={handleChange}
								placeholder="Enter your location"
								className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>

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
