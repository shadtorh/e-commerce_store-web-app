import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		stripeSessionId: { type: String, required: true }, // Ensure this matches
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				price: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],
		totalAmount: {
			type: Number,
			required: true,
			min: 0,
		},
		// paymentStatus: {
		// 	type: String,
		// 	enum: ["pending", "paid"],
		// 	default: "pending",
		// },
	},
	{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
