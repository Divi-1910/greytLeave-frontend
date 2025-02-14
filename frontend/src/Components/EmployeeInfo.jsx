import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiCalendar,
  FiBriefcase,
  FiMail,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiUserPlus,
  FiX,
  FiCheck,
  FiEye,
  FiFilter,
  FiUserMinus,
  FiRefreshCw,
  FiPlus,
  FiDownload
} from "react-icons/fi";
import { fetchLeaveRequest } from "../api/api";
import { getProfile } from "../api/api";
import { useNavigate } from "react-router-dom";
import { getSubordinateLeaveRequests } from "../api/api.jsx";
import { updateLeaveRequestStatus } from "../api/api";
import { useCallback } from "react";
import LeaveRequestTable from "./LeaveRequestTable.jsx";
import { toast } from "react-toastify";
import CalendarContainer from "./Calendar.jsx";

const EmployeeInfo = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        console.log(response.data);
        setUser(response.data.employee);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const tabs = [
    { id: "profile", label: "Employee Information", icon: <FiUser /> },
    { id: "leaves", label: "Leave Balances", icon: <FiCalendar /> },
    { id: "subordinates", label: "Subordinate Details", icon: <FiUserPlus /> },
    {
      id: "subordinateLeaves",
      label: "Subordinates Leave Requests",
      icon: <FiClock />
    },
    {
      id: "selfLeaveRequests",
      label: "Self LeaveRequests",
      icon: <FiUserMinus />
    },
    { id: "calendar", label: "Leave Calendar", icon: <FiCalendar /> }
  ];

  if (loading) return <LoadingState />;

  return (
    <div className="bg-gray-50 w-full">
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                  <img
                    src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=random`}
                    alt={user?.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 border-4 border-white rounded-full"></span>
              </div>
              <div className="text-white">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {user?.fullName}
                </h1>
                <p className="text-blue-100 mt-1">{user?.role?.name}</p>
                <div className="flex items-center mt-2 text-sm text-blue-100">
                  <FiBriefcase className="mr-2" />
                  <span>{user?.department?.name}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm text-white">
                <FiCheckCircle className="mr-2" />
                Active Employee
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-around space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-6 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "profile" && <EmployeeInformationTab user={user} />}
            {activeTab === "leaves" && <LeaveBalancesTab user={user} />}
            {activeTab === "subordinates" && <SubordinatesTab user={user} />}
            {activeTab === "subordinateLeaves" && (
              <SubordinateLeaveRequestsTab user={user} />
            )}
            {activeTab === "selfLeaveRequests" && <SelfLeaveRequests />}
            {activeTab === "calendar" && <CalendarContainer />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const SubordinateDetail = ({ subordinate }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <img
          src={`https://ui-avatars.com/api/?name=${subordinate.fullName}&background=random`}
          alt={subordinate.fullName}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{subordinate.fullName}</h3>
        <p className="text-sm text-gray-500">{subordinate.role?.name}</p>
      </div>
    </div>

    <div className="space-y-3">
      <div className="flex items-center text-sm">
        <FiBriefcase className="text-gray-400 mr-2" />
        <span className="text-gray-600">{subordinate.department?.name}</span>
      </div>
      <div className="flex items-center text-sm">
        <FiMail className="text-gray-400 mr-2" />
        <span className="text-gray-600">{subordinate.emailAddress}</span>
      </div>
      <div className="flex items-center text-sm">
        <FiClock className="text-gray-400 mr-2" />
        <span className="text-gray-600">
          Joined {new Date(subordinate.dateOfJoining).toLocaleDateString()}
        </span>
      </div>
      <div className="flex items-center text-sm">
        <FiMapPin className="text-gray-400 mr-2" />
        <span className="text-gray-600">{subordinate.country?.name}</span>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Employment Status</span>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            subordinate.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {subordinate.isActive ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  </div>
);

const SubordinatesTab = ({ user }) => {
  if (!user?.subordinates || user.subordinates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FiUserPlus className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No Subordinates</h3>
        <p className="text-gray-500 text-sm">
          You currently don't have any subordinates reporting to you.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">
          Managing {user.subordinates.length} Team Member
          {user.subordinates.length !== 1 ? "s" : ""}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Overview of employees reporting directly to you
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.subordinates.map((subordinate) => (
          <SubordinateDetail key={subordinate.id} subordinate={subordinate} />
        ))}
      </div>
    </div>
  );
};

const EmployeeInformationTab = ({ user }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <InfoCard
      title="Basic Information"
      icon={<FiUser className="text-blue-500" />}
      items={[
        { label: "Full Name", value: user?.fullName },
        { label: "Employee Code", value: user?.employeeCode },
        { label: "Email", value: user?.emailAddress },
        {
          label: "Date of Joining",
          value: new Date(user?.dateOfJoining).toLocaleDateString()
        }
      ]}
    />
    <InfoCard
      title="Employment Details"
      icon={<FiBriefcase className="text-green-500" />}
      items={[
        { label: "Department", value: user?.department?.name },
        { label: "Role", value: user?.role?.name },
        { label: "Employment Type", value: user?.employmentType },
        { label: "Status", value: user?.isActive ? "Active" : "Inactive" }
      ]}
    />
    <InfoCard
      title="Location"
      icon={<FiMapPin className="text-red-500" />}
      items={[
        { label: "Country", value: user?.country?.name },
        { label: "Country Code", value: user?.country?.code }
      ]}
    />
  </div>
);

const LeaveBalancesTab = ({ user }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {user?.leaveBalance?.map((leave) => (
      <div
        key={leave.id}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium text-gray-900">
              {leave.leavePolicy.leaveType.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {leave.leavePolicy.leaveType.description}
            </p>
          </div>
          {leave.leavePolicy.leaveType.requiresProof && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              <FiAlertCircle className="mr-1" />
              Proof Required
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl font-bold text-blue-600">
            {leave.remainingDays < 356 ? leave.remainingDays : "Infinte"}
          </div>
          {leave.entitledDays < 356 && (
            <div className="text-right">
              <div className="text-sm text-gray-500">Available Days</div>
              <div className="text-sm font-medium text-gray-900">
                of {leave.entitledDays < 356 ? leave.entitledDays : "Infinite"}{" "}
                total
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Used</span>
            <span>{leave.usedDays} days</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 rounded-full h-2 transition-all duration-300"
              style={{
                width: `${(leave.usedDays / leave.entitledDays) * 100}%`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {Math.round((leave.usedDays / leave.entitledDays) * 100)}% used
            </span>
            <span>
              {leave.carryForwardDays > 0 &&
                `${leave.carryForwardDays} days carried forward`}
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const InfoCard = ({ title, icon, items }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center mb-4">
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      <h3 className="ml-3 font-medium text-gray-900">{title}</h3>
    </div>
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex flex-col">
          <span className="text-sm text-gray-500">{item.label}</span>
          <span className="text-sm font-medium text-gray-900 mt-1">
            {item.value || "Not specified"}
          </span>
          {index !== items.length - 1 && (
            <div className="border-b border-gray-100 mt-4"></div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-gray-500">Loading profile information...</p>
    </div>
  </div>
);

const SubordinateLeaveRequestsTab = ({ user }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [selectedLeave, setSelectedLeave] = useState(null);

  useEffect(() => {
    fetchSubordinateLeaveRequests();
  }, []);

  const openLeaveDetails = (leave) => {
    setSelectedLeave(leave);
  };

  const fetchSubordinateLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await getSubordinateLeaveRequests();
      console.log("the response for subordinateLeaveRequests are - ", response);
      setLeaveRequests(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await updateLeaveRequestStatus(requestId, status);
      await fetchSubordinateLeaveRequests();
    } catch (err) {
      console.error("Error updating leave request:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  const filteredRequests = leaveRequests.filter((request) =>
    filter === "all" ? true : request.status.toLowerCase() === filter
  );

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Subordinate Leave Requests
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage leave requests from your team members
          </p>
        </div>
        <div className="relative inline-block">
          <div className="relative flex items-center">
            <div className="absolute left-3 text-gray-500">
              <FiFilter className="w-4 h-4" />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="
        appearance-none
        bg-white
        pl-10
        pr-10
        py-2.5
        text-sm
        font-medium
        text-gray-700
        border
        border-gray-300
        rounded-lg
        shadow-sm
        hover:border-gray-400
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:border-blue-500
        transition-all
        duration-200
        min-w-[180px]
        cursor-pointer
      "
            >
              <option value="all" className="py-2">
                All Requests
              </option>
              <option value="pending" className="py-2 text-yellow-600">
                Pending
              </option>
              <option value="approved" className="py-2 text-green-600">
                Approved
              </option>
              <option value="rejected" className="py-2 text-red-600">
                Rejected
              </option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No leave requests
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no leave requests matching your current filter.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={`https://ui-avatars.com/api/?name=${request.employee.fullName}&background=random`}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {request.employee.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.employee.emailAddress}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {request.leavePolicy.leaveType.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {request.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(request.startDate).toLocaleDateString()} -{" "}
                      {new Date(request.endDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {request.requestedNumberOfDays} days
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        request.status.toUpperCase() === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : request.status.toUpperCase() === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openLeaveDetails(request)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <FiEye className="mr-1.5 h-4 w-4" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedLeave && (
        <LeaveDetailsModal
          leave={selectedLeave}
          onClose={() => setSelectedLeave(null)}
          handleStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

const LeaveDetailsModal = ({ leave, onClose, handleStatusUpdate }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Leave Request Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Employee
              </label>
              <p className="mt-1">{leave.employee.fullName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Leave Type
              </label>
              <p className="mt-1">{leave.leavePolicy.leaveType.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Start Date
              </label>
              <p className="mt-1">
                {new Date(leave.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                End Date
              </label>
              <p className="mt-1">
                {new Date(leave.endDate).toLocaleDateString()}
              </p>
              {leave.supportingDoc && (
                <div className="mt-2">
                  <a
                    href={leave.supportingDoc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Uploaded Document
                  </a>
                </div>
              )}
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-500">
                Reason
              </label>
              <p className="mt-1">{leave.reason}</p>
            </div>
            <div>
              <label className="text-sm mr-4 font-medium text-gray-500">
                Status
              </label>
              <span
                className={`mt-1 px-2  inline-flex text-xs leading-5 font-semibold rounded-full 
                ${
                  leave.status.toUpperCase() === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : leave.status.toUpperCase() === "REJECTED"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {leave.status}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            {leave.status.toUpperCase() === "PENDING" && (
              <>
                <button
                  onClick={() => {
                    handleStatusUpdate(leave.id, "APPROVED");
                    onClose();
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FiCheck className="mr-2 h-4 w-4" />
                  Approve Request
                </button>
                <button
                  onClick={() => {
                    handleStatusUpdate(leave.id, "REJECTED");
                    onClose();
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FiX className="mr-2 h-4 w-4" />
                  Reject Request
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SelfLeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("pending");
  const navigate = useNavigate();

  const fetchLeaveRequests = useCallback(
    async (showRefreshIndicator = false) => {
      try {
        showRefreshIndicator ? setIsRefreshing(true) : setIsLoading(true);
        const response = await fetchLeaveRequest();
        setLeaveRequests(response);
        if (showRefreshIndicator) {
          toast.success("Leave requests updated successfully");
        }
      } catch (error) {
        console.error("Error fetching leave requests:", error);
        toast.error("Failed to fetch leave requests. Please try again later.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests]);

  const handleNewLeaveRequest = () => navigate("/leave-request-form");

  const handleRefresh = () => fetchLeaveRequests(true);

  const getFilteredRequests = () => {
    if (!leaveRequests.data) return [];
    if (filterStatus === "ALL") return leaveRequests.data;
    const filteredLeaveRequests = leaveRequests.data.filter(
      (request) => request.status.toLowerCase() === filterStatus.toLowerCase()
    );
    console.log("filtered leave requests are - ", filteredLeaveRequests);
    return filteredLeaveRequests;
  };

  const getStatusCounts = () => {
    if (!leaveRequests.data) return { pending: 0, approved: 0, rejected: 0 };
    return leaveRequests.data.reduce(
      (acc, curr) => {
        switch (curr.status.toLowerCase()) {
          case "pending":
            acc.pending++;
            break;
          case "approved":
            acc.approved++;
            break;
          case "rejected":
            acc.rejected++;
            break;
          default:
            break;
        }
        return acc;
      },
      { pending: 0, approved: 0, rejected: 0 }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <StatsCard
          title="Pending Requests"
          value={getStatusCounts().pending}
          icon={<FiClock className="h-6 w-6 text-yellow-600" />}
          bgColor="bg-yellow-50"
        />
        <StatsCard
          title="Approved Requests"
          value={getStatusCounts().approved}
          icon={<FiCheckCircle className="h-6 w-6 text-green-600" />}
          bgColor="bg-green-50"
        />
        <StatsCard
          title="Total Requests"
          value={leaveRequests.data?.length || 0}
          icon={<FiCalendar className="h-6 w-6 text-blue-600" />}
          bgColor="bg-blue-50"
        />
      </motion.div>
      <motion.div
        className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Leave Requests
              </h2>
              <p className="text-gray-600 mt-1">
                Manage and track your leave applications
              </p>
            </div>
            <div className="flex space-x-4">
              <Button
                icon={
                  <FiRefreshCw className={isRefreshing ? "animate-spin" : ""} />
                }
                onClick={handleRefresh}
                variant="secondary"
                disabled={isRefreshing}
              >
                Refresh
              </Button>
              <Button
                icon={<FiPlus />}
                onClick={handleNewLeaveRequest}
                variant="primary"
              >
                New Request
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <StatusFilter
                status="pending"
                active={filterStatus.toLowerCase() === "pending"}
                onClick={() => setFilterStatus("pending")}
                count={getStatusCounts().pending}
              />
              <StatusFilter
                status="approved"
                active={filterStatus.toLowerCase() === "approved"}
                onClick={() => setFilterStatus("approved")}
                count={getStatusCounts().approved}
              />
              <StatusFilter
                status="rejected"
                active={filterStatus.toLowerCase() === "rejected"}
                onClick={() => setFilterStatus("rejected")}
                count={getStatusCounts().rejected}
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-sm text-gray-600 hover:text-blue-600">
                <FiDownload className="mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingState />
            ) : getFilteredRequests().length > 0 ? (
              <LeaveRequestTable leaveRequests={getFilteredRequests()} />
            ) : (
              <EmptyState onCreateNew={handleNewLeaveRequest} />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
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
        active ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
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
  className = ""
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

export default EmployeeInfo;
