import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		location: {
			type: String,
			default: "",
		},
		profilePic: {
			type: String,
			default: "",
		},
		cart: [
			{
				quantity: {
					type: Number,
					default: 1,
					required: true,
				},
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
			},
		],
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
	},
	{ timestamps: true }
);

// userSchema.pre("save", async function (next) {
// 	if (!this.isModified("password")) return next();
// 	this.password = await bcrypt.hash(this.password, 12);
// 	next();
// });

// userSchema.methods.comparePassword = async function (candidatePassword) {
// 	return await bcrypt.compare(candidatePassword, this.password);
// };

const User = mongoose.model("User", userSchema);
export default User;
