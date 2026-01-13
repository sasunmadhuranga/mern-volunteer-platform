import { useEffect, useState } from "react";
import axios from 'axios';
import EventForm from "../components/EventForm";
import { toast } from "react-toastify";
import ConfirmationModel from "../components/ConfirmationModel";

export default function OrgManageEvents(){
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMenuId, setShowMenuId] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // 🔧 Track editing event
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingEventId, setdeletingEventId] = useState(null);

  useEffect(() => {
    fetchOrgEvents();
  }, [API_BASE_URL]);

  const fetchOrgEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found!");
        return;
      }
      const res = await axios.get(`${API_BASE_URL}/api/events/org`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedEvents = res.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setEvents(sortedEvents);
    } catch (err) {
      console.error("Failed to fetch org events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuToggle = (id) => {
    setShowMenuId(prev => (prev === id ? null : id));
  };

  const handleActionClick = async (event, action) => {
    if (action === "edit") {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/events/${event._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEditingEvent(res.data.data); // Use full event data
        setShowMenuId(null);
      } catch (err) {
        console.error("Failed to fetch full event data:", err);
        toast.error("Failed to load event details.");
      }
    } else if (action === "delete") {
      setdeletingEventId(event._id);
      setShowConfirm(true);
      setShowMenuId(null);
    }
  };


  const handleUpdateEvent = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Not authorized.");
        return;
      }

      const res = await axios.put(`${API_BASE_URL}/api/events/${editingEvent._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        toast.success("Event updated successfully");
        // Refresh event list
        fetchOrgEvents();
        setEditingEvent(null);
      }
    } catch (err) {
      console.error("Failed to update event:", err);
      toast.error("Failed to update event");
    }
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    fetchOrgEvents();
  };

  const onConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Not authorized.");
        return;
      }

      const res = await axios.delete(`${API_BASE_URL}/api/events/${deletingEventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        toast.success("Event deleted successfully");
        fetchOrgEvents(); // Refresh the event list
      }
    } catch (err) {
      console.error("Failed to delete event:", err);
      toast.error("Failed to delete event");
    } finally {
      setShowConfirm(false);
      setdeletingEventId(null);
    }
  };


  const onCancelDelete = () => {
    setShowConfirm(false);
    setdeletingEventId(null);
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

  if (loading) return (<div className="text-center">Loading events...</div>);

return (
  <div className="flex justify-center items-center bg-sky-100 px-4 py-12 md:px-20 lg:px-40">
    <div className="w-full max-w-5xl relative">
      <h1 className="text-2xl font-semibold mb-6 text-gray-700 text-center">{editingEvent ? "Edit Event" : "Events Published"}</h1>

      {/* ✅ Show Edit Form if editing */}
      {editingEvent ? (
        <div className="w-full bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex justify-between items-center mb-6">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-sky-600 hover:text-sky-700 hover:underline flex items-center"
            >
              ← Back
            </button>
          </div>

          <EventForm
            initialValues={editingEvent}
            onSubmit={handleUpdateEvent}
            onCancel={handleCancelEdit}
            isEditMode={true}
          />
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
      ) : (
        // ✅ Show Events Grid if not editing
        <>
          {events.length === 0 ? (
            <p className="text-gray-600 text-center">You haven't published any events yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map(event => (
                <div
                  key={event._id}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-3 relative"
                >
                  <div className="absolute top-3 right-3">
                    <button
                      disabled={!!editingEvent}
                      onClick={() => handleMenuToggle(event._id)}
                      className="menu-button text-gray-600 hover:text-gray-800"
                    >
                      ⋮
                    </button>
                    {showMenuId === event._id && (
                      <div className="menu-options absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow-md z-10">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                          onClick={() => handleActionClick(event, "edit")}
                        >
                          Edit
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                          onClick={() => handleActionClick(event, "delete")}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <h2 className="text-xl font-semibold text-sky-700">{event.eventName}</h2>
                  <h2><strong>Event Type:</strong> {event.eventType}</h2>
                  <p className="text-sm font-gray-700">
                    <strong>Location:</strong> {event.location}, {event.city}
                  </p>
                  <p className="text-sm font-gray-700">
                    <strong>Duration:</strong>{" "}
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-gray-700">
                    <strong>Status:</strong> {event.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
    {showConfirm && 
      (<ConfirmationModel
        message="Are you sure you want to delete this event?"
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />)
    }
  </div>
);

}
