import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmationModel from "../components/ConfirmationModel";
import { toast } from "react-toastify";

export default function EventHistory() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMenuId, setShowMenuId] = useState(null);
  const [showConfirmModel, setShowConfirmModel] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedApp, setSelectedApp] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found.");
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/api/event-applications/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setApplications(res.data.applications || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load your applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [API_BASE_URL]);

  const handleMenuToggle = (id) => {
    setShowMenuId(prev => (prev === id ? null : id));
  }

  const handleActionClick = (app, action) => {
    setSelectedApp(app);
    setConfirmAction(action);
    setShowConfirmModel(true);
    setShowMenuId(null);
  }

  const handleConfirm = async () => {
    if(!selectedApp) return;
    try{
      const token = localStorage.getItem("token");
      const headers = {Authorization: `Bearer ${token}`};

      if(confirmAction === "cancel"){
        await axios.patch(`${API_BASE_URL}/api/event-applications/${selectedApp._id}/status`, {
          status: "cancelled"
        }, {headers});

        setApplications(prev =>
          prev.map(app =>
            app._id === selectedApp._id ? { ...app, status: "cancelled" } : app
          )
        );
        toast.success("Application cancelled successfully");
      }
      else if(confirmAction === "delete"){
        await axios.delete(`${API_BASE_URL}/api/event-applications/${selectedApp._id}`, {
          headers
        });
        setApplications(prev => prev.filter(app => app._id !== selectedApp._id));
        toast.success("Application deleted successfully.");
      }
    }
    catch(err){
      console.log("Action failed", err);
      toast.error("Something went wrong. Please try again.");
    }finally{
      setShowConfirmModel(false);
      setSelectedApp(null);
      setConfirmAction(null);
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".menu-button") && !e.target.closest(".menu-options")) {
        setShowMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="flex justify-center items-center bg-neutral-100 px-4 py-12 md:px-20 lg:px-40">
        <div className="w-full max-w-6xl p-3 relative">
            <h1 className="text-2xl font-semibold mb-6 text-gray-700 text-center">Applied Events</h1>
                {applications.length === 0 ? (
                    <p className="text-center text-gray-600">You haven't applied to any events yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {applications.map((app) => {
                        const event = app.eventId;

                        return (
                        <div
                            key={app._id}
                            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-3 relative"
                        >   
                          <div className="absolute top-3 right-3">
                            <button onClick={() => handleMenuToggle(app._id)}
                            className="menu-button text-gray-500 hover:text-gray-800"
                            >⋮</button>
                            {showMenuId === app._id && (
                              <div className="menu-options absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow-md z-10">
                                <button
                                disabled = {app.status === "cancelled"}
                                className={`block w-full text-left px-4 py-2 text-sm
                                  ${app.status === "cancelled" 
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-gray-600 hover:text-gray-900"
                                  }
                                  `}
                                onClick={() => app.status !== "cancelled" && handleActionClick(app, "cancel")}
                                >
                                  Cancel</button>
                                <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                                onClick={() => handleActionClick(app, "delete")}
                                >
                                  Delete</button>
                              </div>
                            )}
                          </div>
                            <small>Applied on: {new Date(app.appliedAt).toLocaleString()}</small>
                            <h2 className="text-xl font-semibold text-sky-700">{event.eventName}</h2>
                            <p className="text-sm text-gray-600">
                            <strong>Duration:</strong>{" "}
                            {new Date(event.startDate).toLocaleDateString()} →{" "}
                            {new Date(event.endDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-700"><strong>Location:</strong> {event.location}, {event.city}</p>
                            <p className="text-sm text-gray-700"><strong>Institute:</strong> {event.institute}</p>
                            <p className="text-sm text-gray-700"><strong>Description:</strong> {event.description}</p>
                            <p className="text-sm"><strong>Status:</strong> <span className={`font-medium ${getStatusColor(app.status)}`}>{app.status}</span></p>
                        </div>
                        );
                    })}
                    </div>
                )}
      </div>
      {showConfirmModel && (
      <ConfirmationModel
        message={`Are you sure you want to ${confirmAction} this application?`}
        onConfirm={handleConfirm}
        onCancel={() => {
          setShowConfirmModel(false);
          setSelectedApp(null);
          setConfirmAction(null);
        }}
      />
    )}
      
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case "approved":
      return "text-green-600";
    case "pending":
      return "text-yellow-600";
    case "rejected":
      return "text-red-600";
    case "cancelled":
      return "text-gray-600";
    default:
      return "";
  }
}
