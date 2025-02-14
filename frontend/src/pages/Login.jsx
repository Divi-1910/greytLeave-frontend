import React, { useState, useEffect , useLocation} from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaGoogle, FaEye, FaEyeSlash, FaUserTie, FaLock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HandleLogin } from "../api/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const {login} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    employeeCode: "",
    password: "",
  });

  useEffect(() => {
    const savedCredentials = localStorage.getItem("savedCredentials");
    if (savedCredentials) {
      setFormData(JSON.parse(savedCredentials));
      setRememberMe(true);
    }
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { employeeCode, password } = formData;
    if (!employeeCode) {
      toast.error("Employee Code is required");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      console.log("calling handle login ");
      const data = await HandleLogin(formData);
      const token = data.token;
      const id = data.id;
      console.log("after calling handle login we get - " ,{id , token} );
      if (data?.success) {
        await login({id , token});
        if (rememberMe) {
          localStorage.setItem("savedCredentials", JSON.stringify(formData));
        } else {
          localStorage.removeItem("savedCredentials");
        }
        toast.success(data?.message || "Login Successful");
        setTimeout(() => {
          navigate("/profile");
        }, 2500);
      } else {
        toast.error(data?.message || "Login Failed");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      toast.error(error.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-50 to-purple-50 p-4"
      >
	  <ToastContainer/>
        <div className="fixed inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-20" />
          <div className="absolute inset-0 bg-grid-pattern" />
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative"
        >
          <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-2xl transform -rotate-1" />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-2xl transform rotate-1" />

          <motion.div
            className="relative bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-4 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLock className="w-6 h-6 text-white" />
              </motion.div>
            </div>

            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-center mb-8 mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
            >
              Welcome Back
            </motion.h1>

            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-hover:text-blue-600">
                    Employee Code
                  </label>
                  <input
                    type="text"
                    name="employeeCode"
                    value={formData.employeeCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your Employee Code"
                  />
                </div>
                <div className="group relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-hover:text-blue-600">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </motion.div>

<motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="flex items-center space-x-2 group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors hover:underline"
                >
                  Forgot Password?
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                  <div className="relative flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                        <span>Logging in...</span>
                      </>
                    ) : (
                      <span>Login</span>
                    )}
                  </div>
                </button>
              </motion.div>
              <motion.div
                className="relative flex items-center justify-center my-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="border-t flex-grow border-gray-200"></div>
                <span className="px-4 text-sm text-gray-500 bg-white/80">Or continue with</span>
                <div className="border-t flex-grow border-gray-200"></div>
              </motion.div>
              <motion.button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white py-3 rounded-lg font-semibold text-gray-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 border border-gray-200 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <FaGoogle className="text-red-500 w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Continue with Google</span>
              </motion.button>
              <motion.div
                className="mt-8 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Link
                  to="/admin-login"
                  className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors group"
                >
                  <FaUserTie className="group-hover:scale-110 transition-transform" />
                  <span>Admin Login</span>
                </Link>
                <p className="text-center text-sm text-gray-600">
                  New here?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                  >
                    Register
                  </Link>
                </p>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Login;