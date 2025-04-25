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
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
connectDB();

const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];

app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	})
);

app.use((req, res, next) => {
	console.log("Origin:", req.headers.origin);
	next();
});

app.use("/api/auth", authRoutes); //auth routes
// Example Node.js/Express route for demo login

app.use("/api/products", productRoutes); //product routes
app.use("/api/cart", cartRoutes); //cart routes
app.use("/api/coupons", couponRoutes); //coupon routes
app.use("/api/payment", paymentRoutes); //payment routes
app.use("/api/analytics", analyticsRoutes); //analytics routes

if (process.env.NODE_ENV === "production") {
	const __dirname = path.resolve();
	app.use(express.static(path.join(__dirname, "/client/build")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
