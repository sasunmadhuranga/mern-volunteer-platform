import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmationModel from "../components/ConfirmationModel";

export default function AdminEventVerification() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authorized. Please login again.");
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/events/all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setEvents(sorted)
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load events.");
        setLoading(false);
      });
  }, [API_BASE_URL]);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${API_BASE_URL}/api/events/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents(events.map(e => e._id === id ? { ...e, status } : e));
      setShowModel(false);
    } catch {
      setError("Failed to update event status.");
    }
  };
  const handleActionClick = (id, status) => {
    setSelectedEventId(id);
    setSelectedStatus(status);
    setShowModel(true);
  }
  const handleConfirm = () => {
    if(selectedEventId && selectedStatus){
        updateStatus(selectedEventId, selectedStatus);
    }
  }
  const handleCancel = () => {
    setShowModel(false);
    setSelectedEventId(null);
    setSelectedStatus("");
  }
  if (loading) return <p className="text-center text-gray-500">Loading events...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;
  
  const filterEvents = events.filter(event => {
    if(filterStatus === "all") return true;
    return event.status === filterStatus;
  });
return (
    <div className="md:px-20 lg:px-40 py-8">
        <h2 className="text-3xl font-bold text-center text-sky-800 mb-8">Event Verification</h2>
        <div className="flex justify-end mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
            </select>
        </div>
        {filterEvents.length === 0 ? (
            <p className="text-center text-gray-500">No events found.</p>
        ) : (
            <div className="space-y-6">
                {filterEvents.map(event => (
                    <div 
                        key={event._id}
                        className="bg-white rounded-xl shadow-lg p-10 transition hover:shadow-xl"
                    >
                        <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">{event.eventName}</h3>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                            <p><span className="font-medium">Event Type:</span> {event.eventType}</p>
                            <p><span className="font-medium">Organized by:</span> {event.institute}</p>
                            <p><span className="font-medium">Location:</span> {event.location}</p>
                            <p><span className="font-medium">City:</span> {event.city}</p>
                            <p><span className="font-medium">Duration:</span> {new Date(event.startDate).toLocaleDateString()} → {new Date(event.endDate).toLocaleDateString()}</p>
                            <p><span className="font-medium">Opportunities:</span> {event.opportunity}</p>
                            <p><span className="font-medium">Age Limit:</span> {event.minAge} - {event.maxAge}</p>
                            <p><span className="font-medium">Status:</span> 
                                <span className={`ml-2 px-2 py-1 rounded-xl text-xs font-semibold
                                    ${event.status === 'approved' ? 'bg-green-100 text-green-700' :
                                      event.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                      'bg-yellow-100 text-yellow-700'}`}>
                                    {event.status}
                                </span>
                            </p>
                            {event.createdBy?.role === "ORG_ADMIN" && (
                                <>
                                    <p><span className="font-medium">Contact Email:</span> {event.createdBy.contactEmail || "N/A"}</p>
                                    <p><span className="font-medium">Contact Phone:</span> {event.createdBy.phone || "N/A"}</p>
                                </>
                            )}
                        </div>

                        <div className="mt-4">
                            <p className="font-medium text-gray-800 mb-1">Description:</p>
                            <p className="text-sm text-gray-600">{event.description}</p>
                        </div>

                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                onClick={() => handleActionClick(event._id, "approved")}
                                className="flex items-center gap-2 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
                            >
                                ✅ Approve
                            </button>
                            <button 
                                onClick={() => handleActionClick(event._id, "rejected")}
                                className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                ❌ Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
        {showModel && 
            <ConfirmationModel
            message={`Are you sure you want to ${selectedStatus} this event?`}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            />
        }
    </div>
);
}