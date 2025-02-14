import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  UserCircle,
  Mail,
  Briefcase,
  Building2,
  Globe,
  Calendar,
  Hash,
  Users
} from "lucide-react";
import {
  fetchRoles,
  fetchDepartments,
  fetchCountries,
  fetchEmployees,
  createEmployee
} from "../api/api";

const EMPLOYMENT_TYPES = ["FullTime", "Contract", "Intern"];
const GENDER_TYPES = ["Male", "Female", "Other"];

const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeCode: "",
    fullName: "",
    emailAddress: "",
    dateOfJoining: "",
    probationEndDate: "",
    isOnNoticePeriod: false,
    employmentType: "FullTime",
    isActive: true,
    roleId: "",
    countryId: "",
    departmentId: "",
    managerId: "",
    Gender: "Male",
    BUHeadId: "",
    has_children: false
  });

  // States for dropdowns
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [countries, setCountries] = useState([]);
  const [managers, setManagers] = useState([]);
  const [buHeads, setBUHeads] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [rolesData, deptData, countriesData, managersData, buHeadsData] =
          await Promise.all([
            fetchRoles(),
            fetchDepartments(),
            fetchCountries(),
            fetchEmployees(),
            fetchEmployees()
          ]);

        console.log(rolesData);
        console.log(deptData);

        console.log(managersData);

        setRoles(rolesData);
        setDepartments(deptData);
        setCountries(countriesData);
        setManagers(managersData.data);
        setBUHeads(buHeadsData.data);
      } catch (error) {
        toast.error("Failed to load form data");
      }
    };

    fetchInitialData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "employeeCode",
      "fullName",
      "emailAddress",
      "dateOfJoining",
      "roleId",
      "countryId",
      "Gender"
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`${field.replace(/([A-Z])/g, " $1").trim()} is required`);
        return false;
      }
    }

    if (!formData.emailAddress.includes("@")) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log("inside submit");
    setLoading(true);
    try {
      const dataToSubmit = {
        ...formData,
        roleId: parseInt(formData.roleId),
        countryId: parseInt(formData.countryId),
        departmentId: formData.departmentId
          ? parseInt(formData.departmentId)
          : null,
        managerId: formData.managerId ? parseInt(formData.managerId) : null,
        BUHeadId: formData.BUHeadId ? parseInt(formData.BUHeadId) : null
      };
      console.log("data to submit ", dataToSubmit);
      const response = await createEmployee(dataToSubmit);
      console.log(response);
      if (response.success) {
        toast.success("Employee added successfully!");
      }
      navigate("/admin-dashboard/employees");
    } catch (error) {
      toast.error(error.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Employee
            </h1>
            <p className="mt-2 text-gray-600">
              Enter the details of the new employee
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Section title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  icon={<Hash />}
                  label="Employee Code"
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleInputChange}
                  required
                />

                <InputField
                  icon={<UserCircle />}
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />

                <InputField
                  icon={<Mail />}
                  label="Email Address"
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  required
                />

                <SelectField
                  icon={<UserCircle />}
                  label="Gender"
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleInputChange}
                  options={GENDER_TYPES}
                  required
                />
              </div>
            </Section>

            {/* Employment Details */}
            <Section title="Employment Details">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SelectField
                  icon={<Briefcase />}
                  label="Employment Type"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleInputChange}
                  options={EMPLOYMENT_TYPES}
                  required
                />

                <InputField
                  icon={<Calendar />}
                  label="Date of Joining"
                  type="date"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleInputChange}
                  required
                />

                <InputField
                  icon={<Calendar />}
                  label="Probation End Date"
                  type="date"
                  name="probationEndDate"
                  value={formData.probationEndDate}
                  onChange={handleInputChange}
                />

                <SelectField
                  icon={<Briefcase />}
                  label="Role"
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleInputChange}
                  options={roles.map((role) => ({
                    value: role.id,
                    label: role.name
                  }))}
                  required
                />

                <SelectField
                  icon={<Building2 />}
                  label="Department"
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleInputChange}
                  options={departments.map((dept) => ({
                    value: dept.id,
                    label: dept.name
                  }))}
                />

                <SelectField
                  icon={<Globe />}
                  label="Country"
                  name="countryId"
                  value={formData.countryId}
                  onChange={handleInputChange}
                  options={countries.map((country) => ({
                    value: country.id,
                    label: country.name
                  }))}
                  required
                />
              </div>
            </Section>

            {/* Reporting Structure */}
            <Section title="Reporting Structure">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  icon={<Users />}
                  label="Reporting Manager"
                  name="managerId"
                  value={formData.managerId}
                  onChange={handleInputChange}
                  options={managers.map((manager) => ({
                    value: manager.id,
                    label: manager.fullName
                  }))}
                />

                <SelectField
                  icon={<Users />}
                  label="BU Head"
                  name="BUHeadId"
                  value={formData.BUHeadId}
                  onChange={handleInputChange}
                  options={buHeads.map((head) => ({
                    value: head.id,
                    label: head.fullName
                  }))}
                />
              </div>
            </Section>

            {/* Additional Information */}
            <Section title="Additional Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Active Employee
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isOnNoticePeriod"
                    checked={formData.isOnNoticePeriod}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    On Notice Period
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="has_children"
                    checked={formData.has_children}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Has Children
                  </label>
                </div>
              </div>
            </Section>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 mt-6 border-t">
              <motion.button
                type="button"
                onClick={() => navigate("/admin-dashboard/employees")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </motion.button>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-2.5 bg-blue-600 text-white rounded-lg transition-colors duration-200
                  ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }
                  flex items-center space-x-2`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <span>Add Employee</span>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

// Helper Components
const Section = ({ title, children }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
      {title}
    </h2>
    {children}
  </div>
);

const InputField = ({ icon, label, required, ...props }) => (
  <div className="flex items-center space-x-4">
    {icon && <div className="text-gray-400">{icon}</div>}
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        {...props}
      />
    </div>
  </div>
);

const SelectField = ({ icon, label, options, required, ...props }) => (
  <div className="flex items-center space-x-4">
    {icon && <div className="text-gray-400">{icon}</div>}
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        {...props}
      >
        <option value="">Select {label}</option>
        {Array.isArray(options)
          ? options.map((option, index) => (
              <option
                key={option.value || index}
                value={option.value || option}
              >
                {option.label || option}
              </option>
            ))
          : null}
      </select>
    </div>
  </div>
);

export default AddEmployee;
