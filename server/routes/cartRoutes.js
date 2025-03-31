import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
	addToCart,
	removeFromCart,
	updateQuantity,
	getCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.delete("/", authMiddleware, removeFromCart);
router.put("/:id", authMiddleware, updateQuantity);

export default router;
