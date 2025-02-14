import React from "react";
import { format } from "date-fns";
import {
  FiX,
  FiFile,
  FiUser,
  FiCalendar,
  FiClock,
  FiCheckCircle
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

const LeaveDetailsModal = ({ isOpen, onClose, leaveRequest }) => {
  if (!isOpen || !leaveRequest) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={onClose}
              ></div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div
                  className="absolute inset-0 bg-gray-500 opacity-75"
                  onClick={onClose}
                ></div>
              </div>

              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    onClick={onClose}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Leave Request Details
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center mb-2">
                          <FiUser className="mr-2 text-blue-500" />
                          <h4 className="font-medium">Employee Information</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="font-medium">
                              {leaveRequest.employee.fullName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Employee Code
                            </p>
                            <p className="font-medium">
                              {leaveRequest.employee.employeeCode}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium">
                              {leaveRequest.employee.emailAddress}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Leave Details */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center mb-2">
                          <FiCalendar className="mr-2 text-blue-500" />
                          <h4 className="font-medium">Leave Details</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Start Date</p>
                            <p className="font-medium">
                              {format(
                                new Date(leaveRequest.startDate),
                                "dd MMM yyyy"
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">End Date</p>
                            <p className="font-medium">
                              {format(
                                new Date(leaveRequest.endDate),
                                "dd MMM yyyy"
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Number of Days
                            </p>
                            <p className="font-medium">
                              {leaveRequest.requestedNumberOfDays}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Leave Period
                            </p>
                            <p className="font-medium">
                              {leaveRequest.leavePeriod}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Status and Approval */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center mb-2">
                          <FiCheckCircle className="mr-2 text-blue-500" />
                          <h4 className="font-medium">Status & Approval</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          leaveRequest.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : leaveRequest.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                            >
                              {leaveRequest.status}
                            </span>
                          </div>
                          {leaveRequest.approvedBy && (
                            <>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Approved By
                                </p>
                                <p className="font-medium">
                                  {leaveRequest.approvedBy.fullName}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Approval Date
                                </p>
                                <p className="font-medium">
                                  {format(
                                    new Date(leaveRequest.approvalDate),
                                    "dd MMM yyyy"
                                  )}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Reason and Supporting Document */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <FiFile className="mr-2 text-blue-500" />
                          <h4 className="font-medium">
                            Additional Information
                          </h4>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Reason</p>
                          <p className="font-medium">
                            {leaveRequest.reason || "No reason provided"}
                          </p>
                        </div>
                        {leaveRequest.supportingDoc && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              Supporting Document
                            </p>
                            <a
                              href={leaveRequest.supportingDoc}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 flex items-center mt-1"
                            >
                              <FiFile className="mr-1" />
                              View Document
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeaveDetailsModal;
