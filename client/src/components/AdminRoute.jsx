import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const AdminRoute = ({ children }) => {
	const { user } = useUserStore();

	return user && user?.role === "admin" ? (
		children
	) : (
		<Navigate to="/" replace />
	);
};

export default AdminRoute;
