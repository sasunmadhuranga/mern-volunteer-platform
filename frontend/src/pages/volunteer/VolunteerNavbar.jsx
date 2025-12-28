import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { useUser } from "../../context/UserContext";

export default function VolunteerNavbar() {
  const { user, logout } = useUser(); // <-- useUser hook
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const handleLogout = () => {
    logout(); // automatically clears localStorage and navigates to login
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center py-6">
        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const profilePicUrl = user.profilePic?.startsWith("http")
    ? user.profilePic
    : `http://localhost:5000${user.profilePic}`;

  return (
    <div className="sticky top-0 z-50 bg-teal-800 shadow-md px-4 md:px-12 py-4 flex justify-between items-center">
      {/* Left side: Profile picture + name */}
      <Link to="/volunteer/volunteerprofile" className="flex items-center space-x-3">
        {user.profilePic ? (
          <img
            src={profilePicUrl}
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover border flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
            <FiUser className="w-6 h-6 text-gray-600" />
          </div>
        )}

        <span className="hidden md:inline font-semibold text-gray-100">{user.name}</span>
      </Link>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex space-x-6 text-gray-100 font-medium">
          <Link to="/volunteer" className="hover:text-gray-300">Events</Link>
          <Link to="/volunteer/volunteerprofile" className="hover:text-gray-300">Profile</Link>
          <Link to="/volunteer/eventhistory" className="hover:text-gray-300">History</Link>
          <Link to="/volunteer/attendance" className="hover:text-gray-300">Attendance</Link>
          <Link to="/volunteer/certification" className="hover:text-gray-300">Certification</Link>
          <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
      </div>

      {/* Hamburger Toggle */}
      <button
        className="md:hidden text-2xl text-gray-100 hover:text-gray-300"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Nav */}
          {menuOpen && (
            <div className="absolute top-full left-0 w-full bg-teal-800 shadow-md md:hidden animate-slide-down z-40">
              <div className="flex flex-col items-center gap-4 py-4 text-gray-100 font-medium">
                <Link to="/volunteer" className="hover:text-gray-300" onClick={() => setMenuOpen(false)}>Events</Link>
                <Link to="/volunteer/volunteerprofile" className="hover:text-gray-300" onClick={() => setMenuOpen(false)}>Profile</Link>
                <Link to="/volunteer/eventhistory" className="hover:text-gray-300" onClick={() => setMenuOpen(false)}>History</Link>
                <Link to="/volunteer/attendance" className="hover:text-gray-300" onClick={() => setMenuOpen(false)}>Attendance</Link>
                <Link to="/volunteer/certification" className="hover:text-gray-300" onClick={() => setMenuOpen(false)}>Certification</Link>
                <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
              </div>
            </div>
          )}
    </div>
  );
}
