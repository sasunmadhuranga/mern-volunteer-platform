import { useEffect, useState } from "react";
import axios from "axios";

export default function EventHistory() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found.");
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/api/event-applications/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setApplications(res.data.applications || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load your applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [API_BASE_URL]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="flex justify-center items-center bg-neutral-100 px-4 py-12 md:px-20 lg:px-40">
        <div className="w-full max-w-4xl p-6 relative">
            <h1 className="text-2xl font-semibold mb-6 text-gray-700 text-center">My Applied Events</h1>
                {applications.length === 0 ? (
                    <p className="text-center text-gray-600">You haven't applied to any events yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {applications.map((app) => {
                        const event = app.eventId;

                        return (
                        <div
                            key={app._id}
                            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-3"
                        >
                            <h2 className="text-xl font-semibold text-sky-700">{event.eventName}</h2>
                            <p className="text-sm text-gray-600">
                            <strong>Duration:</strong>{" "}
                            {new Date(event.startDate).toLocaleDateString()} →{" "}
                            {new Date(event.endDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-700"><strong>Location:</strong> {event.location}, {event.city}</p>
                            <p className="text-sm text-gray-700"><strong>Institute:</strong> {event.institute}</p>
                            <p className="text-sm"><strong>Status:</strong> <span className={`font-medium ${getStatusColor(app.status)}`}>{app.status}</span></p>
                            {app.qualificationFile && (
                            <a
                                href={app.qualificationFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 text-sm underline"
                            >
                                View qualification document
                            </a>
                            )}
                        </div>
                        );
                    })}
                    </div>
                )}
      </div>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case "approved":
      return "text-green-600";
    case "pending":
      return "text-yellow-600";
    case "rejected":
      return "text-red-600";
    case "cancelled":
      return "text-gray-600";
    default:
      return "";
  }
}
