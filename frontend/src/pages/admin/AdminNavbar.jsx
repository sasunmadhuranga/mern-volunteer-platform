import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBars, FaTimes } from "react-icons/fa";

export default function AdminNavbar(){
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(prev => !prev);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token){
            setError("No token found. Please log in.");
            navigate('/login');
            return;
        }
        axios
            .get("http://localhost:5000/api/users/me", {
                headers: {Authorization: `Bearer ${token}`},
            })
            .then((res) => {
                if(res.data.user){
                    setUser(res.data.user);
                }
                else{
                    setError("Session expired. Please log in again.");
                    localStorage.clear();
                    navigate("/login");
                }
            })
            .catch((err) => {
                console.log("Error fetching user:", err);
                setError("Server error. Please try again later.");
            });
    },[navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    }
    if (error) return <p className="font-medium text-red-600">{error}</p>
    if (!user && !error) return (
        <div className="flex justify-center items-center py-6">
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        );

    return(
        <div className="sticky top-0 z-50 bg-blue-700 shadow-md px-4 md:px-12 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <img src="/images/profilePic.jpg" alt="Profile" className="w-14 h-14 rounded-full object-cover border flex-shrink-0"/>
            </div>
            <div className="hidden md:flex space-x-6 text-gray-100 font-medium">
                <Link to="/admin" className="hover:text-gray-300">Dashboard</Link>
                <Link to="/admin/eventverification" className="hover:text-gray-300">Events</Link>
                <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
            </div>
            <button 
                className="md:hidden text-2xl text-gray-100 hover:text-gray-300"
                onClick={toggleMenu}
                aria-label="Toggle Menu"
                > {menuOpen ? <FaTimes/> : <FaBars/>}
            </button>
            {menuOpen && (
                <div className="absolute top-full left-0 w-full bg-blue-700 shadow-md md:hidden animate-slide-down z-40">
                <div className="flex flex-col items-center gap-4 py-4 text-gray-100 font-medium">
                    <Link to="/admin" className="hover:text-gray-300" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                    <Link to="/admin/eventverification" className="hover:text-gray-300" onClick={() => setMenuOpen(false)}>Events</Link>
                    <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
                </div>
            </div>
            )}
        </div>
    );
}