import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdLogin, MdLogout } from "react-icons/md";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function AttendanceHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId, eventName } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    async function fetchHistory() {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API_BASE_URL}/api/attendance/history/${eventId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setRecords(res.data.history || []);
      } catch (err) {
        console.log("History fetch error", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [eventId]);

  const formatTime = (dateTime) => {
    if (!dateTime) return "—";

    return new Date(dateTime).toLocaleTimeString("en-LK", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Colombo",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!eventId) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-600 mb-4">Event not found</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <p className="text-gray-700 mb-6">Event: {eventName}</p>

        {records.length === 0 ? (
          <p className="text-gray-500">
            No attendance records found for this event.
          </p>
        ) : (
          <div className="space-y-6">
            {records.map((r, index) => (
              <div key={index} className="flex items-start">
                <div className="w-3 h-3 border-2 mt-2 rounded-full border-blue-600 mr-4" />

                <div className="bg-white shadow rounded-xl p-4 flex-1">
                  <p className="text-lg font-semibold text-blue-600 mb-2">
                    {r.date}
                  </p>

                  <div className="flex items-center text-gray-600 mb-1">
                    <MdLogin className="mr-2 text-green-500 text-xl" />
                    <span>Check-in: {formatTime(r.checkInTime)}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <MdLogout className="mr-2 text-red-500 text-xl" />
                    <span>Check-out: {formatTime(r.checkOutTime)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
