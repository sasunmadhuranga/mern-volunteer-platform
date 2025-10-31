import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function AdminDashboardStats() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token");

        // Fetch all events (for admin)
        const eventsRes = await axios.get(`${API_BASE_URL}/api/events/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const events = eventsRes.data || [];
        const today = new Date();

        const activeEvents = events.filter(
          (event) => new Date(event.endDate) >= today
        ).length;

        // Fetch applications for all events
        let totalApplications = 0;
        for (const event of events) {
          const appsRes = await axios.get(
            `${API_BASE_URL}/api/event-applications/event/${event._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          totalApplications += appsRes.data.applications.length;
        }

        setStats({
          totalEvents: events.length,
          activeEvents,
          totalApplications,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    }

    fetchStats();
  }, []);

  const cardClass =
    "w-full md:w-72 md:h-28 p-4 rounded-lg shadow-lg flex flex-col justify-center items-center text-white";

  return (
    <div className="flex flex-col md:flex-row md:justify-center md:space-x-6 space-y-4 md:space-y-0 p-6">
      {/* Total Events */}
      <div className={`${cardClass} bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500`}>
        <h2 className="text-xl font-bold">Total Events</h2>
        <p className="text-3xl font-extrabold">{stats.totalEvents}</p>
      </div>

      {/* Active Events */}
      <div className={`${cardClass} bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500`}>
        <h2 className="text-xl font-bold">Active Events</h2>
        <p className="text-3xl font-extrabold">{stats.activeEvents}</p>
      </div>

      {/* Total Applications */}
      <div className={`${cardClass} bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500`}>
        <h2 className="text-xl font-bold">Applications</h2>
        <p className="text-3xl font-extrabold">{stats.totalApplications}</p>
      </div>
    </div>
  );
}
