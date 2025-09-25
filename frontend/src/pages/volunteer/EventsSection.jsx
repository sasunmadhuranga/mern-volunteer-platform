import { useEffect, useState } from "react";
import axios from "axios";

export default function EventsSection() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [error, setError] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventName, setEventName] = useState("");
  const [city, setCity] = useState("");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    // Optional: fetch user info
    axios
      .get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch(() => setError("Failed to fetch user details."));
  }, [API_BASE_URL]);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return setError("No token found");

      const params = {};

      // Add filters if they exist
      if (eventType) params.eventType = eventType;
      if (eventName) params.eventName = eventName;
      if (city) params.city = city;

      const res = await axios.get(`${API_BASE_URL}/api/events/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setEvents(res.data);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch events.");
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex flex-col items-center bg-neutral-100 px-4 py-12 md:px-20 lg:px-40">
      <div className="w-full md:flex md:justify-center">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 w-full">
          {/* Event Type */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-2 w-full md:w-auto">
            <label className="text-gray-700 mb-1">Event Type</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="border border-gray-400 rounded-md px-4 py-2 w-full"
            >
              <option value="">Choose type</option>
              <option value="Community">Community Volunteering</option>
              <option value="Environmental">Environmental Volunteering</option>
              <option value="Educational">Educational Volunteering</option>
              <option value="Healthcare">Healthcare Volunteering</option>
              <option value="Animal">Animal Volunteering</option>
              <option value="Disaster Relief">Disaster Relief Volunteering</option>
              <option value="Virtual">Virtual Volunteering</option>
            </select>
          </div>

          {/* Name */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-2 w-full md:w-auto">
            <label className="text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="border border-gray-400 rounded-md px-4 py-2 w-full"
            />
          </div>

          {/* City */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-2 w-full md:w-auto">
            <label className="text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border border-gray-400 rounded-md px-4 py-2 w-full"
            />
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

      {/* Display Results (Optional) */}
      <div className="mt-8 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.length > 0 ? (
            events.map((event) => (
              <div key={event._id} className="bg-white p-4 rounded-lg shadow space-y-3">
                <h1 className="text-lg font-semibold text-gray-800">{event.eventName}</h1>
                <h6 className="text-sm font-medium">{event.location}</h6>
                <p className="text-sm text-gray-800">{event.city}</p>
                <p className="text-sm text-gray-800">
                  {new Date(event.startDate).toLocaleDateString("en-GB", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })} → {new Date(event.endDate).toLocaleDateString("en-GB", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p>{event.institute}</p>
              </div>
            ))
        ) : (
          <p className="text-gray-600">No events found.</p>
        )}
      </div>
    </div>
  );
}
