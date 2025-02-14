import React from "react";
import {useNavigate} from "react-router-dom";

function ErrPage() {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-red-100 via-white to-red-100">
			<div className="text-center p-10 bg-white rounded-2xl shadow-lg border-t-4 border-red-500">
				<h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
				<h2 className="text-2xl font-semibold text-gray-800 mb-6">
					Page Not Found
				</h2>
				<p className="text-gray-600 mb-8">
					The page you're looking for doesn't exist or has been moved.
				</p>
				<button
					onClick={() => navigate("/login")}
					className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
					Go to Login
				</button>
			</div>
		</div>
	);
}

export default ErrPage;
