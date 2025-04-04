import axios from "axios";
const API =
	import.meta.env.VITE_API_URL ||
	"https://e-commerce-store-web-app.onrender.com";

const instance = axios.create({
	// baseURL: "http://localhost:3000/api", // Make sure this is correct
	baseURL: `${API}/api`, // Use the environment variable for the base URL
	withCredentials: true, // Ensure CORS supports credentials if needed
});

instance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		// console.log("Token:", token); // Log the token for debugging

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export default instance;
