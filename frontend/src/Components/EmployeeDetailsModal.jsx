import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Calendar,
  Building,
  MapPin,
  Users,
  Briefcase,
  Award,
  Clock,
  UserCheck,
  Shield
} from "lucide-react";

const EmployeeDetailsModal = ({ isOpen, onClose, employee }) => {
  if (!employee) return null;

  const InfoRow = ({ icon: Icon, label, value, badge }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
          <Icon size={20} className="text-blue-600" />
        </div>
      </div>
      <div className="flex-grow">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base font-semibold text-gray-900">
          {value || "N/A"}
        </p>
      </div>
      {badge && (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {badge}
        </span>
      )}
    </motion.div>
  );

  const StatusBadge = ({ status }) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium
      ${
        status === "Active"
          ? "bg-green-100 text-green-800"
          : status === "Probation"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/50 backdrop-blur-sm">
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-8">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
                    <span className="text-4xl font-bold text-white">
                      {employee.fullName.charAt(0)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-2xl font-bold text-white">
                        {employee.fullName}
                      </h3>
                      <StatusBadge
                        status={employee.isActive ? "Active" : "Inactive"}
                      />
                    </div>
                    <p className="text-blue-100 flex items-center space-x-2">
                      <Award size={16} />
                      <span>{employee.role.name}</span>
                    </p>
                    <div className="flex items-center space-x-4 text-blue-100/80 text-sm">
                      <span className="flex items-center space-x-1">
                        <UserCheck size={14} />
                        <span>#{employee.employeeCode}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>
                          Joined{" "}
                          {new Date(
                            employee.dateOfJoining
                          ).toLocaleDateString()}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                      <Shield size={20} className="text-blue-600" />
                      <span>Basic Information</span>
                    </h4>
                    <div className="bg-gray-50 rounded-xl">
                      <InfoRow
                        icon={Mail}
                        label="Email Address"
                        value={employee.emailAddress}
                      />
                      <InfoRow
                        icon={Building}
                        label="Department"
                        value={employee.department?.name}
                      />
                      <InfoRow
                        icon={MapPin}
                        label="Country"
                        value={employee.country.name}
                      />
                    </div>
                  </motion.div>

                  {/* Employment Details */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                      <Briefcase size={20} className="text-blue-600" />
                      <span>Employment Details</span>
                    </h4>
                    <div className="bg-gray-50 rounded-xl">
                      <InfoRow
                        icon={Users}
                        label="Reports To"
                        value={employee.manager?.fullName}
                      />
                      <InfoRow
                        icon={Briefcase}
                        label="Employment Type"
                        value={employee.employmentType}
                        badge={employee.employmentType}
                      />
                      {employee.probationEndDate && (
                        <InfoRow
                          icon={Calendar}
                          label="Probation End Date"
                          value={new Date(
                            employee.probationEndDate
                          ).toLocaleDateString()}
                        />
                      )}
                    </div>
                  </motion.div>
                </div>
                {console.log(employee)}
                {/* Leave Balance Section */}
                {employee.leaveBalances &&
                  employee.leaveBalances.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                        <Calendar size={20} className="text-blue-600" />
                        <span>Leave Balance</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {employee.leaveBalances.map((balance) => (
                          <motion.div
                            key={balance.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-gray-600">
                                {balance.policy.leaveType.name}
                              </span>
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                                {balance.year}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-baseline">
                                <span className="text-2xl font-bold text-blue-600">
                                  {balance.remainingDays}
                                </span>
                                <span className="text-sm text-gray-500">
                                  of {balance.entitledDays} days
                                </span>
                              </div>
                              <div className="relative pt-1">
                                <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-100">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${
                                        (balance.remainingDays /
                                          balance.entitledDays) *
                                        100
                                      }%`
                                    }}
                                    transition={{
                                      duration: 1,
                                      ease: "easeOut"
                                    }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Used: {balance.usedDays} days</span>
                                <span>
                                  Carry Forward: {balance.carryForwardDays} days
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                {/* Additional Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 p-4 rounded-xl"
                  >
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {calculateExperience(employee.dateOfJoining)}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-50 p-4 rounded-xl"
                  >
                    <p className="text-sm text-gray-500">Employment Status</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {employee.isOnNoticePeriod ? "Notice Period" : "Active"}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gray-50 p-4 rounded-xl"
                  >
                    <p className="text-sm text-gray-500">Team Size</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {employee.subordinates?.length || 0} Members
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-50 p-4 rounded-xl"
                  >
                    <p className="text-sm text-gray-500">Employment Type</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {employee.employmentType}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

const calculateExperience = (dateOfJoining) => {
  const joinDate = new Date(dateOfJoining);
  const today = new Date();
  const diffTime = Math.abs(today - joinDate);
  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
  const diffMonths = Math.floor(
    (diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
  );

  if (diffYears === 0) {
    return `${diffMonths} Months`;
  }
  return `${diffYears}Y ${diffMonths}M`;
};

export default EmployeeDetailsModal;
