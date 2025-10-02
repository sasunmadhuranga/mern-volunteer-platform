import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Signup from './pages/Signup';
import Login from "./pages/Login";
import './index.css';
import Landing from "./pages/Landing";
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";
import OrgDashboard from './pages/orgadmin/OrgDashboard';
import AdminDashboard from "./pages/admin/AdminDashboard";
import OrgProfile from './pages/orgadmin/OrgProfile';
import ProtectedRoute from "./pages/ProtectedRoute";
import OrgAddEvents from './pages/orgadmin/OrgAddEvents';
import OrgVerification from './pages/orgadmin/OrgVerification';
import OrgManageEvents from './pages/orgadmin/OrgManageEvents';
import EventVerification from './pages/admin/EventVerification';
import EventsSection from './pages/volunteer/EventsSection';
import VolunteerProfile from './pages/volunteer/VolunteerProfile';
import EventRegistration from "./pages/volunteer/EventRegistration";
import EventHistory from "./pages/volunteer/EventHistory";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <Router> 
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        
        <Route 
          path="/org/*" 
          element={
            <ProtectedRoute role="ORG_ADMIN">
              <OrgDashboard />  {/* This renders OrgNavbar + <Outlet /> */}
            </ProtectedRoute>
          }
        >
          <Route path="profile" element={<OrgProfile />} />
          <Route path="addevents" element={<OrgAddEvents />} />
          <Route path="manageevents" element={<OrgManageEvents />} />
          <Route path="verification" element={<OrgVerification />} />
        </Route>
        
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard/>
            </ProtectedRoute>
          }
        >
          <Route path="eventverification" element={<EventVerification/>}/>
        </Route>
        <Route
          path="/volunteer/*"
          element={
            <ProtectedRoute role="VOLUNTEER">
              <VolunteerDashboard/>
            </ProtectedRoute>
          }
        >
          <Route path="eventsection" element={<EventsSection/>}/>
          <Route path="volunteerprofile" element={<VolunteerProfile/>}/>
          <Route path="eventregistration/:eventId" element={<EventRegistration />} />
          <Route path="eventhistory" element={<EventHistory/>}/>
        </Route>

      </Routes>
    </Router>
    </>
  );
}