import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminEventVerification() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authorized. Please login again.");
      return;
    }

    axios
      .get("http://localhost:5000/api/events/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEvents(res.data))
      .catch(() => setError("Failed to load events."));
  }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/events/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents(events.map(e => e._id === id ? { ...e, status } : e));
    } catch {
      setError("Failed to update event status.");
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  
return (
    <div className="md:px-20 lg:px-40 py-8">
        <h2 className="text-3xl font-bold text-center text-sky-800 mb-8">Event Verification</h2>

        {events.length === 0 ? (
            <p className="text-center text-gray-500">No events found.</p>
        ) : (
            <div className="space-y-6">
                {events.map(event => (
                    <div 
                        key={event._id}
                        className="bg-white rounded-xl shadow-lg p-10 transition hover:shadow-xl"
                    >
                        <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">{event.eventName}</h3>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                            <p><span className="font-medium">Organized by:</span> {event.institute}</p>
                            <p><span className="font-medium">Location:</span> {event.location}</p>
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
                                onClick={() => updateStatus(event._id, "approved")}
                                className="flex items-center gap-2 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
                            >
                                ✅ Approve
                            </button>
                            <button 
                                onClick={() => updateStatus(event._id, "rejected")}
                                className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                ❌ Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);
}