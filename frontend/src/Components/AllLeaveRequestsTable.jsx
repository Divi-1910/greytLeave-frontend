import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { FiSearch, FiFilter, FiDownload, FiFile } from "react-icons/fi";
import { motion } from "framer-motion";
import { CSVLink } from "react-csv";
import { fetchAllLeaveRequests } from "../api/api";
import LeaveDetailsModal from "./LeaveDetailsModal";

const AllLeaveRequestsTable = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc"
  });
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (leaveRequest) => {
    setSelectedLeave(leaveRequest);
    setIsModalOpen(true);
  };

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    Cancelled: "bg-gray-100 text-gray-800"
  };

  const leavePeriodLabels = {
    FullDay: "Full Day",
    HalfDay: "Half Day",
    Mixed: "Mixed"
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const data = await fetchAllLeaveRequests();
      setLeaveRequests(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      setLoading(false);
    }
  };

  const handleViewDocument = (documentUrl) => {
    if (documentUrl) {
      window.open(documentUrl, "_blank");
    }
  };

  const filteredRequests = leaveRequests.filter((request) => {
    const matchesSearch =
      request.employee.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request.employee.employeeCode
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || request.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortConfig.key === "employeeName") {
      return sortConfig.direction === "asc"
        ? a.employee.fullName.localeCompare(b.employee.fullName)
        : b.employee.fullName.localeCompare(a.employee.fullName);
    }
    return sortConfig.direction === "asc"
      ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
      : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
  });

  const csvData = sortedRequests.map((request) => ({
    "Employee Code": request.employee.employeeCode,
    "Employee Name": request.employee.fullName,
    Email: request.employee.emailAddress,
    "Start Date": format(new Date(request.startDate), "dd/MM/yyyy"),
    "End Date": format(new Date(request.endDate), "dd/MM/yyyy"),
    Days: request.requestedNumberOfDays,
    "Leave Period": leavePeriodLabels[request.leavePeriod],
    Status: request.status,
    Reason: request.reason || "N/A",
    "Approved By": request.approvedBy?.fullName || "N/A",
    "Approval Date": request.approvalDate
      ? format(new Date(request.approvalDate), "dd/MM/yyyy")
      : "N/A"
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Leave Requests</h1>
        <p className="text-gray-600">
          Manage and review all employee leave requests
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by employee name or code..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <CSVLink
            data={csvData}
            filename={`leave-requests-${format(new Date(), "dd-MM-yyyy")}.csv`}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FiDownload /> Export
          </CSVLink>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leave Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason & Documents
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approval Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRequests.map((request) => (
              <motion.tr
                key={request.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-lg font-medium text-blue-600">
                          {request.employee.fullName.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {request.employee.fullName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {request.employee.employeeCode}
                      </div>
                      <div className="text-xs text-gray-500">
                        {request.employee.emailAddress}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {leavePeriodLabels[request.leavePeriod]}
                  </div>
                  <div className="text-xs text-gray-500">
                    {request.requestedNumberOfDays} days
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {format(new Date(request.startDate), "dd MMM yyyy")}
                  </div>
                  <div className="text-xs text-gray-500">to</div>
                  <div className="text-sm text-gray-900">
                    {format(new Date(request.endDate), "dd MMM yyyy")}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      statusStyles[request.status]
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs">
                    {request.reason || "No reason provided"}
                  </div>
                  {request.supportingDoc && (
                    <button
                      onClick={() => handleViewDocument(request.supportingDoc)}
                      className="mt-2 inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                    >
                      <FiFile className="mr-1" />
                      View Document
                    </button>
                  )}
                </td>
                <td className="px-6 py-4">
                  {request.approvedBy && (
                    <>
                      <div className="text-sm text-gray-900">
                        Approved by: {request.approvedBy.fullName}
                      </div>
                      <div className="text-xs text-gray-500">
                        on{" "}
                        {format(new Date(request.approvalDate), "dd MMM yyyy")}
                      </div>
                    </>
                  )}
                  {request.rejectionReason && (
                    <div className="text-xs text-red-600 mt-1">
                      Reason: {request.rejectionReason}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(request)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      className="mr-2 -ml-1 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Details
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {sortedRequests.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No leave requests found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter parameters"
                : "No leave requests have been submitted yet."}
            </p>
          </div>
        )}
      </div>

      <LeaveDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        leaveRequest={selectedLeave}
      />

      <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
        <div>Total Requests: {sortedRequests.length}</div>
        <div className="flex gap-4">
          <div>
            Approved:{" "}
            {sortedRequests.filter((r) => r.status === "Approved").length}
          </div>
          <div>
            Pending:{" "}
            {sortedRequests.filter((r) => r.status === "Pending").length}
          </div>
          <div>
            Rejected:{" "}
            {sortedRequests.filter((r) => r.status === "Rejected").length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllLeaveRequestsTable;
