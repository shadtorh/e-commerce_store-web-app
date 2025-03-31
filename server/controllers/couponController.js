import Coupon from "../models/Coupon.js";

export const getCoupons = async (req, res) => {
	try {
		const coupons = await Coupon.find({
			userId: req.user._id,
			isActive: true,
			expiryDate: { $gte: new Date() },
		});
		// if (coupon.length === 0) {
		// 	return res.status(404).json({
		// 		success: false,
		// 		message: "No active coupons found",
		// 	});
		// }
		res.status(200).json({ success: true, coupons });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const validateCoupon = async (req, res) => {
	try {
		const { couponCode } = req.body;
		const coupon = await Coupon.findOne({
			code: couponCode,
			userId: req.user._id,
			isActive: true,
			expiryDate: { $gte: new Date() },
		});
		if (!coupon) {
			return res.status(404).json({
				success: false,
				message: "Invalid coupon code",
			});
		}
		if (coupon.expiryDate < new Date()) {
			coupon.isActive = false;
			await coupon.save();
			return res.status(404).json({
				success: false,
				message: "Coupon expired",
			});
		}
		if (coupon.isActive === false) {
			coupon.isActive = true;
			await coupon.save();
			return res.status(404).json({
				success: false,
				message: "Coupon is not active",
			});
		}
		res.status(200).json({
			success: true,
			coupon: {
				code: coupon.code,
				discount: coupon.discount,
			},
			message: "Coupon validated",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
