import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUser } from "react-icons/fi";
import { FaBars, FaTimes } from 'react-icons/fa';

export default function OrgNavbar() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
        } else {
          setError("Session expired. Please log in again.");
          localStorage.clear();
          navigate("/login");
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError("Server error. Please try again later.");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!user) return <p>Loading...</p>;

  const profilePicUrl = user.profilePic?.startsWith("http")
    ? user.profilePic
    : `http://localhost:5000${user.profilePic}`;

  const navClass = ({isActive}) => isActive ? "text-white border-b-2 border-white-300 pb-1" : "hover:text-gray-300";

  return (
    <div className="sticky top-0 z-50 bg-blue-700 shadow-md px-4 md:px-12 py-4 flex justify-between items-center">
      {/* Left side: Profile picture + name */}
      <NavLink to='/org/profile' className="flex items-center space-x-3">
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
        <NavLink to="/org" end className={navClass}>Dashboard</NavLink>
        <NavLink to="/org/profile" end className={navClass}>Profile</NavLink>
        <NavLink to="/org/addevents" end className={navClass}>Add Events</NavLink>
        <NavLink to="/org/manageevents" end className={navClass}>Manage Events</NavLink>
        <NavLink to="/org/manageapplication" end className={navClass}>Manage Application</NavLink>
        <NavLink to="/org/selecttemplate" end className={navClass}>Template</NavLink>
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
        <div className="absolute top-full left-0 w-full bg-blue-700 shadow-md md:hidden animate-slide-down z-40">
          <div className="flex flex-col items-center gap-4 py-4 text-gray-100 font-medium">
            <NavLink to="/org" end className={navClass} onClick={() => setMenuOpen(false) }>Dashboard</NavLink>
            <NavLink to="/org/profile" end className={navClass} onClick={() => setMenuOpen(false)}>Profile</NavLink>
            <NavLink to="/org/addevents" end className={navClass} onClick={() => setMenuOpen(false)}>Add Events</NavLink>
            <NavLink to="/org/manageevents" end className={navClass} onClick={() => setMenuOpen(false)}>Manage Events</NavLink>
            <NavLink to="/org/manageapplication" end className={navClass} onClick={() => setMenuOpen(false)}>Manage Application</NavLink>
            <NavLink to="/org/selecttemplate" end className={navClass} onClick={() => setMenuOpen(false)}>Template</NavLink>
            <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
          </div>
        </div>
      )}
    </div>

  );
}
