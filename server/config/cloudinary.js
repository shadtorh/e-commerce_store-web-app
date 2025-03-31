import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});

// Upload image to Cloudinary
export const uploadImage = async (imagePath) => {
	try {
		const result = await cloudinary.uploader.upload(imagePath, {
			folder: "products",
		});
		return { secureUrl: result.secure_url, publicId: result.public_id };
	} catch (error) {
		console.error("Cloudinary Upload Error:", error);
		throw error;
	}
};

// Upload profile image to Cloudinary
export const uploadProfileImage = async (imagePath) => {
	try {
		const result = await cloudinary.uploader.upload(imagePath, {
			folder: "profile",
		});
		return { secureUrl: result.secure_url, publicId: result.public_id };
	} catch (error) {
		console.error("Cloudinary Upload Error:", error);
		throw error;
	}
};

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
	try {
		await cloudinary.uploader.destroy(publicId);
	} catch (error) {
		console.error("Cloudinary Delete Error:", error);
		throw error;
	}
};

// Get all images from Cloudinary (filtered by folder)
export const getAllImages = async () => {
	try {
		const result = await cloudinary.api.resources({
			type: "upload",
			prefix: "products/", // Filter images in "products" folder
		});
		return result.resources;
	} catch (error) {
		console.error("Cloudinary Fetch Error:", error);
		throw error;
	}
};

export default cloudinary;
