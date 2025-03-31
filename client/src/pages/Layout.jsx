import { Outlet } from "react-router-dom";
import { Navbar } from "../components";
import { useCartStore } from "../stores/useCartStore";
import { useEffect } from "react";

const Layout = () => {
	const { getCartItems } = useCartStore();

	useEffect(() => {
		getCartItems();
	}, [getCartItems]);

	return (
		<div>
			<Navbar />
			<Outlet />
		</div>
	);
};

export default Layout;
