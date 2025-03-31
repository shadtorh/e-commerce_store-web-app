import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";
const Signup = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordError, setPasswordError] = useState("");
	const { signup, isLoading } = useUserStore();
	const navigate = useNavigate();
	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				when: "beforeChildren",
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, x: -20 },
		visible: {
			opacity: 1,
			x: 0,
		},
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });

		// Clear password error when either password field changes
		if (name === "password" || name === "confirmPassword") {
			setPasswordError("");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		signup(formData, navigate);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
			<motion.div
				className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8"
				initial="hidden"
				animate="visible"
				variants={containerVariants}
			>
				<motion.div className="mb-8" variants={itemVariants}>
					<h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
						Welcome
					</h1>
					<p className="text-center text-gray-600 mt-2">
						Create your account to get started
					</p>
				</motion.div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-4">
						<motion.div variants={itemVariants}>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Full Name
							</label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
								<input
									id="name"
									name="name"
									type="text"
									required
									value={formData.name}
									onChange={handleChange}
									className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
									placeholder="Enter your name"
								/>
							</div>
						</motion.div>

						<motion.div variants={itemVariants}>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Email Address
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
								<input
									id="email"
									name="email"
									type="email"
									required
									value={formData.email}
									onChange={handleChange}
									className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
									placeholder="Enter your email"
								/>
							</div>
						</motion.div>

						<motion.div variants={itemVariants}>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									required
									value={formData.password}
									onChange={handleChange}
									className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
									placeholder="Create a password"
								/>
								<motion.button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
									whileTap={{ scale: 0.9 }}
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</motion.button>
							</div>
						</motion.div>

						<motion.div variants={itemVariants}>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Confirm Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
								<input
									id="confirmPassword"
									name="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									required
									value={formData.confirmPassword}
									onChange={handleChange}
									className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
									placeholder="Confirm your password"
								/>
								<motion.button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
									whileTap={{ scale: 0.9 }}
								>
									{showConfirmPassword ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</motion.button>
							</div>
							{passwordError && (
								<motion.p
									className="text-red-500 text-sm mt-1"
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
								>
									{passwordError}
								</motion.p>
							)}
						</motion.div>
					</div>

					<motion.button
						type="submit"
						disabled={isLoading}
						className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 focus:ring-2 focus:ring-blue-200 flex items-center justify-center ${
							isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
						}`}
						variants={itemVariants}
						whileHover={!isLoading ? { scale: 1.02 } : {}}
						whileTap={!isLoading ? { scale: 0.98 } : {}}
					>
						{isLoading ? (
							<>
								<Loader2 className="animate-spin mr-2 h-5 w-5" />
								Creating Account...
							</>
						) : (
							"Create Account"
						)}
					</motion.button>
				</form>

				<motion.p
					className="text-center text-sm text-gray-600 mt-6"
					variants={itemVariants}
				>
					Already have an account?{" "}
					<motion.a
						href="/login"
						className="text-blue-600 hover:text-blue-700 font-medium"
						whileHover={{ scale: 1.05 }}
					>
						Sign in
					</motion.a>
				</motion.p>
			</motion.div>
		</div>
	);
};

export default Signup;
