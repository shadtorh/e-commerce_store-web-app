import express from "express";
import {
	authMiddleware,
	authAdminMiddleware,
} from "../middleware/authMiddleware.js";
import { getAdminAnalytics } from "../controllers/analyticsController.js";
const router = express.Router();

router.get("/", authMiddleware, authAdminMiddleware, getAdminAnalytics);

export default router;
