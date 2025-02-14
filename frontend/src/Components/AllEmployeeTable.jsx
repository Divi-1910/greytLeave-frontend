import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowUpDown, UserPlus, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import EmployeeDetailsModal from "./EmployeeDetailsModal";
import TableLoading from "./TableLoading";
import { fetchEmployees } from "../api/api";

const TableHeader = ({ children, onClick, sorted }) => (
  <th
    onClick={onClick}
    className="px-6 py-4 text-left text-sm font-semibold text-white cursor-pointer select-none"
  >
    <div className="flex items-center space-x-1 hover:opacity-80 transition-opacity">
      <span>{children}</span>
      {onClick && (
        <ArrowUpDown
          className={`w-4 h-4 ${
            sorted ? "text-yellow-300" : "text-white/50"
          } transition-colors`}
        />
      )}
    </div>
  </th>
);

// Pagination Component
const Pagination = ({ pagination, onPageChange, onLimitChange }) => (
  <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
    <div className="flex items-center space-x-4">
      <select
        value={pagination.limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-shadow"
      >
        {[25, 50, 100].map((value) => (
          <option key={value} value={value}>
            {value} per page
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-600">
        Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
        {Math.min(
          pagination.currentPage * pagination.limit,
          pagination.totalItems
        )}{" "}
        of {pagination.totalItems} entries
      </span>
    </div>
    <div className="flex space-x-2">
      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
        (page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-lg transition-all ${
              pagination.currentPage === page
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        )
      )}
    </div>
  </div>
);

const AllEmployeeTable = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc"
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 25,
    totalItems: 0,
    totalPages: 1
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchEmployees();
        const data = response.data;
        setAllEmployees(data);
        setFilteredEmployees(data);
      } catch (error) {
        toast.error("Failed to fetch employees");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = [...allEmployees];
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (emp) =>
          emp.fullName.toLowerCase().includes(lowerSearch) ||
          emp.emailAddress.toLowerCase().includes(lowerSearch) ||
          emp.employeeCode.toLowerCase().includes(lowerSearch)
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredEmployees(result);
    setPagination((prev) => ({
      ...prev,
      totalItems: result.length,
      totalPages: Math.ceil(result.length / prev.limit),
      currentPage: 1
    }));
  }, [searchTerm, sortConfig, allEmployees]);

  const currentItems = useMemo(() => {
    const start = (pagination.currentPage - 1) * pagination.limit;
    const end = start + pagination.limit;
    return filteredEmployees.slice(start, end);
  }, [filteredEmployees, pagination.currentPage, pagination.limit]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page
    }));
  };

  const handleLimitChange = (limit) => {
    setPagination((prev) => ({
      ...prev,
      limit,
      currentPage: 1,
      totalPages: Math.ceil(prev.totalItems / limit)
    }));
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const activeEmployees = useMemo(
    () => filteredEmployees.filter((emp) => emp.isActive).length,
    [filteredEmployees]
  );

  const departmentCount = useMemo(
    () => new Set(filteredEmployees.map((emp) => emp.department?.id)).size,
    [filteredEmployees]
  );

  const countryCount = useMemo(
    () => new Set(filteredEmployees.map((emp) => emp.country.id)).size,
    [filteredEmployees]
  );

  if (isLoading) {
    return <TableLoading />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Employee Management
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin-dashboard/add-employee")}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            <UserPlus size={20} />
            <span>Add Employee</span>
          </motion.button>
        </div>

        {/* Search and Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" />
          </div>
          <div className="flex justify-end">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              <span className="text-sm text-gray-500">Total Employees</span>
              <p className="text-xl font-bold text-blue-600">
                {filteredEmployees.length}
              </p>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  <TableHeader
                    onClick={() => handleSort("employeeCode")}
                    sorted={sortConfig.key === "employeeCode"}
                    sortDirection={sortConfig.direction}
                  >
                    Employee ID
                  </TableHeader>
                  <TableHeader
                    onClick={() => handleSort("fullName")}
                    sorted={sortConfig.key === "fullName"}
                    sortDirection={sortConfig.direction}
                  >
                    Name
                  </TableHeader>
                  <TableHeader
                    onClick={() => handleSort("emailAddress")}
                    sorted={sortConfig.key === "emailAddress"}
                    sortDirection={sortConfig.direction}
                  >
                    Email
                  </TableHeader>
                  <TableHeader>Role</TableHeader>
                  <TableHeader>Country</TableHeader>
                  <TableHeader>Department</TableHeader>
                  <TableHeader
                    onClick={() => handleSort("dateOfJoining")}
                    sorted={sortConfig.key === "dateOfJoining"}
                    sortDirection={sortConfig.direction}
                  >
                    Join Date
                  </TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {currentItems.map((employee, index) => (
                    <motion.tr
                      key={employee.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50 transition-colors duration-150`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            #{employee.employeeCode}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {employee.fullName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {employee.fullName}
                            </p>
                            {employee.manager && (
                              <p className="text-xs text-gray-500">
                                Reports to: {employee.manager.fullName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {employee.emailAddress}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 text-nowrap">
                          {employee.role.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {employee.country.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {employee.department?.name || (
                          <span className="text-gray-400 italic">
                            Not Assigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(employee.dateOfJoining).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          }
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              navigate(
                                `/admin-dashboard/update-employee/${employee.id}`
                              )
                            }
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-150"
                          >
                            Update
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewEmployee(employee)}
                            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg shadow-sm hover:bg-gray-200 transition-colors duration-150"
                          >
                            View
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        >
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">
              Active Employees
            </h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {activeEmployees}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Departments</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {departmentCount}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Countries</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {countryCount}
            </p>
          </div>
        </motion.div>

        {isModalOpen && (
          <EmployeeDetailsModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            employee={selectedEmployee}
          />
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/admin-dashboard/add-employee")}
          className="fixed bottom-6 right-6 md:hidden bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors duration-150"
        >
          <UserPlus size={24} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AllEmployeeTable;
