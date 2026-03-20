import { useEffect, useState } from "react";
import axios from "axios";
import OrgProfileDisplay from "./OrgProfileDisplay";
import EventList from "../components/EventList";

export default function EventsSection() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [error, setError] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventName, setEventName] = useState("");
  const [city, setCity] = useState("");
  const [events, setEvents] = useState([]);
  const [showOrgProfile, setShowOrgProfile] = useState(false);
  const [orgProfile, setOrgProfile] = useState(null);
  const [orgLoading, setOrgLoading] = useState(false);
  const [orgError, setOrgError] = useState("");
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          setLoadingEvents(false);
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/api/events/search`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to load events.");
      }finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [API_BASE_URL]);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return setError("No token found");

      const params = {};
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

  const handleClick = async (orgId) => {
    setShowOrgProfile(true);
    setOrgLoading(true);
    setOrgError("");

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/organizations/${orgId}/public`
      );

      setOrgProfile(res.data);
    } catch (err) {
      console.error("Error fetching org profile:", err);
      setOrgError("Failed to load organization profile.");
      setOrgProfile(null);
    } finally {
      setOrgLoading(false);
    }
  };


  if (error) return <p className="text-red-600">{error}</p>;

  const todayKey = new Date().toISOString().split("T")[0];
  const upcomingEvents = events.filter((event) => event.endDate.split("T")[0] >= todayKey);

  return (
    <div className="flex flex-col items-center bg-neutral-100 px-4 py-12 md:px-20 lg:px-40">
      
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 md:w-auto w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 w-full">
          
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

          <div className="flex flex-col md:flex-row md:items-center md:space-x-2 w-full md:w-auto">
            <label className="text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="border border-gray-400 rounded-md px-4 py-2 w-full"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:space-x-2 w-full md:w-auto">
            <label className="text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border border-gray-400 rounded-md px-4 py-2 w-full"
            />
          </div>

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

      {loadingEvents ? (
        <div className="flex justify-center items-center mt-6 gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
          <span className="ml-2 text-gray-700">Loading events...</span>
        </div>
      ) : events.length === 0 ? (
        <p className="text-gray-700 mt-6 text-center">No events found.</p>
      ) : (
        <EventList
          events={upcomingEvents}
          handleOrgClick={handleClick}
          filters={{ eventType, eventName, city }}
        />
      )}


      {showOrgProfile && (
        <OrgProfileDisplay
          onClose={() => setShowOrgProfile(false)}
          loading={orgLoading}
          error={orgError}
          profile={orgProfile}
        />
      )}
    </div>
  );
}
