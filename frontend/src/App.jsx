import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./pages/ProtectedRoute";

// pages...
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";
import OrgDashboard from "./pages/orgadmin/OrgDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OrgProfile from "./pages/orgadmin/OrgProfile";
import OrgAddEvents from "./pages/orgadmin/OrgAddEvents";
import OrgManageApplications from "./pages/orgadmin/OrgManageApplications";
import OrgManageEvents from "./pages/orgadmin/OrgManageEvents";
import EventVerification from "./pages/admin/EventVerification";
import EventsSection from "./pages/volunteer/EventsSection";
import VolunteerProfile from "./pages/volunteer/VolunteerProfile";
import EventRegistration from "./pages/volunteer/EventRegistration";
import EventHistory from "./pages/volunteer/EventHistory";
import OrgContent from "./pages/orgadmin/OrgContent";
import AdminDashboardStats from "./pages/admin/AdminDashboardStats";
import Attendance from "./pages/volunteer/Attendance";
import AttendanceHistory from "./pages/components/AttendanceHistory";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminTemplates from "./pages/admin/AdminTemplates";
import CreateTemplate from "./pages/admin/CreateTemplate";
import EditTemplate from "./pages/admin/EditTemplate";
import SelectTemplate from "./pages/orgadmin/SelectTemplate";
import CertificateGenerator from "./pages/volunteer/CertificateGenerator";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <Router> {/* ✅ Wrap everything in Router */}
      <ToastContainer position="top-right" autoClose={3000} />

      <UserProvider>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

          {/* ORG ADMIN */}
          <Route
            path="/org/*"
            element={
              <ProtectedRoute role="ORG_ADMIN">
                <OrgDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<OrgContent />} />
            <Route path="profile" element={<OrgProfile />} />
            <Route path="addevents" element={<OrgAddEvents />} />
            <Route path="manageevents" element={<OrgManageEvents />} />
            <Route path="manageapplication" element={<OrgManageApplications />} />
            <Route path="selecttemplate" element={<SelectTemplate />} />
          </Route>

          {/* ADMIN */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardStats />} />
            <Route path="eventverification" element={<EventVerification />} />
            <Route path="templates" element={<AdminTemplates />} />
            <Route path="create" element={<CreateTemplate />} />
            <Route path="edit/:id" element={<EditTemplate />} />
          </Route>

          {/* VOLUNTEER */}
          <Route
            path="/volunteer/*"
            element={
              <ProtectedRoute role="VOLUNTEER">
                <VolunteerDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<EventsSection />} />
            <Route path="volunteerprofile" element={<VolunteerProfile />} />
            <Route path="eventregistration/:eventId" element={<EventRegistration />} />
            <Route path="eventhistory" element={<EventHistory />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="attendance-history" element={<AttendanceHistory />} />
            <Route path="certification" element={<CertificateGenerator />} />
          </Route>

        </Routes>
      </UserProvider>
    </Router>
  );
}