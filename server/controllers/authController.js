import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();

// Signup Controller
export const signup = async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return res
			.status(400)
			.json({ success: false, message: "All fields are required" });
	} //check if all fields are provided

	try {
		const userExists = await User.findOne({ email }); //check if user already exists
		if (userExists) {
			return res
				.status(400)
				.json({ success: false, message: "User already exists" });
		} //check if user already exists

		const passwordRegex =
			/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;:'"\\,.<>/?~`]).{8,}$/;
		if (!passwordRegex.test(password)) {
			return res.status(400).json({
				success: false,
				message:
					"Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
			});
		} //check if password is valid

		const hashedPassword = await bcrypt.hash(password, 10); // Adjusted to 10 rounds

		const user = await User.create({ name, email, password: hashedPassword }); //create user with hashed password

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "30d",
		}); //create token for user with 30 days expiration

		res.cookie("jwt", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
			sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Allow cross-origin cookies in production
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
		}); //create cookie for user with 30 days expiration and httpOnly true

		res.status(201).json({
			success: true,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
			token,
			message: "User created successfully",
		}); //send response to user with user details, token and message
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

// Login Controller
export const login = async (req, res) => {
	const { email, password, ...extraFields } = req.body; //get email and password from request body

	// Ensure only email and password are provided
	if (Object.keys(extraFields).length > 0) {
		return res.status(400).json({
			success: false,
			message: "Only email and password are allowed",
		}); //send response to user with message
	}

	if (!email || !password) {
		return res
			.status(400)
			.json({ success: false, message: "All fields are required" });
	} //check if all fields are provided

	try {
		const user = await User.findOne({ email }); //check if user exists
		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid email or password" });
		} //check if user exists

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res
				.status(400)
				.json({ success: false, message: "Password is incorrect" });
		} //check if password is correct

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "30d",
		}); //create token for user with 30 days expiration

		res.cookie("jwt", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
			sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Allow cross-origin cookies in production
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
		}); //create cookie for user with 30 days expiration and httpOnly true

		res.status(200).json({
			success: true,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
			token,
			message: "Login successful",
		}); //send response to user with user details, token and message
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

// Logout Controller
export const logout = async (req, res) => {
	try {
		res.cookie("jwt", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
			sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Allow cross-origin cookies in production
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days,
		}); //create cookie for user with 30 days expiration and httpOnly true

		res.status(200).json({ success: true, message: "Logged out successfully" }); //send response to user with message
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal server error" }); //send response to user with message
	}
};

// Profile Controller
export const profile = async (req, res) => {
	const { user } = req; // The user attached by authMiddleware

	res.status(200).json({
		success: true,
		user: {
			id: user._id,
			name: user.name,
			role: user.role,
			email: user.email,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			token: req.cookies.jwt,
		},
	}); //send response to user with user details, token and message
};

// Get All Users Controller
export const getAllUsers = async (req, res) => {
	try {
		// Only allow admin to access this route
		if (req.user.role !== "admin") {
			return res.status(403).json({ message: "Not authorized" });
		}

		const users = await User.find({})
			.select("-password") // Exclude password from the response
			.sort({ createdAt: -1 }); // Optional: sort by newest first

		res.status(200).json(users);
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ message: "Error fetching users" });
	}
};

// Update Profile Controller
export const updateProfile = async (req, res) => {
	const { user } = req; // The user attached by authMiddleware
	const { ...rest } = req.body; // Get location from request body
	const updateData = { ...rest }; // Initialize updateData with the rest of the fields
	try {
		const updatedUser = await User.findByIdAndUpdate(
			user._id,
			{ $set: updateData },
			{ new: true }
		).select("-password");

		res.status(200).json({
			success: true,
			user: updatedUser,
			message: "Profile updated successfully",
		});
	} catch (error) {
		console.error("Error updating profile:", error);
		res.status(500).json({ message: "Error updating profile" });
	}
};
