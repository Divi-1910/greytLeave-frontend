import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Response Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const fetchAllLeaveRequests = async () => {
  try {
    const AdminToken = localStorage.getItem("adminToken");
    const response = await api.get(`/admin/all-leave-requests`, {
      headers: {
        Authorization: `Bearer ${AdminToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(
      error.response?.data?.message || "Failed to get all leave requests"
    );
  }
};

export const fetchEmployeeDetails = async (employeeId) => {
  try {
    const AdminToken = localStorage.getItem("adminToken");
    const response = await api.get(`/admin/employees/${employeeId}`, {
      headers: {
        Authorization: `Bearer ${AdminToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch employee details"
    );
  }
};

export const createEmployee = async (dataToSubmit) => {
  try {
    const token = localStorage.getItem("adminToken");
    console.log(token);
    console.log("inside the api");
    const response = await api.post(`/admin/create-employee`, dataToSubmit, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("got the response ", response);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to Add Employee");
  }
};

export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/employee/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Profile Response: ", response);
    return response.data;
  } catch (error) {
    console.error("Profile Error:", error);
    throw error;
  }
};

export const getSubordinateLeaveRequests = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/employee/subordinate-leave-request", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log("Error in fetching subordinate leave Requests", error);
    throw new Error(
      error.response?.data?.message ||
        "failed to fetch subordinate leave requests"
    );
  }
};

export const fetchLeaveRequest = async () => {
  try {
    const response = await api.get("/employee/self-leave-request");
    return response.data;
  } catch (error) {
    console.log("Error in fetching leave Requests", error);
    throw new Error(
      error.response?.data?.message || "failed to fetch leave requests"
    );
  }
};

export const submitLeaveRequest = async (leaveRequest) => {
  try {
    //	console.log("leave request format - " , leaveRequest);
    const response = await api.post("/employee/leave-requests", leaveRequest);
    //	console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error in submitting leave requests", error);
    throw new Error(
      error.response?.data?.message || "Failed to submit leave Requests"
    );
  }
};

export const createHoliday = async ({ countryId, description, date }) => {
  try {
    const AdminToken = localStorage.getItem("adminToken");
    const response = await api.post(
      "/admin/holidays",
      {
        countryId,
        description,
        date
      },
      {
        headers: {
          Authorization: `Bearer ${AdminToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating holiday:", error);
    throw new Error(error.response?.data?.message || "Failed to add holiday");
  }
};

export const getCountryDetails = async () => {
  try {
    const AdminToken = localStorage.getItem("adminToken");
    const response = await api.get("/admin/country-details", {
      headers: {
        Authorization: `Bearer ${AdminToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "failed to fetch Countries data"
    );
  }
};

export const fetchRoles = async () => {
  try {
    const AdminToken = localStorage.getItem("adminToken");
    const response = await api.get("/admin/roles", {
      headers: {
        Authorization: `Bearer ${AdminToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch Roles data"
    );
  }
};

export const fetchCountries = async () => {
  try {
    const AdminToken = localStorage.getItem("adminToken");
    const response = await api.get("/admin/countries", {
      headers: {
        Authorization: `Bearer ${AdminToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch countries data"
    );
  }
};

export const fetchEmployeeById = async (id) => {
  try {
    const AdminToken = localStorage.getItem("adminToken");
    const response = await api.get(`/admin/employees/${id}`, {
      headers: {
        Authorization: `Bearer ${AdminToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch employee data"
    );
  }
};

export const updateEmployee = async (id, data) => {
  try {
    const AdminToken = localStorage.getItem("adminToken");
    const response = await api.put(`/admin/employees/${id}`, data, {
      headers: {
        Authorization: `Bearer ${AdminToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update employee"
    );
  }
};

export const updateLeaveRequestStatus = async (
  id,
  status,
  rejectionReason = null
) => {
  try {
    const enumStatus =
      status === "APPROVED"
        ? "Approved"
        : status === "REJECTED"
        ? "Rejected"
        : "Cancelled";

    const response = await api.patch(`/employee/leave-requests/${id}`, {
      status: enumStatus,
      rejectionReason
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update the leave request"
    );
  }
};

export const fetchEmployees = async (params) => {
  try {
    const adminToken = localStorage.getItem("adminToken");
    const response = await api.get("/admin/employees", {
      headers: {
        Authorization: `Bearer ${adminToken}` // Correct syntax for headers
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch employees"
    );
  }
};

export const fetchDepartments = async () => {
  try {
    const adminToken = localStorage.getItem("adminToken");
    const response = await api.get("/admin/departments", {
      headers: {
        Authorization: adminToken
      }
    });
    return response.data;
  } catch (error) {}
};

// Additional utility functions for specific queries
export const fetchActiveEmployees = () => {
  return fetchEmployees({ isActive: true });
};

export const searchEmployees = (searchTerm) => {
  return fetchEmployees({ search: searchTerm });
};

export const fetchEmployeesByDepartment = (departmentId) => {
  return fetchEmployees({ department: departmentId });
};

export const fetchEmployeesPaginated = (page, limit) => {
  return fetchEmployees({ page, limit });
};

export const adminLogin = async (email, password) => {
  try {
    const response = await api.post("/auth/admin/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Invalid login credentials"
    );
  }
};

export const checkAuthStatus = async () => {
  try {
    const response = await api.get("/auth/status");
    return response.data;
  } catch (error) {
    console.error("Error checking auth status:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.get("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("error logging out:", error);
    throw error;
  }
};

export const getHolidays = async () => {
  try {
    const response = await api.get("/employee/all-holidays");
    return response.data;
  } catch (error) {
    console.error("error in getting all holidays", error);
    throw error;
  }
};

export const getApprovedLeaveRequests = async () => {
  try {
    const response = await api.get("/employee/approved-leave-requests");
    return response.data;
  } catch (error) {
    console.error("error in getting all approved leave requests ", error);
    throw error;
  }
};

export const uploadFiles = async (formData) => {
  try {
    const response = await api.post("/employee/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return response;
  } catch (error) {
    console.error("error in uploading file", error);
    throw new Error("Error in uploading File");
  }
};

export const getPresignedUrl = async (key) => {
  try {
    const response = await api.get(`/employee/document/${key}`);
    return response;
  } catch (error) {
    console.error("Error refreshing presigned URL:", error);
    toast.error("Error loading document");
  }
};

export const addCountry = async (countryData) => {
  try {
    const AdminToken = localStorage.getItem("adminToken");
    const response = await api.post("/admin/add-country", countryData, {
      headers: {
        Authorization: `Bearer ${AdminToken}`
      }
    });
    return response.data;
  } catch (err) {
    throw new Error("Failed to add country");
  }
};

export const getCountryDetailsById = async (countryId) => {
  try {
    const AdminToken = localStorage.getItem("adminToken");
    const response = await api.get(`/admin/countries/${countryId}`, {
      headers: {
        Authorization: `Bearer ${AdminToken}`
      }
    });
    return response.data;
  } catch (err) {
    throw new Error("Failed to fetch country details");
  }
};

export const getEmployeesByCountry = async (countryId) => {
  try {
    const AdminToken = localStorage.getItem("adminToken");
    const response = await api.get(`/admin/countries/${countryId}/employees`, {
      headers: {
        Authorization: `Bearer ${AdminToken}`
      }
    });
    return response.data;
  } catch (err) {
    throw new Error("Failed to fetch employees");
  }
};

export const updateHoliday = async (holidayId, newDetails) => {
  try {
    const AdminToken = localStorage.getItem("adminToken");
    const response = await api.put(`/admin/holidays/${holidayId}`, newDetails, {
      headers: {
        Authorization: `Bearer ${AdminToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update holiday"
    );
  }
};

export const getHolidayById = async (holidayId) => {
  try {
    const AdminToken = localStorage.getItem("adminToken");
    const response = await api.get(`/admin/holidays/${holidayId}`, {
      headers: {
        Authorization: `Bearer ${AdminToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching holiday details:", error);
    throw new Error("Failed to fetch holiday details");
  }
};

export const deleteCountry = async (countryId) => {
  try {
    const AdminToken = localStorage.getItem("adminToken");
    const response = await api.delete(`/admin/countries/${countryId}`, {
      headers: {
        Authorization: `Bearer ${AdminToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.log("error deleting holidays details : ", error);
    throw new Error("failed to delete country");
  }
};

export const sendOTP = async ({ id, emailAddress } = {}) => {
  try {
    const response = await api.post("/auth/send-otp", { id, emailAddress });
    return response.data;
  } catch (error) {
    console.error(
      "Error in sending OTP:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed in sending OTP");
  }
};

export const verifyOTP = async ({ emailAddress, otp } = {}) => {
  try {
    // console.log("inside verify otp - " , emailAddress);
    const response = await api.post("/auth/verify-otp", { emailAddress, otp });
    return response.data;
  } catch (error) {
    console.error(
      "Error in verifying OTP:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed in verifying OTP");
  }
};

export const verifyEmployeeCode = async (employeeCode) => {
  try {
    const response = await api.get(
      `/auth/verify-EmployeeCode?employeeCode=${employeeCode}`
    );
    return response.data;
  } catch (error) {
    console.log("error in verifying the EmployeeCode", error);
    throw new Error("Could not verify EmployeeCode");
  }
};

export const RegisterPassword = async ({ id, password }) => {
  try {
    const response = await api.patch(`/auth/register-password`, {
      id,
      password
    });
    return response.data;
  } catch (error) {
    console.log("Error in registering the employee", error);
    throw new Error("Could not register the password");
  }
};

export const HandleLogin = async ({ employeeCode, password }) => {
  try {
    const response = await api.post("/auth/employee/login", {
      employeeCode,
      password
    });
    console.log(response.data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    console.log("Error in logging in", error);
    throw new Error(error.response?.data?.message || "Could not log in");
  }
};

export const handleAuthSuccess = async (token) => {
  if (token) {
    localStorage.setItem("token", token);
    return true;
  }
  return false;
};

export const fetchHolidays = async () => {
  try {
    const response = await api.get("/employee/holidays");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch Holidays"
    );
  }
};

export const fetchLeaveTypes = async () => {
  try {
    const response = await api.get("/employee/leave-types");
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch leave policies"
    );
  }
};

export const createLeaveRequest = async (leaveRequestData) => {
  try {
    const response = await api.post(
      "/employee/leave-requests",
      leaveRequestData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create leave request"
    );
  }
};

export const fetchLeaveBalances = async () => {
  try {
    const response = await api.get("/employee/leave-balances");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch leave balances"
    );
  }
};

export default api;
