import React, { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import Loading from "./Loading";
import ErrorPage from "./ErrorPage";
import ProductCard from "./ProductCard";

const RecommendedProducts = () => {
	const { products, isLoading, error, getRecommendedProducts } =
		useProductStore();

	useEffect(() => {
		getRecommendedProducts();
	}, [getRecommendedProducts]);

	if (isLoading) {
		return <Loading />;
	}

	if (error) {
		return <ErrorPage />;
	}

	return (
		<div className="bg-white rounded-lg shadow-sm p-6 mt-8">
			<h2 className="text-xl font-semibold text-gray-900 mb-6">
				Recommended For You
			</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{products.slice(0, 4).map((product) => (
					<ProductCard key={product._id} product={product} />
				))}
			</div>
		</div>
	);
};

export default RecommendedProducts;
