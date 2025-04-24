import axios from "axios";
const API =
	import.meta.env.VITE_API_URL ||
	"https://e-commerce-store-web-app-0xlf.onrender.com";

const instance = axios.create({
	// baseURL: "http://localhost:3000/api", // Make sure this is correct
	baseURL: `${API}/api`, // Use the environment variable for the base URL
	withCredentials: true, // Ensure CORS supports credentials if needed
});

export default instance;
