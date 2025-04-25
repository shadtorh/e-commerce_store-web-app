import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Star, Edit, Trash2, Loader2, Filter } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { useProductStore } from "../stores/useProductStore";
import { Loading } from "../components";

const ProductList = () => {
	const {
		getAllProducts,
		products,
		isLoading,
		error,
		deleteProduct,
		toggleFeaturedProduct,
		updateProduct,
	} = useProductStore();
	const [filterText, setFilterText] = useState("");

	useEffect(() => {
		getAllProducts();
	}, [getAllProducts]);

	const navigate = useNavigate();

	const toggleFeatured = (productId) => {
		toggleFeaturedProduct(productId);
	};

	const handleEdit = (productId) => {
		updateProduct(productId);
		navigate(`/admin/edit-product/${productId}`);
	};

	const handleDelete = (productId) => {
		deleteProduct(productId);
	};

	if (isLoading) return <Loading />;
	if (error) return <div className="text-red-500 p-4">{error}</div>;

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
			<Sidebar />

			<motion.div
				className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
						Products
					</h1>
					<Link
						to="/admin/add-product"
						className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
					>
						<Plus size={20} />
						<span>Add Product</span>
					</Link>
				</div>

				{/* Desktop Table View */}
				<div className="hidden md:block">
					<motion.div
						className="bg-white rounded-lg shadow-sm overflow-hidden"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-50 border-b border-gray-200">
									<tr>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Image
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Product Name
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Category
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Price
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Stock
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Featured
										</th>
										<th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{products?.map((product) => (
										<motion.tr
											key={product._id}
											className="hover:bg-gray-50"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.3 }}
										>
											<td className="px-4 py-3 whitespace-nowrap">
												<img
													src={
														product.image || "https://via.placeholder.com/50"
													}
													alt={product.name}
													className="w-10 h-10 rounded object-cover"
												/>
											</td>
											<td className="px-4 py-3 text-sm font-medium text-gray-900">
												{product.name}
											</td>
											<td className="px-4 py-3 text-sm text-gray-500">
												{product.category}
											</td>
											<td className="px-4 py-3 text-sm text-gray-900">
												${product.price}
											</td>
											<td className="px-4 py-3 text-sm text-gray-900">
												{product.stock}
											</td>
											<td className="px-4 py-3">
												<motion.button
													whileHover={{ scale: 1.2 }}
													onClick={() => toggleFeatured(product._id)}
													className={`${
														product?.isFeatured
															? "text-yellow-400"
															: "text-gray-300"
													} transition-colors hover:text-yellow-400`}
												>
													<Star
														size={20}
														fill={product?.isFeatured ? "currentColor" : "none"}
													/>
												</motion.button>
											</td>
											<td className="px-4 py-3 text-center">
												<div className="flex justify-center space-x-2">
													<motion.button
														whileHover={{ scale: 1.2 }}
														onClick={() => handleEdit(product._id)}
														className="text-blue-600 hover:text-blue-800 transition-colors p-1"
													>
														<Edit size={18} />
													</motion.button>
													<motion.button
														whileHover={{ scale: 1.2 }}
														onClick={() => handleDelete(product._id)}
														className="text-red-600 hover:text-red-800 transition-colors p-1"
													>
														<Trash2 size={18} />
													</motion.button>
												</div>
											</td>
										</motion.tr>
									))}
								</tbody>
							</table>
						</div>
					</motion.div>
				</div>

				{/* Mobile Card View */}
				<div className="md:hidden space-y-4">
					{products?.map((product) => (
						<motion.div
							key={product._id}
							className="bg-white rounded-lg shadow-sm p-4"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.3 }}
						>
							<div className="flex items-center space-x-4 mb-3">
								<img
									src={product.image || "https://via.placeholder.com/50"}
									alt={product.name}
									className="w-16 h-16 rounded-lg object-cover"
								/>
								<div>
									<h3 className="font-medium text-gray-900">{product.name}</h3>
									<p className="text-sm text-gray-500">{product.category}</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-2 mb-3 text-sm">
								<div>
									<span className="text-gray-500">Price:</span>{" "}
									<span className="font-medium">${product.price}</span>
								</div>
								<div>
									<span className="text-gray-500">Stock:</span>{" "}
									<span className="font-medium">{product.stock}</span>
								</div>
							</div>

							<div className="flex justify-between items-center border-t pt-3">
								<motion.button
									whileHover={{ scale: 1.1 }}
									onClick={() => toggleFeatured(product._id)}
									className={`${
										product?.isFeatured ? "text-yellow-400" : "text-gray-300"
									} transition-colors hover:text-yellow-400 p-2`}
								>
									<Star
										size={20}
										fill={product?.isFeatured ? "currentColor" : "none"}
									/>
								</motion.button>

								<div className="flex space-x-2">
									<motion.button
										whileHover={{ scale: 1.1 }}
										onClick={() => handleEdit(product._id)}
										className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors"
									>
										<Edit size={18} />
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.1 }}
										onClick={() => handleDelete(product._id)}
										className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
									>
										<Trash2 size={18} />
									</motion.button>
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{products?.length === 0 && (
					<div className="text-center py-12 bg-white rounded-lg shadow-sm">
						<p className="text-gray-500">No products found</p>
					</div>
				)}
			</motion.div>
		</div>
	);
};

export default ProductList;
