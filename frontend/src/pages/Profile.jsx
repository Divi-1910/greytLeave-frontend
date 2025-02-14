import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FiLogOut,
  FiCalendar,
} from "react-icons/fi";
import EmployeeInfo from "../Components/EmployeeInfo";

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="ml-3 text-xl font-bold text-gray-800">
                Employee Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="border-l border-gray-200 h-6" />
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                <FiLogOut className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <EmployeeInfo />
        </motion.div>
        </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} @Graas.ai  All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};

const StatsCard = ({ title, value, icon, bgColor = "bg-white" }) => (
  <div className={`rounded-lg shadow p-6 ${bgColor}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className="p-3 rounded-full bg-white shadow-sm">{icon}</div>
    </div>
  </div>
);

const StatusFilter = ({ status, active, onClick, count }) => {
  const formatStatus = (status) => {
    if (status === "ALL") return "All";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? "bg-blue-100 text-blue-700"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {formatStatus(status)}
      {count > 0 && (
        <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100">
          {count}
        </span>
      )}
    </button>
  );
};

// Component for loading state
const LoadingState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center py-12"
  >
    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600">Loading your leave requests...</p>
  </motion.div>
);

// Component for empty state
const EmptyState = ({ onCreateNew }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="text-center py-12"
  >
    <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-4 text-lg font-medium text-gray-900">
      No leave requests found
    </h3>
    <p className="mt-2 text-sm text-gray-600">
      Get started by creating a new leave request
    </p>
  </motion.div>
);

// Reusable Button component
const Button = ({
  children,
  onClick,
  variant = "primary",
  icon,
  disabled = false,
  className = "",
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
      ${
        variant === "primary"
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : variant === "secondary"
          ? "bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      ${className}
    `}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
  </button>
);

export default Profile;