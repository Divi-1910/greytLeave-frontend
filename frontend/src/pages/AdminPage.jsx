import React, { useState, useEffect } from "react";
import { Outlet, useLocation, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UserCircle,
  GitPullRequest,
  Earth,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  {
    icon: <LayoutDashboard size={20} />,
    text: "Dashboard",
    path: "/admin-dashboard/dashboard"
  },
  {
    icon: <UserCircle size={20} />,
    text: "Employees",
    path: "/admin-dashboard/employees"
  },
  {
    icon: <GitPullRequest size={20} />,
    text: "Leave Requests",
    path: "/admin-dashboard/leave-requests"
  }
];

const AdminPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`${
          isSidebarOpen ? "w-72" : "w-20"
        } bg-white h-screen transition-all duration-300 ease-in-out border-r border-gray-200`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {isSidebarOpen && (
            <div className="flex items-center">
              <span className="ml-3 font-semibold text-gray-800">
                Admin Panel
              </span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className="p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  } transition-all duration-200`
                }
              >
                {item.icon}
                {isSidebarOpen && <span className="ml-3">{item.text}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200">
          <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div className="relative w-96">
                <h3 className="text-bold"> ADMIN DASHBOARD</h3>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
