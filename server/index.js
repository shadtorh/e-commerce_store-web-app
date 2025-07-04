import express from "express";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import cors from "cors";
import path from "path";
dotenv.config();

const app = express();
app.set("trust proxy", 1); // trust first proxy
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
connectDB();

const allowedOrigins = [
	"http://localhost:5173",
	process.env.FRONTEND_URL,
	"https://e-commerce-store-web-app-brown.vercel.app",
];

console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"Access-Control-Allow-Origin",
		],
	})
);

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});

// app.use((req, res, next) => {
// 	console.log("Origin:", req.headers.origin);
// 	next();
// });

app.use("/api/auth", authRoutes); //auth routes
// Example Node.js/Express route for demo login

app.use("/api/products", productRoutes); //product routes
app.use("/api/cart", cartRoutes); //cart routes
app.use("/api/coupons", couponRoutes); //coupon routes
app.use("/api/payment", paymentRoutes); //payment routes
app.use("/api/analytics", analyticsRoutes); //analytics routes

app.get("/", (req, res) => {
	res.send("Hello from the server");
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
