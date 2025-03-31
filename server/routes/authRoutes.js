import express from "express";
import {
	signup,
	login,
	logout,
	profile,
	getAllUsers,
	updateProfile,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // Import middleware

const router = express.Router();

router.post("/signup", signup); // Handle signup
router.post("/login", login); // Handle login
router.post("/logout", logout); // Handle logout
router.get("/profile", authMiddleware, profile); // Protect profile route with authMiddleware
router.get("/users", authMiddleware, getAllUsers); // Protect profile route with authMiddleware
router.put("/update-profile", authMiddleware, updateProfile); // Protect profile route with authMiddleware

export default router;
