import axios from "axios";
const API =
	import.meta.env.VITE_API_URL ||
	"https://e-commerce-store-web-app-sand.vercel.app";

const instance = axios.create({
	// baseURL: "http://localhost:3000/api", // Make sure this is correct
	baseURL: `${API}/api`, // Use the environment variable for the base URL
	withCredentials: true, // Ensure CORS supports credentials if needed
});

// In frontend - Add token to all requests
instance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token"); // Get the token from local storage
		if (token) {
			config.headers.Authorization = `Bearer ${token}`; // Set the token in the Authorization header
		}
		return config;
	},
	(error) => {
		return Promise.reject(error); // Handle request error
	}
);

export default instance;
