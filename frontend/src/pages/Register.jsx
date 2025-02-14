import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { RiShieldKeyholeLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { ToastContainer, toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar';
import confetti from 'canvas-confetti';
import 'react-toastify/dist/ReactToastify.css';
import { RegisterPassword, sendOTP, verifyEmployeeCode, verifyOTP } from '../api/api';

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [formData, setFormData] = useState({
    employeeCode: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };
  useEffect(() => {
    setPasswordsMatch(formData.password === formData.confirmPassword && formData.password !== '');
  }, [formData.password, formData.confirmPassword]);

  const validatePassword = useCallback((password) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });

    let score = 0;
    if (password.length >= 8) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[a-z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 20;
    if (/[^A-Za-z0-9]/.test(password)) score += 20;
    setStrength(score);
  }, []);

  const handleEmployeeCodeSubmit = async () => {
    try {
      setLoading(true);
      setProgress(30);
    const response = await verifyEmployeeCode(formData.employeeCode);
      if (!response.valid){
        throw new Error('Employee verification failed');
      } 

      setEmployeeDetails(response.employee);
      setProgress(100);
      setCurrentStep(2);
      toast.success('Employee verified successfully!');
      
      await sendOtp(response.employee);

    } catch (error) {
      toast.error(error.message || 'Verification failed. Please try again.');
      setProgress(100);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (employee) => {
    try {
      setLoading(true);
      setProgress(30);
        const response = await sendOTP({
            id : employee.id,
            emailAddress : employee.emailAddress , 
        });
      toast.success('OTP sent successfully!');
      setProgress(100);
    } catch (error) {
      console.log("blah blah blah , " , error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      setLoading(true);
      setProgress(30);
      //console.log("-----" , employeeDetails.emailAddress);
        const response = await verifyOTP({
            emailAddress : employeeDetails.emailAddress,
            otp : formData.otp,
        })
      //  console.log(response);
      if (!response.valid) throw new Error('Invalid OTP');

      setProgress(100);
      setCurrentStep(3);
      toast.success('OTP verified successfully!');
    } catch (error) {
      toast.error(error.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    try {
      setLoading(true);
      setProgress(30);

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      console.log("employee Details -  " , employeeDetails);
      const response = await RegisterPassword({
        id : employeeDetails.id,
        password : formData.confirmPassword,
      })

      console.log(response);

      if (!response.success) throw new Error('Registration failed');

      setProgress(100);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      toast.success('Registered successfully!');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100">
      <LoadingBar color="#2563EB" progress={progress} />
      <ToastContainer />

      <div className="container mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
        >
          <div className="px-8 pt-8 pb-6">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
              Create Account
              <motion.div 
                className="h-1 w-20 bg-blue-500 mx-auto mt-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "5rem" }}
                transition={{ duration: 0.5 }}
              />
            </h1>

            <div className="flex justify-between mb-8">
              {[1, 2, 3].map((step) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: step * 0.1 }}
                  className={`flex flex-col items-center ${
                    currentStep >= step ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      currentStep >= step
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    {step === 1 && <FaUser />}
                    {step === 2 && <FaEnvelope />}
                    {step === 3 && <FaLock />}
                  </motion.div>
                  <span className="text-xs mt-2">
                    {step === 1 && "Verify EMPCode"}
                    {step === 2 && "OTP"}
                    {step === 3 && "Password"}
                  </span>
                </motion.div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    <div className="relative">
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Enter Employee Code"
                        value={formData.employeeCode}
                        onChange={(e) =>
                          setFormData({ ...formData, employeeCode: e.target.value })
                        }
                      />
                      <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleEmployeeCodeSubmit}
                      disabled={loading || !formData.employeeCode}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2" />
                          Verifying...
                        </div>
                      ) : (
                        "Verify Employee Code"
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && employeeDetails && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-50 p-4 rounded-lg"
                    >
                      <h3 className="font-semibold text-blue-800">
                        Employee Details
                      </h3>
                      <div className="mt-2 text-sm text-blue-600">
                        <p>Name: {employeeDetails.fullName}</p>
                        <p>Email: {employeeDetails.emailAddress}</p>
                        <p>Join Date: {new Date(employeeDetails.dateOfJoining).toLocaleDateString()}</p>
                      </div>
                    </motion.div>

                    <div className="relative">
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Enter OTP"
                        maxLength={6}
                        value={formData.otp}
                        onChange={(e) =>
                          setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })
                        }
                      />
                      <RiShieldKeyholeLine className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all disabled:opacity-50"
                        onClick={handleOtpSubmit}
                        disabled={loading || formData.otp.length !== 6}
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2" />
                            Verifying...
                          </div>
                        ) : (
                          "Verify OTP"
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                        onClick={() => sendOtp(employeeDetails)}
                        disabled={loading}
                      >
                        Resend
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    <div className="mb-4">
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${
                            strength <= 40 ? 'bg-red-500' :
                            strength <= 60 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${strength}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <p className="text-xs mt-1 text-gray-600">
                        Password Strength: {
                          strength <= 40 ? 'Weak' :
                          strength <= 60 ? 'Medium' :
                          'Strong'}
                      </p>
                    </div>

                    <div className="relative">
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Create Password"
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({ ...formData, password: e.target.value });
                          validatePassword(e.target.value);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                      </button>
                    </div>

                    <div className="relative">
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                      </button>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Password Requirements:
                      </h4>
                      <ul className="space-y-2 text-sm">
                        {Object.entries(passwordStrength).map(([key, valid]) => (
                          <motion.li
                            key={key}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2"
                          >
                            {valid ? (
                              <FaCheckCircle className="text-green-500" />
                            ) : (
                              <FaTimesCircle className="text-red-500" />
                            )}
                            <span className={valid ? "text-green-700" : "text-red-700"}>
                              {key === "length" && "At least 8 characters"}
                              {key === "uppercase" && "One uppercase letter"}
                              {key === "lowercase" && "One lowercase letter"}
                              {key === "number" && "One number"}
                              {key === "special" && "One special character"}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all disabled:opacity-50"
                      onClick={handleFinalSubmit}
                      disabled={
                        loading ||
                        formData.password !== formData.confirmPassword ||
                        !Object.values(passwordStrength).every(Boolean)
                      }
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2" />
                          Creating Account...
                        </div>
                      ) : (
                        "Complete Registration"
                      )}
                    </motion.button>
                    {formData.confirmPassword && (
  <p className={`text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
  </p>
)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center text-sm text-gray-600"
            >
              Already have an account?{" "}
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:underline font-medium"
              >
                Login here
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;