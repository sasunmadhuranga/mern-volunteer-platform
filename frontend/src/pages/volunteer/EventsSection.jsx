import { useEffect, useState } from "react";
import axios from "axios";
import OrgProfileDisplay from "./OrgProfileDisplay";
import { useNavigate, useLocation } from "react-router-dom";
export default function EventsSection() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventName, setEventName] = useState("");
  const [city, setCity] = useState("");
  const [events, setEvents] = useState([]);
  const [showOrgProfile, setShowOrgProfile] = useState(false);
  const [orgProfile, setOrgProfile] = useState(null);
  const [orgLoading, setOrgLoading] = useState(false);
  const [orgError, setOrgError] = useState("");
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }
    
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    // If navigating back with search state
    if (location.state?.filters && location.state?.results) {
      const { filters, results } = location.state;
      setEventType(filters.eventType || "");
      setEventName(filters.eventName || "");
      setCity(filters.city || "");
      setEvents(results);
      return; // skip fetching again
    }

    // Optionally fetch something else on first mount
  }, [API_BASE_URL, location.state]);


  const handleClick = async (orgId) => {
    setShowOrgProfile(true);
    setOrgLoading(true);
    setOrgError("");

    try{
      const token = localStorage.getItem("token");
      if(!token){
        throw new Error("No token found");
      }
      const res = await axios.get(`${API_BASE_URL}/api/users/${orgId}`, {
        headers: {Authorization: `Bearer ${token}`},
      })
      setOrgProfile(res.data.user);
    }
    catch(err){
      console.error("Error fetching org profile:", err);
      setOrgError("Failed to load organization profile.");
      setOrgProfile(null);
    }finally{
      setOrgLoading(false);
    }
  }
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex flex-col items-center bg-neutral-100 px-4 py-12 md:px-20 lg:px-40">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 md:w-auto w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 w-full">
          {/* Event Type */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-2 w-full md:w-auto">
            <label className="text-gray-700 mb-1 md:mb-0 md:mr-2 whitespace-nowrap">Event Type</label>
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
      <div className="mt-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event._id}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300 space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <h2 className="text-lg md:text-xl font-semibold text-sky-700 leading-snug">
                  {event.eventName}
                </h2>
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {new Date(event.startDate).toLocaleDateString("en-GB", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  →{" "}
                  {new Date(event.endDate).toLocaleDateString("en-GB", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Location Details */}
              <div className="text-sm space-y-1 text-gray-700">
                <p><span className="font-semibold">City:</span> {event.city}</p>
                <p><span className="font-semibold">Location:</span> {event.location}</p>
                <p><span className="font-semibold">Organized by:</span> 
                <button
                  className="text-blue-700 hover:underline ml-1"
                  onClick={() => handleClick(event.organizerId)}
                >{event.institute}</button></p>
              </div>

              {/* Action Button */}
              <div>
                <button
                onClick={() => navigate(`/volunteer/eventregistration/${event._id}`, 
                  {state: 
                    {event,
                      fromSearch:{
                        filters: {eventType, eventName, city},
                        results: events,
                      },
                  },
                })
              }
                className="w-full bg-sky-600 text-white font-medium rounded-md py-2 px-4 hover:bg-sky-700 transition text-center">
                  Read more & apply →
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full text-center text-lg">No events found.</p>
        )}
      </div>
        {showOrgProfile && 
          <div>
            <OrgProfileDisplay 
            onClose= {() => setShowOrgProfile(false)}
            loading = {orgLoading}
            error = {orgError}
            profile = {orgProfile}
            />
          </div>
        }
    </div>
  );
}
