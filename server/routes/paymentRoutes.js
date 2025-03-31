import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
	createCheckoutSession,
	checkoutSuccess,
} from "../controllers/paymentController.js";
const router = express.Router();

router.post("/create-checkout-session", authMiddleware, createCheckoutSession);
router.post("/checkout-success", authMiddleware, checkoutSuccess);

export default router;
