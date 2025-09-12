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
  
    return(
        <div className="flext md:px-20 lg:px-40">
            <h2 className="text-2xl text-center font-semibold mb-4 text-sky-800">Event Verification</h2>
            {events.length === 0 ? (
                <p>No events found.</p>
            ):
            (
                <div className="space-y-4">
                    {events.map(event => (
                        <div 
                            key={event._id}
                            className="bg-white rounded-xl shadow-md px-10 py-6 space-y-3"
                        >
                            <div>
                                <h3 className="text-lg font-bold text-center">{event.eventName}</h3>
                            </div>
                            <div>
                                <h3><strong>Organized by:</strong> {event.institute}</h3>
                            </div>
                            <div>
                                <h3><strong>Event Location:</strong> {event.location}</h3>
                            </div>
                            <div>
                                <h3><strong>Event Duration:</strong> {new Date(event.startDate).toLocaleDateString()} → {new Date(event.endDate).toLocaleDateString()}</h3>
                            </div>
                            <div>
                                <h3><strong>Available Oppotunities:</strong> {event.opportunity}</h3>
                            </div>
                            <div>
                                <h3><strong>Age Limit:</strong> {event.minAge} - {event.maxAge}</h3>
                            </div>
                            <div>
                                <h3><strong>Description:</strong> {event.description}</h3>
                            </div>
                            {event.createdBy?.role === "ORG_ADMIN" && (
  <div>
    <h3><strong>Contact Email:</strong> {event.createdBy.contactEmail || "N/A"}</h3>
    <h3><strong>Contact Phone:</strong> {event.createdBy.phone || "N/A"}</h3>
  </div>
)}

                            <div className="flex justify-between items-center">
                                <h3><strong>Status:</strong> {event.status}</h3>
                                <div className="space-x-4">
                                    <button
                                    onClick={() => updateStatus(event._id, "approved")}
                                    className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                                    >Approve</button>
                                    <button 
                                    onClick={() => updateStatus(event._id, "rejected")}
                                    className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
                                    >
                                    Reject</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }
        </div>
    );
}