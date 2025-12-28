import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBars, FaTimes } from "react-icons/fa";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function AdminNavbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.user?.role !== "ADMIN") {
          navigate("/unauthorized");
          return;
        }
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.clear();
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center py-6">
        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-50 bg-blue-700 shadow-md px-4 md:px-12 py-4 flex justify-between items-center">
      <img
        src="/images/profilePic.jpg"
        alt="Profile"
        className="w-14 h-14 rounded-full object-cover border"
      />

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 text-gray-100 font-medium">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/eventverification">Events</Link>
        <Link to="/admin/templates">Templates</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-2xl text-gray-100"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-blue-700 md:hidden">
          <div className="flex flex-col items-center gap-4 py-4 text-gray-100">
            <Link to="/admin" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/admin/eventverification" onClick={() => setMenuOpen(false)}>Events</Link>
            <Link to="/admin/templates" onClick={() => setMenuOpen(false)}>Templates</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
}
