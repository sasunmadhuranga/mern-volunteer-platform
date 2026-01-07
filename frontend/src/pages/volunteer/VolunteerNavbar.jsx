import { useState } from "react";
import { NavLink } from "react-router-dom";
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

  const navClass = ({isActive}) => isActive ? "text-white border-b-2 border-white-400 pb-1" : "hover:text-gray-300";
  return (
    <div className="sticky top-0 z-50 bg-teal-800 shadow-md px-4 md:px-12 py-4 flex justify-between items-center">
      {/* Left side: Profile picture + name */}
      <NavLink to="/volunteer/volunteerprofile" className="flex items-center space-x-3">
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
      </NavLink>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex space-x-6 text-gray-100 font-medium">
          <NavLink to="/volunteer" end className={navClass}>Events</NavLink>
          <NavLink to="/volunteer/volunteerprofile" className={navClass}>Profile</NavLink>
          <NavLink to="/volunteer/eventhistory" className={navClass} >History</NavLink>
          <NavLink to="/volunteer/attendance" className={navClass}>Attendance</NavLink>
          <NavLink to="/volunteer/certification" className={navClass}>Certification</NavLink>
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
                <NavLink to="/volunteer" end className={navClass} onClick={() => setMenuOpen(false)}>Events</NavLink>
                <NavLink to="/volunteer/volunteerprofile" end className={navClass} onClick={() => setMenuOpen(false)}>Profile</NavLink>
                <NavLink to="/volunteer/eventhistory" end className={navClass} onClick={() => setMenuOpen(false)}>History</NavLink>
                <NavLink to="/volunteer/attendance" end className={navClass} onClick={() => setMenuOpen(false)}>Attendance</NavLink>
                <NavLink to="/volunteer/certification" end className={navClass} onClick={() => setMenuOpen(false)}>Certification</NavLink>
                <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
              </div>
            </div>
          )}
    </div>
  );
}
