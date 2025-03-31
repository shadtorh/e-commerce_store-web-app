import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Star, Edit, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { useProductStore } from "../stores/useProductStore";

const ProductList = () => {
	const {
		products,
		isLoading,
		error,
		deleteProduct,
		toggleFeaturedProduct,
		updateProduct,
	} = useProductStore();

	const navigate = useNavigate();

	console.log("products from product list", products);

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

	if (isLoading)
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900">
					<Loader2 className="h-6 w-6" />
				</div>
			</div>
		);
	if (error) return <div className="text-red-500">{error}</div>;

	return (
		<div className="flex h-screen bg-gray-50">
			<Sidebar />

			<motion.div
				className="flex-1 p-8"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold">Products</h1>
					<Link
						to="/admin/add-product"
						className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
					>
						<Plus size={20} />
						Add Product
					</Link>
				</div>

				{/* Search Bar */}
				<div className="mb-8">
					<input
						type="text"
						placeholder="Filter products..."
						className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
					/>
				</div>

				{/* Products Table */}
				<motion.div
					className="bg-white rounded-lg shadow-sm overflow-x-auto"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
				>
					<table className="w-full">
						<thead className="bg-gray-50 border-b border-gray-200">
							<tr>
								<th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
									Image
								</th>
								<th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
									Product Name
								</th>
								<th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
									Category
								</th>
								<th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
									Price
								</th>
								<th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
									Stock
								</th>
								<th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
									Featured
								</th>
								<th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
									Edit
								</th>
								<th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
									Delete
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
									<td className="px-6 py-4">
										<img
											src={product.image || "https://via.placeholder.com/50"}
											alt={product.name}
											className="w-12 h-12 rounded-lg object-cover"
										/>
									</td>
									<td className="px-6 py-4 text-sm font-medium text-gray-900">
										{product.name}
									</td>
									<td className="px-6 py-4 text-sm text-gray-500">
										{product.category}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900">
										${product.price}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900">
										{product.stock}
									</td>
									<td className="px-6 py-4">
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
									<td className="px-6 py-4">
										<motion.button
											whileHover={{ scale: 1.2 }}
											onClick={() => handleEdit(product._id)}
											className="text-blue-600 hover:text-blue-800 transition-colors"
										>
											<Edit size={20} />
										</motion.button>
									</td>
									<td className="px-6 py-4">
										<motion.button
											whileHover={{ scale: 1.2 }}
											onClick={() => handleDelete(product._id)}
											className="text-red-600 hover:text-red-800 transition-colors"
										>
											<Trash2 size={20} />
										</motion.button>
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default ProductList;
