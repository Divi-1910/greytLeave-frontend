import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  fetchEmployeeById,
  updateEmployee,
  fetchRoles,
  fetchCountries,
  fetchDepartments
} from "../api/api";
import Loading from "./Loading";
import {
  UserCircle,
  Mail,
  Briefcase,
  Globe,
  Building2,
  Phone,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";

const UpdateEmployee = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    roleId: "",
    departmentId: "",
    countryId: "",
    dateOfJoining: "",
    employeeCode: "",
    isActive: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeData, rolesData, departmentsData, countriesData] =
          await Promise.all([
            fetchEmployeeById(employeeId),
            fetchRoles(),
            fetchDepartments(),
            fetchCountries()
          ]);

        console.log("employee data - ", employeeData);
        console.log("roles data is - ", rolesData);
        console.log("department data is - ", departmentsData);
        console.log("country data is ", countriesData);

        setFormData({
          fullName: employeeData.fullName,
          emailAddress: employeeData.emailAddress,
          phoneNumber: employeeData.phoneNumber,
          roleId: employeeData.roleId,
          departmentId: employeeData.departmentId,
          countryId: employeeData.countryId,
          dateOfJoining: employeeData.dateOfJoining.split("T")[0],
          employeeCode: employeeData.employeeCode,
          isActive: employeeData.isActive
        });

        setRoles(rolesData);
        setDepartments(departmentsData);
        setCountries(countriesData);
      } catch (error) {
        toast.error("Failed to load employee data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setIsFormDirty(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateEmployee(employeeId, formData);
      toast.success("Employee updated successfully!");
      navigate("/admin-dashboard/employees");
    } catch (error) {
      toast.error("Failed to update employee");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isFormDirty) {
      toast(
        (t) => (
          <div className="flex flex-col gap-4">
            <p>You have unsaved changes. Are you sure you want to leave?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate("/admin-dashboard/employees");
                }}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Leave
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Stay
              </button>
            </div>
          </div>
        ),
        { duration: Infinity }
      );
    } else {
      navigate("/admin-dashboard/employees");
    }
  };

  if (loading) return <Loading />;

  const inputClasses =
    "w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      {console.log(formData)}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Update Employee Information
            </h1>
            <p className="mt-2 text-gray-600">
              Employee Code: #{formData.employeeCode}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Personal Information
              </h2>

              <div className="flex items-center space-x-4">
                <UserCircle className="w-6 h-6 text-gray-400" />
                <div className="flex-1">
                  <label className={labelClasses}>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Mail className="w-6 h-6 text-gray-400" />
                <div className="flex-1">
                  <label className={labelClasses}>Email Address</label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Work Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <Briefcase className="w-6 h-6 text-gray-400" />
                  <div className="flex-1">
                    <label className={labelClasses}>Role</label>
                    <select
                      name="roleId"
                      value={formData.roleId}
                      onChange={handleInputChange}
                      className={inputClasses}
                      required
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Building2 className="w-6 h-6 text-gray-400" />
                  <div className="flex-1">
                    <label className={labelClasses}>Department</label>
                    <select
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleInputChange}
                      className={inputClasses}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Globe className="w-6 h-6 text-gray-400" />
                  <div className="flex-1">
                    <label className={labelClasses}>Country</label>
                    <select
                      name="countryId"
                      value={formData.countryId}
                      onChange={handleInputChange}
                      className={inputClasses}
                      required
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Calendar className="w-6 h-6 text-gray-400" />
                  <div className="flex-1">
                    <label className={labelClasses}>Date of Joining</label>
                    <input
                      type="date"
                      name="dateOfJoining"
                      value={formData.dateOfJoining}
                      onChange={handleInputChange}
                      className={inputClasses}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Active Status
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 mt-6 border-t">
              <motion.button
                type="button"
                onClick={handleCancel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </motion.button>

              <motion.button
                type="submit"
                disabled={saving || !isFormDirty}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-2.5 bg-blue-600 text-white rounded-lg transition-colors duration-200
                  ${
                    saving || !isFormDirty
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700 cursor-pointer"
                  }
                  flex items-center space-x-2`}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Employee</span>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default UpdateEmployee;
