import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard"; // Assuming you have a ProductCard component
import Loading from "../components/Loading";
import axios from "../utils/axios"; // Adjust the import based on your axios setup

const SearchResults = () => {
	const location = useLocation();
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// Extract the search query from the URL
	const query = new URLSearchParams(location.search).get("query");

	useEffect(() => {
		const fetchSearchResults = async () => {
			setIsLoading(true);
			try {
				// Replace with your API endpoint for searching products
				const response = await axios.get(`/products/search?query=${query}`);
				const data = response.data.products;
				console.log("Search results:", data); // Log the search results
				setProducts(data);
			} catch (error) {
				console.error("Error fetching search results:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (query) {
			fetchSearchResults();
		}
	}, [query]);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<h1 className="text-2xl font-semibold text-gray-900 mb-6">
				Search Results for "{query}"
			</h1>
			{products.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			) : (
				<p className="text-gray-600">No products found for your search.</p>
			)}
		</div>
	);
};

export default SearchResults;
