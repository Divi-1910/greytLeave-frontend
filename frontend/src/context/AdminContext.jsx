import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from "react";

const AdminContext = createContext(null);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  const checkAdminStatus = useCallback(async () => {
    setLoading(true);
    try {
      const adminToken = localStorage.getItem("adminToken");
      console.log("Checking admin status, token:", adminToken);

      if (adminToken) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        setAdminData(null);
      }
    } catch (error) {
      console.error("Failed to verify admin status:", error);
      setIsAdmin(false);
      setAdminData(null);
      localStorage.removeItem("adminToken");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  const adminlogin = useCallback(async (loginResponse) => {
    try {
      console.log("Admin login function called with response:", loginResponse);
      const { Admintoken, admin } = loginResponse;
      console.log("token is - ", Admintoken);
      localStorage.setItem("adminToken", Admintoken);
      setAdminData(admin);
      setIsAdmin(true);
      return true;
    } catch (error) {
      console.error("Admin login error:", error);
      setIsAdmin(false);
      setAdminData(null);
      localStorage.removeItem("adminToken");
      return false;
    }
  }, []);

  const adminlogout = useCallback(() => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
    setAdminData(null);
  }, []);

  const value = {
    isAdmin,
    loading,
    adminData,
    adminlogin,
    adminlogout,
    checkAdminStatus
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
