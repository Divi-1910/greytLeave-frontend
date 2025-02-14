import {createRoot} from "react-dom/client";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App.jsx";
import {AuthProvider} from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext.jsx";
import { FormDataProvider } from "./context/FormDataContext.jsx";

createRoot(document.getElementById("root")).render(
		<AuthProvider>
			<AdminProvider>
			<App />
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
				toastStyle={{
					backgroundColor: "white",
					borderRadius: "8px",
					boxShadow:
						"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
				}}
			/>
			</AdminProvider>
		</AuthProvider>
);