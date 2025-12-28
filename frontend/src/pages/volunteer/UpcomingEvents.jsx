import { useEffect, useState } from "react";
import axios from "axios";
import EventList from "../../components/EventList"; // reuse your EventList component

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/api/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allEvents = res.data.data || [];

        // Filter only future or ongoing events
        const todayKey = new Date().toISOString().split("T")[0];
        const upcomingEvents = allEvents
          .filter((event) => event.endDate.split("T")[0] >= todayKey)
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        setEvents(upcomingEvents);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading events...</p>;
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;

  return (
    <div className="flex flex-col items-center bg-neutral-100 px-4 py-12 md:px-20 lg:px-40">
      <h1 className="text-2xl md:text-3xl font-bold text-sky-700 mb-8">
        Upcoming & Ongoing Events
      </h1>

      {events.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">
          No upcoming or ongoing events available.
        </p>
      ) : (
        <EventList
          events={events} // show all future/ongoing events
          handleOrgClick={() => {}}
        />
      )}
    </div>
  );
}
