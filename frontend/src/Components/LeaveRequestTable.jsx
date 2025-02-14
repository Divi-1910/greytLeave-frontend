import React from "react";
import { motion } from "framer-motion";
import { FiClock, FiCheckCircle, FiXCircle, FiCalendar, FiFileText } from "react-icons/fi";

const LeaveRequestTable = ({ leaveRequests }) => {
// console.log("inside the leave request table - " , leaveRequests);
  const getStatusStyles = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'approved':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          icon: <FiCheckCircle className="w-4 h-4 text-green-500" />,
          border: 'border-green-200'
        };
      case 'rejected':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          icon: <FiXCircle className="w-4 h-4 text-red-500" />,
          border: 'border-red-200'
        };
      default:
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-700',
          icon: <FiClock className="w-4 h-4 text-yellow-500" />,
          border: 'border-yellow-200'
        };
    }
  };

  const formatDuration = (startDate, endDate) => {
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  };

  return (
    <div className="overflow-x-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="inline-block min-w-full align-middle"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Range
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leave Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaveRequests.map((request) => {
              const statusStyle = getStatusStyles(request.status);
              
              return (
                <motion.tr
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 transition-all"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiCalendar className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(request.startDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          to {new Date(request.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDuration(request.startDate, request.endDate)}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {request.leavePolicy.leaveType.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                      {statusStyle.icon}
                      <span className="ml-2">{request.status}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center max-w-xs">
                      <FiFileText className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                      <p className="text-sm text-gray-500 truncate">
                        {request.reason || "No reason provided"}
                      </p>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {leaveRequests.length === 0 && (
          <div className="text-center py-12">
            <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No leave requests</h3>
            <p className="mt-1 text-sm text-gray-500">No leave requests found for the selected filter.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LeaveRequestTable;