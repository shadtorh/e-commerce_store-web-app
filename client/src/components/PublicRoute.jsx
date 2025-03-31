import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const PublicRoute = ({ children }) => {
	const { user } = useUserStore();

	if (user) {
		return <Navigate to="/" replace />;
	}

	return children;
};

export default PublicRoute;
