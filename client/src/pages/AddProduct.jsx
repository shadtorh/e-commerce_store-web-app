import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useProductStore } from "../stores/useProductStore";
import Loading from "../components/Loading";
import { categories } from "../data";

const AddProduct = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		category: "",
		price: "",
		stock: "",
		image: "",
	});

	const [imagePreview, setImagePreview] = useState(null);
	const [dragActive, setDragActive] = useState(false);

	const { createProduct, isLoading, error } = useProductStore();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		handleImageFile(file);
	};

	const handleImageFile = (file) => {
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader(); // FileReader is a built-in object that provides methods to read the contents of files
			reader.onload = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file); // readAsDataURL is a method that reads the content of the file as a data URL
		}
	}; // handleImageFile

	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	}; // handleDrag is a function that handles the drag event for the image upload

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleImageFile(e.dataTransfer.files[0]);
		}
	}; // handleDrop is a function that handles the drop event for the image upload

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await createProduct({ ...formData, image: imagePreview });
			navigate("/admin/products");
			setFormData({
				name: "",
				description: "",
				category: "Electronics",
				price: "",
			});
		} catch (error) {
			console.log(error);
		}
	};

	if (isLoading) return <Loading />;
	if (error)
		return (
			<div className="flex justify-center items-center h-screen">{error}</div>
		);

	return (
		<div className="flex h-screen bg-gray-50">
			<Sidebar />

			<motion.div
				className="flex-1 p-8 overflow-y-auto"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-bold mb-8">Add New Product</h1>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Image Upload Section */}
						<div className="mb-6">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Product Image
							</label>
							<div
								className={`relative border-2 border-dashed rounded-lg p-4 text-center ${
									dragActive ? "border-gray-500 bg-gray-50" : "border-gray-300"
								} transition-colors`}
								onDragEnter={handleDrag}
								onDragLeave={handleDrag}
								onDragOver={handleDrag}
								onDrop={handleDrop}
							>
								<input
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className="hidden"
									id="image-upload"
								/>

								{imagePreview ? (
									<div className="relative w-full h-48 group">
										<img
											src={imagePreview}
											alt="Product preview"
											className="w-full h-full object-contain rounded-lg"
										/>
										<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
											<label
												htmlFor="image-upload"
												className="text-white cursor-pointer flex items-center gap-2"
											>
												<Upload size={20} />
												Change Image
											</label>
										</div>
									</div>
								) : (
									<label
										htmlFor="image-upload"
										className="cursor-pointer flex flex-col items-center justify-center h-48"
									>
										<Upload size={24} className="text-gray-400 mb-2" />
										<span className="text-gray-500">
											Drag and drop an image, or click to select
										</span>
										<span className="text-gray-400 text-sm mt-1">
											Supports: JPG, PNG, GIF
										</span>
									</label>
								)}
							</div>
						</div>

						{/* Product Name - Now full width */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Product Name
							</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
								required
							/>
						</div>

						{/* Description */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Description
							</label>
							<textarea
								name="description"
								value={formData.description}
								onChange={handleChange}
								rows="4"
								className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{/* Category */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Category
								</label>
								<select
									name="category"
									value={formData.category}
									onChange={handleChange}
									className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
									required
								>
									<option value="" disabled>
										Select Category
									</option>
									{categories.map((category) => (
										<option key={category.value} value={category.value}>
											{category.label}
										</option>
									))}
								</select>
							</div>

							{/* Price */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Price
								</label>
								<input
									type="number"
									name="price"
									value={formData.price}
									onChange={handleChange}
									step="0.01"
									min="0"
									className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
									required
								/>
							</div>

							{/* Stock */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Stock
								</label>
								<input
									type="number"
									name="stock"
									value={formData.stock}
									onChange={handleChange}
									min="0"
									className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
									required
								/>
							</div>
						</div>

						{/* Buttons */}
						<div className="flex justify-end space-x-4 pt-4">
							<button
								type="button"
								onClick={() => navigate("/admin/products")}
								className="px-6 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
							>
								Cancel
							</button>
							<motion.button
								type="submit"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
							>
								Add Product
							</motion.button>
						</div>
					</form>
				</div>
			</motion.div>
		</div>
	);
};

export default AddProduct;
