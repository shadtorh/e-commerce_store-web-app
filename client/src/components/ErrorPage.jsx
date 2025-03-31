import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";

const ErrorPage = () => {
	return (
		<div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4">
			<div className="text-center">
				<AlertCircle size={64} className="text-red-500 mx-auto mb-6" />

				<h1 className="text-3xl font-bold text-gray-900 mb-3">
					Oops! Something went wrong
				</h1>

				<p className="text-gray-600 mb-8 max-w-md mx-auto">
					We're having trouble processing your request. Please try again later.
				</p>

				<div className="flex gap-4 justify-center">
					<button
						onClick={() => window.location.reload()}
						className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
					>
						Try Again
					</button>

					<Link
						to="/"
						className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-6 py-3"
					>
						<ArrowLeft size={20} />
						Back to Home
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ErrorPage;
