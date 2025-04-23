import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
	Home,
	Signup,
	Login,
	AdminPanel,
	ProductList,
	AddProduct,
	EditProduct,
	Profile,
	CategoryProducts,
	Cart,
	NotFound,
	Checkout,
	PurchaseSuccess,
	CancelPurchase,
	Analytics,
	SearchResults,
} from "./pages";
import Layout from "./pages/Layout";
import { ToastContainer } from "react-toastify";
import AdminRoute from "./components/AdminRoute";
// import UserRoute from "./components/UserRoute";
import PublicRoute from "./components/PublicRoute";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import ErrorPage from "./components/ErrorPage";
import UserRoute from "./components/UserRoute";
const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				path: "/signup",
				element: (
					<PublicRoute>
						<Signup />
					</PublicRoute>
				),
			},
			{
				path: "/login",
				element: (
					<PublicRoute>
						<Login />
					</PublicRoute>
				),
			},

			{
				path: "/admin-dashboard",
				element: (
					<AdminRoute>
						<AdminPanel />
					</AdminRoute>
				),
			},
			{
				path: "/admin/products",
				element: (
					<AdminRoute>
						<ProductList />
					</AdminRoute>
				),
			},
			{
				path: "/admin/add-product",
				element: (
					<AdminRoute>
						<AddProduct />
					</AdminRoute>
				),
			},
			{
				path: "/admin/edit-product/:id",
				element: (
					<AdminRoute>
						<EditProduct />
					</AdminRoute>
				),
			},
			{
				path: "/admin/analytics",
				element: (
					<AdminRoute>
						<Analytics />
					</AdminRoute>
				),
			},
			{
				path: "/update-profile",
				element: <Profile />,
			},
			{
				path: "/category/:category",
				element: <CategoryProducts />,
			},
			{
				path: "/cart",
				element: <Cart />,
			},
			{
				path: "/checkout",
				element: <Checkout />,
			},

			{
				path: "/search",
				element: <SearchResults />,
			},

			{
				path: "*",
				element: <NotFound />,
			},
		],
	},
	{
		path: "/purchase-success",
		element: <PurchaseSuccess />,
	},

	{
		path: "/purchase-cancel",
		element: <CancelPurchase />,
	},
]);

const App = () => {
	const { checkAuth } = useUserStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	return (
		<>
			<ToastContainer
				position="top-right"
				autoClose={1000}
				hideProgressBar={false}
			/>
			<RouterProvider router={router} />
		</>
	);
};

export default App;
