import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
	// Check for token in Authorization header
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return res
			.status(401)
			.json({ success: false, message: "Authentication required" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id).select("-password"); // Find user by ID (from token)

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		req.user = user; // Attach user to req object
		next();
	} catch (error) {
		res
			.status(401)
			.json({ success: false, message: "Invalid or expired token" });
	}
};

export const authAdminMiddleware = async (req, res, next) => {
	const token = req.cookies?.jwt;

	if (!token) {
		return res
			.status(401)
			.json({ success: false, message: "Authentication required" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id);

		// Find user by ID (from token)

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		if (user.role !== "admin") {
			return res
				.status(403)
				.json({ success: false, message: "Admin access required" });
		}

		req.user = user;
		next();
	} catch (error) {
		res
			.status(500)
			.json({ success: false, message: "Invalid or expired token" });
	}
};
