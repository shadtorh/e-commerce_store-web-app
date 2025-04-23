import Product from "../models/Product.js";
import { uploadImage, deleteImage } from "../config/cloudinary.js";
import cache from "memory-cache";
import schedule from "node-schedule";

// TODO: Optimize the getAllProducts function
export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find();
		res.status(200).json({
			success: true,
			products,
			message: "Products fetched successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// TODO: Optimize the getFeaturedProducts function
export const getFeaturedProducts = async (req, res) => {
	try {
		const products = await Product.find({ isFeatured: true }); // limit to 4 products for featured products
		res.status(200).json({
			success: true,
			products,
			message: "Featured products fetched successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// TODO: Optimize the createProduct function
export const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, category, stock } = req.body; //get product details from request body
		const uploadedImage = await uploadImage(image); //upload image to cloudinary
		const imageUrl = uploadedImage.secureUrl; //get image url from cloudinary
		const product = await Product.create({
			name,
			description,
			price,
			image: imageUrl,
			category,
			stock,
		}); //create product with product details
		res.status(201).json({
			success: true,
			product,
			message: "Product created successfully",
		}); //send response to user with product details and message
	} catch (error) {
		res.status(500).json({ success: false, message: error.message }); //send response to user with message
	}
};

// TODO: Optimize the deleteProduct function
export const deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;

		// Find the product first
		const product = await Product.findById(id);
		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Product not found" });
		}

		// Delete the product image from Cloudinary
		if (product.image) {
			const imageId = product.image.split("/").pop().split(".")[0];
			await deleteImage(imageId);
			console.log("Product image deleted from Cloudinary");
		}

		// Delete the product from MongoDB
		await Product.findByIdAndDelete(id);

		res.status(200).json({
			success: true,
			message: "Product deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// TODO: the getRecommendedProducts function

export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{ $sample: { size: 4 } },
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					price: 1,
					image: 1,
				},
			},
		]);
		res.status(200).json({
			success: true,
			products,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

//  TODO: Implement getProductsByCategory
export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });
		res.status(200).json({
			success: true,
			products,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const toggleFeatured = async (req, res) => {
	const { id } = req.params;
	try {
		const product = await Product.findById(id);
		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Product not found" });
		}
		product.isFeatured = !product.isFeatured;
		const updatedProduct = await product.save();

		// Optional: update the cache after changing the featured status
		await updateFeaturedProductsCache();

		res.status(200).json({
			success: true,
			updatedProduct,
			message: "Product featured status updated successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

async function updateFeaturedProductsCache() {
	try {
		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		// Assuming you have a cache implementation like Redis or in-memory caching
		cache.set("featuredProducts", featuredProducts, "EX", 3600); // Optional: Set expiration time (1 hour)
	} catch (error) {
		console.error("Error updating featured products cache:", error);
	}
}

// TODO: Implement updateProduct
export const updateProduct = async (req, res) => {
	const { id } = req.params;
	const { name, description, price, image, category, stock } = req.body;

	try {
		const product = await Product.findById(id);
		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Product not found" });
		}

		const updatedProduct = await Product.findByIdAndUpdate(
			id,
			{ name, description, price, image, category, stock },
			{ new: true } // Ensures the updated document is returned
		);

		res.status(200).json({
			success: true,
			product: updatedProduct,
			message: "Product updated successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const searchProducts = async (req, res) => {
	const { query } = req.query;
	try {
		const products = await Product.find({
			name: { $regex: query, $options: "i" },
		}); // Case-insensitive search
		res.status(200).json({
			success: true,
			products,
			message: "Products searched successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Schedule the cache update every day at midnight if not in test environment
if (process.env.NODE_ENV !== "test") {
	schedule.scheduleJob("0 0 * * *", updateFeaturedProductsCache); // Update cache every day at midnight
}
