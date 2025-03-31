import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import Loading from "../components/Loading";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const { login, isLoading } = useUserStore();
	const navigate = useNavigate();
	// Animation variants for the container
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

	// Animation variants for the form items
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
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await login(formData, navigate);
			setFormData({ email: "", password: "" }); // Moved inside try block to ensure login success
		} catch (error) {
			console.log(error);
		}
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
						Welcome Back
					</h1>
					<p className="text-center text-gray-600 mt-2">
						Sign in to your account
					</p>
				</motion.div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-4">
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
									placeholder="Enter your password"
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

						<motion.div
							variants={itemVariants}
							className="flex items-center justify-between"
						>
							<div className="flex items-center">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									checked={rememberMe}
									onChange={(e) => setRememberMe(e.target.checked)}
									className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
								/>
								<label
									htmlFor="remember-me"
									className="ml-2 block text-sm text-gray-700 cursor-pointer"
								>
									Remember me
								</label>
							</div>
							<motion.div className="text-sm" whileHover={{ scale: 1.05 }}>
								<Link
									to="/forgot-password"
									className="text-indigo-600 hover:text-indigo-500 font-medium"
								>
									Forgot password?
								</Link>
							</motion.div>
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
								Signing In...
							</>
						) : (
							"Sign In"
						)}
					</motion.button>
				</form>

				<motion.p
					className="text-center text-sm text-gray-600 mt-6"
					variants={itemVariants}
				>
					Don't have an account?{" "}
					<motion.span whileHover={{ scale: 1.05 }} className="inline-block">
						<Link
							to="/signup"
							className="text-blue-600 hover:text-blue-700 font-medium"
						>
							Sign up
						</Link>
					</motion.span>
				</motion.p>
			</motion.div>
		</div>
	);
};

export default Login;
