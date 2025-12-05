import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function OrgContent() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalApplications: 0,
  });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token");

        // Fetch all events created by this org admin
        const eventsRes = await axios.get(`${API_BASE_URL}/api/events/org`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const eventsData = eventsRes.data.data || [];
        setEvents(eventsData);

        const today = new Date();
        const activeEvents = eventsData.filter(
          (event) => new Date(event.endDate) >= today
        ).length;

        // Fetch total applications
        let totalApplications = 0;
        for (const event of eventsData) {
          const appsRes = await axios.get(
            `${API_BASE_URL}/api/event-applications/event/${event._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          totalApplications += appsRes.data.applications.length;
        }

        setStats({
          totalEvents: eventsData.length,
          activeEvents,
          totalApplications,
        });
      } catch (err) {
        console.error("Failed to fetch org stats:", err);
      }
    }

    fetchStats();
  }, []);

  const cardClass =
    "w-full md:w-72 md:h-28 p-4 rounded-lg shadow-lg flex flex-col justify-center items-center text-white";

  return (
    <div className="p-6 space-y-8">
      {/* Stats Cards */}
      <div className="flex flex-col md:flex-row md:justify-center md:space-x-6 space-y-4 md:space-y-0">
        <div
          className={`${cardClass} bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500`}
        >
          <h2 className="text-xl font-bold">Total Events</h2>
          <p className="text-3xl font-extrabold">{stats.totalEvents}</p>
        </div>
        <div
          className={`${cardClass} bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500`}
        >
          <h2 className="text-xl font-bold">Active Events</h2>
          <p className="text-3xl font-extrabold">{stats.activeEvents}</p>
        </div>
        <div
          className={`${cardClass} bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500`}
        >
          <h2 className="text-xl font-bold">Applications</h2>
          <p className="text-3xl font-extrabold">{stats.totalApplications}</p>
        </div>
      </div>

      {/* QR Codes */}
      <h2 className="text-2xl font-bold text-sky-800 mb-4 text-center">Attendance QR Codes</h2>
      {events.length === 0 ? (
        <p className="text-gray-500">No events available.</p>
      ) : (
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {events.map((event) => (
            <QRCodeCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

// Separate QR Code Card Component
function QRCodeCard({ event }) {
  const [qr, setQr] = useState("");

  useEffect(() => {
    const fetchQR = async () => {
      const token = localStorage.getItem("token");
      try {
        const today = new Date().toISOString().split("T")[0];

        const res = await axios.get(
          `${API_BASE_URL}/api/events/${event._id}/qr?date=${today}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setQr(res.data.qrCodeDataURL);
      } catch (err) {
        console.error(`Failed to fetch QR for event ${event.eventName}:`, err);
      }
    };

    fetchQR();
  }, [event._id, event.eventName]);

  return (
    <div className="flex-shrink-0 bg-white rounded-lg shadow-md p-4 w-64 text-center">
      <h3 className="font-semibold mb-2">{event.eventName}</h3>
      <p className="text-sm text-sky-600 mb-2">
        Today's QR ({new Date().toISOString().split("T")[0]})
      </p>

      {qr ? (
        <img src={qr} alt={`QR code for ${event.eventName}`} className="w-56 h-56 mx-auto" />
      ) : (
        <p className="text-gray-400">Loading QR...</p>
      )}
    </div>
  );
}
