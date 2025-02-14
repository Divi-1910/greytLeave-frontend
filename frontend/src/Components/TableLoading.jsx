import React from "react";
import { motion } from "framer-motion";

const TableLoading = () => {
  const skeletonRows = Array(5).fill(null);

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
        <div className="flex justify-between items-center">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-white/20 rounded-lg"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-10 w-32 bg-white/20 rounded-lg"></div>
          </div>
        </div>
      </div>

      <div className="p-6 border-b">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
          </div>
          <div className="flex justify-end">
            <div className="animate-pulse">
              <div className="h-16 w-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-50">
              {Array(8)
                .fill(null)
                .map((_, index) => (
                  <th key={index} className="px-6 py-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  </th>
                ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {skeletonRows.map((_, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.1 }}
                className={`${rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                {/* Employee ID */}
                <td className="px-6 py-4">
                  <div className="animate-pulse flex items-center">
                    <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                  </div>
                </td>

                {/* Name */}
                <td className="px-6 py-4">
                  <div className="animate-pulse flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      <div className="h-3 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-4">
                  <div className="animate-pulse">
                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
                  </div>
                </td>

                {/* Role */}
                <td className="px-6 py-4">
                  <div className="animate-pulse">
                    <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                  </div>
                </td>

                {/* Country */}
                <td className="px-6 py-4">
                  <div className="animate-pulse">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                </td>

                {/* Department */}
                <td className="px-6 py-4">
                  <div className="animate-pulse">
                    <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  </div>
                </td>

                {/* Join Date */}
                <td className="px-6 py-4">
                  <div className="animate-pulse">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
                    <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <div className="flex items-center justify-between">
          <div className="animate-pulse flex items-center space-x-4">
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
          <div className="animate-pulse flex space-x-2">
            {Array(3)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="h-8 w-8 bg-gray-200 rounded-lg"
                ></div>
              ))}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="text-sm font-medium">Loading...</span>
      </div>
    </div>
  );
};

export default TableLoading;
