import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import UserProfileDisplay from '../orgadmin/UserProfileDisplay';

function OrgManageApplications() {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState("");
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [userError, setUserError] = useState("");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        try{
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE_URL}/api/events/org`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            setEvents(res.data.data || [])
        }
        catch (err){
            console.log("Failed to fetch events:", err);
        }
    }

    const handleSearch = async () => {
        if(!selectedEventId) return toast.warning("Please select an event");
        setLoading(true);

        try{
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE_URL}/api/event-applications/event/${selectedEventId}`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            setApplications(res.data.applications || []);
        }
        catch (err){
            console.log("Error fetching applications:", err);
            toast.error("Failed to load applications");
        }finally{
            setLoading(false);
        }

    };

    const handleStatusChange = async (appId, newStatus) => {
        try {
        const token = localStorage.getItem("token");
        const res = await axios.patch(
            `${API_BASE_URL}/api/event-applications/${appId}/status`,
            { status: newStatus },
            {
            headers: { Authorization: `Bearer ${token}` },
            }
        );
        toast.success(`Application ${newStatus}`);
        // Refresh list
        handleSearch();
        } catch (err) {
        console.error("Failed to update status:", err);
        toast.error("Failed to update application status");
        }
    };
    const handleClick = async (userId) => {
        setShowUserDetails(true);
        setUserLoading(true);
        setUserError("");

        try{
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE_URL}/api/users/${userId}`, {
                headers: {Authorization: `Bearer ${token}`},
            })
            setUserDetails(res.data.user);
        }
        catch(err){
            console.log("Error fetching user details.", err);
            setUserError("Failed to load user details.");
            setUserDetails(null);
        }
        finally{
            setUserLoading(false);
        }
    }

    return (
            <div className="bg-sky-100 px-4 py-12 md:px-20 lg:px-40 min-h-screen">
                {/* Search Section */}
                <div className="flex flex-col items-center space-y-4 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 w-full max-w-2xl">
                    {/* Dropdown */}
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-2 w-full">
                    <label className="text-gray-700 mb-1 md:mb-0 md:mr-2 whitespace-nowrap">
                        Event Name
                    </label>
                    <select
                        className="border border-gray-400 rounded-md px-4 py-2 w-full"
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                    >
                        <option value="">Select Event</option>
                        {events.map((event) => (
                        <option key={event._id} value={event._id}>
                            {event.eventName}
                        </option>
                        ))}
                    </select>
                    </div>

                    {/* Search Button */}
                    <div className="w-full md:w-auto">
                    <button
                        onClick={handleSearch}
                        className="w-full bg-sky-600 text-white rounded-md px-6 py-2 hover:bg-sky-700 transition"
                    >
                        Search
                    </button>
                    </div>
                </div>
                </div>

                {/* Applications Section */}
                <div className="flex justify-center">
                <div className="w-full max-w-3xl">
                    {loading ? (
                    <p className="text-center text-gray-600">Loading applications...</p>
                    ) : applications.length === 0 ? (
                    <p className="text-center text-gray-600">No applicants found</p>
                    ) : (
                    <div className="bg-white p-6 rounded-lg shadow space-y-4">
                        {applications.map((app, index) => (
                        <div
                            key={app._id}
                            className="flex justify-between items-center border-b pb-2"
                        >
                            <div>
                                <div className="flex justify-between items-center">
                                    <p>{index + 1}.</p>
                                    <button 
                                    onClick={() => handleClick(app.userId._id)} 
                                    className="text-lg font-medium text-gray-700 hover:underline ml-1">
                                        {app.userId.name}
                                    </button>

                                </div>
                            
                            <p className="text-sm text-gray-600 ml-4">Status: {app.status}</p>
                            </div>
                            <div className="space-y-2 space-x-2">
                            {app.status === "pending" ? (
                                <>
                                <button
                                    onClick={() => handleStatusChange(app._id, "approved")}
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleStatusChange(app._id, "rejected")}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Reject
                                </button>
                                </>
                            ) : (
                                <span className="text-gray-500 text-sm capitalize">
                                {app.status}
                                </span>
                            )}
                            </div>
                        </div>
                        ))}
                    </div>
                    )}
                </div>
                </div>
                {showUserDetails && (
                    <div>
                        <UserProfileDisplay
                         onClose={() => setShowUserDetails(false)}
                         loading={userLoading}
                         error={userError}
                         profile={userDetails}
                        />
                    </div>
                )}
            </div>
            );

}

export default OrgManageApplications;
