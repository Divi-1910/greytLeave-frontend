import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { RecoilRoot } from "recoil";
import { useAdmin } from "./context/AdminContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ErrPage from "./pages/ErrPage";
import AdminLogin from "./pages/AdminLogin";
import AllEmployeeTable from "./Components/AllEmployeeTable";
import Loading from "./Components/Loading";
import AdminPage from "./pages/AdminPage";
import UpdateEmployee from "./Components/UpdateEmployee";
import Register from "./pages/Register";
import AuthSuccess from "./Components/AuthSuccess";
import LeaveRequestForm from "./Components/LeaveRequestForm/LeaveRequestForm";
import { FormDataProvider } from "./context/FormDataContext";
import ForgotPassword from "./pages/ForgotPassword";
import AllLeaveRequestsTable from "./Components/AllLeaveRequestsTable";
import AddEmployee from "./Components/AddEmployee";

function AdminRoute({ children }) {
  const { isAdmin, loading: adminLoading } = useAdmin();
  if (adminLoading) {
    return <Loading />;
  }
  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

function EmployeeRoute({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  if (authLoading) {
    return <Loading />;
  }

  console.log("inside the employee route - ", isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/profile"
            element={
              <EmployeeRoute>
                <Profile />
              </EmployeeRoute>
            }
          />
          <Route
            path="/leave-request-form"
            element={
              <EmployeeRoute>
                <FormDataProvider>
                  <LeaveRequestForm />
                </FormDataProvider>
              </EmployeeRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          >
            <Route
              path="dashboard"
              element={<h1>Welcome to Admin Dashboard</h1>}
            />
            <Route path="leave-requests" element={<AllLeaveRequestsTable />} />
            <Route path="employees" element={<AllEmployeeTable />} />
            <Route
              path="update-employee/:employeeId"
              element={<UpdateEmployee />}
            />
            <Route path="add-employee" element={<AddEmployee />} />
          </Route>
          <Route path="*" element={<ErrPage />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

export default App;
