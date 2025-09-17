import { FiUser } from 'react-icons/fi';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function ProfileImage(){
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

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

    if (error) return <p className="font-medium text-red-600">{error}</p>

    if (!user && !error) return (
        <div className="flex justify-center items-center py-6">
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        );

     const profilePicUrl = user.profilePic?.startsWith('http')
        ? user.profilePic
        : `http://localhost:5000${user.profilePic}`;


    return(
        <>
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
        </>
    );
}