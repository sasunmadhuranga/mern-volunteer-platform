import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AttendanceScanner from "../components/AttendanceScanner";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function AttendanceUI() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [scannerEvent, setScannerEvent] = useState(null);

  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Colombo",
  });

  useEffect(() => {
    async function fetchEvents() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `${API_BASE_URL}/api/event-applications/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const approved = (res.data.applications || []).filter(
          (app) => app.status === "approved"
        );

        setEvents(approved);
      } catch (err) {
        alert("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const handleScannerComplete = (message) => {
    if (scannerEvent) {
      setAttendanceStatus((prev) => ({
        ...prev,
        [scannerEvent.eventId]: message,
      }));
    }
    setScannerEvent(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-neutral-100 px-4 py-12 md:px-20 lg:px-40">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (scannerEvent) {
    return (
      <AttendanceScanner
        eventId={scannerEvent.eventId}
        eventName={scannerEvent.eventName}
        onComplete={handleScannerComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-3xl mx-auto space-y-4">
        {events.map((app) => {
          const event = app.eventId;
          const now = new Date();
          const start = new Date(event.startDate);
          const end = new Date(event.endDate);

          const hasStarted = now >= start;
          const hasEnded = now > end;
          const todayWithinEvent = now >= start && now <= end;

          return (
            <div
              key={event._id}
              className="w-full border rounded-xl p-4 shadow-sm bg-white mb-8"
            >

              <h2 className="text-center text-lg font-bold text-blue-600">
                {event.eventName}
              </h2>

              <p className="text-sm text-gray-600">
                {new Date(event.startDate).toLocaleDateString()} →{" "}
                {new Date(event.endDate).toLocaleDateString()}
              </p>

              {todayWithinEvent && (
                <p className="mt-1 font-medium text-gray-700">
                  Today: {today}
                </p>
              )}

              {hasStarted && !hasEnded && (
                <div className="flex gap-3 mt-4">
                  <button
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold"
                    onClick={() =>
                      setScannerEvent({
                        eventId: event._id,
                        eventName: event.eventName,
                      })
                    }
                  >
                    Check-In
                  </button>

                  <button
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold"
                    onClick={() =>
                      setScannerEvent({
                        eventId: event._id,
                        eventName: event.eventName,
                      })
                    }
                  >
                    Check-Out
                  </button>
                </div>
              )}

              {hasStarted && (
                <button
                  className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold"
                  onClick={() =>
                    navigate("/volunteer/attendance-history", {
                      state: {
                        eventId: event._id,
                        eventName: event.eventName,
                      },
                    })
                  }
                >
                  View Attendance History
                </button>
              )}

              {attendanceStatus[event._id] && (
                <p className="mt-2 italic text-sm text-gray-600">
                  {attendanceStatus[event._id]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
