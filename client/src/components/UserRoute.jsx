import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useEffect } from "react";
import Loading from "../components/Loading";

const UserRoute = ({ children }) => {
	const { user } = useUserStore();

	// Redirect to login if the user is not authenticated
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	// Render the children if the user is authenticated
	return children;
};

export default UserRoute;
