import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const TableLoadingOverlay = () => {
  return (
    <div className="absolute inset-0 bg-white/75 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4"
      >
        <div className="relative">
          <div className="w-12 h-12">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800">
            Searching...
          </span>
          <span className="text-xs text-gray-500">Please wait</span>
        </div>
      </motion.div>
    </div>
  );
};

export default TableLoadingOverlay;
