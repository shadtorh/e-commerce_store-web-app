import express from "express";
import {
	authMiddleware,
	authAdminMiddleware,
} from "../middleware/authMiddleware.js";
import {
	getAllProducts,
	getFeaturedProducts,
	createProduct,
	deleteProduct,
	getRecommendedProducts,
	getProductsByCategory,
	toggleFeatured,
	updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", authMiddleware, authAdminMiddleware, getAllProducts);

router.get("/featured", getFeaturedProducts);
router.get("/recommended", getRecommendedProducts);
router.get("/category/:category", getProductsByCategory);
router.put("/:id", authMiddleware, authAdminMiddleware, updateProduct);

router.post("/", authMiddleware, authAdminMiddleware, createProduct);
router.delete("/:id", authMiddleware, authAdminMiddleware, deleteProduct);

router.patch("/:id", authMiddleware, authAdminMiddleware, toggleFeatured);

export default router;
