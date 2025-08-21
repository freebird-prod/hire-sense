import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/dashboard/Dashboard";
import ApplierDashboardLayout from "./components/dashboard/ApplierDashboard";
import AuthPage from "./components/auth/Authentication";
import TopNotchPage from "./pages/TopNotchPage";
import FormUpload from "./components/dashboard/FormUpload";
import SearchPage from "./pages/SearchPage";
import TemplatePage from "./pages/TemplatePage";
import "./App.css";
import DashboardContent from "./components/dashboard/DashboardContent";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />

      {/* Recruiter Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="content" element={<DashboardContent />} />
          <Route path="upload" element={<FormUpload />} />
          <Route path="topnotch" element={<TopNotchPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="template" element={<TemplatePage />} />
          <Route path="" element={<Navigate to="content" replace />} />
        </Route>
      </Route>

      {/* Applier Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["applier"]} />}>
        <Route path="/applier-dashboard" element={<ApplierDashboardLayout />}>
          <Route path="content" element={<DashboardContent />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="template" element={<TemplatePage />} />
          <Route path="" element={<Navigate to="content" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
