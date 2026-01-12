import { NavLink } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useUser } from "../../context/UserContext";

export default function OrgNavbar() {
  const { user, loading, logout } = useUser(); // ✅ shared state
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  if (loading) return null;
  if (!user) return null;

  const navClass = ({ isActive }) =>
    isActive
      ? "text-white border-b-2 border-white pb-1"
      : "hover:text-gray-300";

  return (
    <div className="sticky top-0 z-50 bg-blue-700 shadow-md px-4 md:px-12 py-4 flex justify-between items-center">
      
      {/* Left side: Profile picture + name */}
      <NavLink to="/org/profile" className="flex items-center space-x-3">
        {user.profilePicUrl ? (
          <img
            src={`${user.profilePicUrl}?t=${Date.now()}`}
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover border"
          />

        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
            <FiUser className="w-6 h-6 text-gray-600" />
          </div>
        )}

        <span className="hidden md:inline font-semibold text-gray-100">
          {user.name}
        </span>
      </NavLink>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex space-x-6 text-gray-100 font-medium">
        <NavLink to="/org" end className={navClass}>Dashboard</NavLink>
        <NavLink to="/org/profile" end className={navClass}>Profile</NavLink>
        <NavLink to="/org/addevents" end className={navClass}>Add Events</NavLink>
        <NavLink to="/org/manageevents" end className={navClass}>Manage Events</NavLink>
        <NavLink to="/org/manageapplication" end className={navClass}>Manage Application</NavLink>
        <NavLink to="/org/selecttemplate" end className={navClass}>Template</NavLink>
        <button onClick={logout} className="hover:text-gray-300">Logout</button>
      </div>

      {/* Hamburger */}
      <button
        className="md:hidden text-2xl text-gray-100"
        onClick={toggleMenu}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-blue-700 md:hidden">
          <div className="flex flex-col items-center gap-4 py-4 text-gray-100">
            <NavLink to="/org" end className={navClass} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
            <NavLink to="/org/profile" end className={navClass} onClick={() => setMenuOpen(false)}>Profile</NavLink>
            <NavLink to="/org/addevents" end className={navClass} onClick={() => setMenuOpen(false)}>Add Events</NavLink>
            <NavLink to="/org/manageevents" end className={navClass} onClick={() => setMenuOpen(false)}>Manage Events</NavLink>
            <NavLink to="/org/manageapplication" end className={navClass} onClick={() => setMenuOpen(false)}>Manage Application</NavLink>
            <NavLink to="/org/selecttemplate" end className={navClass} onClick={() => setMenuOpen(false)}>Template</NavLink>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
}
