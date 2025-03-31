import express from "express";
import { getCoupons, validateCoupon } from "../controllers/couponController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware, getCoupons);
router.post("/validate", authMiddleware, validateCoupon);

export default router;
