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
  const [loading, setLoading] = useState(true);
  
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
          (evt) => new Date(evt.endDate) >= today
        ).length;

        // Fetch total applications
        let totalApplications = 0;
        for (const evt of eventsData) {
          const appsRes = await axios.get(
            `${API_BASE_URL}/api/event-applications/event/${evt._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          totalApplications += appsRes.data.applications.length;
        }

        setStats({
          totalEvents: eventsData.length,
          activeEvents,
          totalApplications,
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch org stats:", err);
        setLoading(false);
      }
    }

    fetchStats();
  }, []); // run once on mount

  const cardClass =
    "w-full md:w-72 md:h-28 p-4 rounded-lg shadow-lg flex flex-col justify-center items-center text-white";

  const todayKey = getLocalDateKey();
  
  const qrEligibleEvents = events.filter((event) => {
    const endDate = event.endDate.split("T")[0];
    return endDate >= todayKey; // future or ongoing only
  });

  if (loading) return (<div className="text-center">Loading events...</div>);

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
      <h2 className="text-2xl font-bold text-sky-800 mb-4 text-center">
        Attendance QR Codes
      </h2>

      {qrEligibleEvents.length === 0 ? (
        <p className="text-gray-500 text-center">No events available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrEligibleEvents.map((event) => (
            <QRCodeCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

// --- UTIL: ensure YYYY-MM-DD local date ---
function getLocalDateKey(dateObj = new Date()) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}


function QRCodeCard({ event }) {

  // Convert event date to normalized keys
  const start = event.startDate.split("T")[0];
  const end = event.endDate.split("T")[0];
  const today = getLocalDateKey(); // FIX: timezone-safe

  const isTodayInsideEvent = today >= start && today <= end;

  const [qrCheckIn, setQrCheckIn] = useState("");
  const [qrCheckOut, setQrCheckOut] = useState("");

  useEffect(() => {
    if (!isTodayInsideEvent) return;

    async function fetchQR(type) {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/api/event-qr/${event._id}/qr/${today}/${type}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data.qrImage;
      } catch (err) {
        console.error(`Failed to fetch ${type} QR:`, err.response?.data || err.message);
        return null;
      }
    }

    fetchQR("check-in").then(setQrCheckIn);
    fetchQR("check-out").then(setQrCheckOut);
  }, [event._id, isTodayInsideEvent, today]);

  return (
  <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-sm mx-auto text-center">
    <h3 className="font-semibold mb-2">{event.eventName}</h3>

    {!isTodayInsideEvent ? (
      <p className="text-gray-400">
        QR is available only between {start} and {end}
      </p>
    ) : (
      <div className="space-y-4">
        {qrCheckIn ? (
          <>
            <p className="text-sm font-semibold text-green-600">Check-In QR</p>
            <img
              src={qrCheckIn}
              alt="Check-In QR"
              className="w-64 h-64 mx-auto"
            />
          </>
        ) : (
          <p className="text-gray-400">Loading Check-In QR...</p>
        )}

        {qrCheckOut ? (
          <>
            <p className="text-sm font-semibold text-red-600">Check-Out QR</p>
            <img
              src={qrCheckOut}
              alt="Check-Out QR"
              className="w-64 h-64 mx-auto"
            />
          </>
        ) : (
          <p className="text-gray-400">Loading Check-Out QR...</p>
        )}
      </div>
    )}
  </div>
);

}
