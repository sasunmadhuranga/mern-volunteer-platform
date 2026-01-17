import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiDownload, FiAward } from "react-icons/fi";
import { useUser } from "../../context/UserContext";

export default function CertificateGenerator() {
  const [events, setEvents] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const {token} = useUser();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [loadingEvents, setLoadingEvents] = useState(true);
  

  useEffect(() => {
    if (!token) return;

    setLoadingEvents(true); // start loading
    axios
      .get(`${API_BASE_URL}/api/certificates/eligible-events`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEvents(res.data))
      .catch(() => toast.error("Failed to fetch eligible events"))
      .finally(() => setLoadingEvents(false)); // stop loading
  }, [API_BASE_URL, token]);


  const handleGenerate = async (eventId, eventName) => {
    try {
      setLoadingId(eventId);

      const res = await axios.get(
        `${API_BASE_URL}/api/certificates/generate/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${eventName}-certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Certificate downloaded successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate certificate");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <FiAward className="text-blue-600 text-3xl" />
          <h2 className="text-3xl font-bold text-gray-800">
            Your Certificates
          </h2>
        </div>

        {/* Empty State */}
        {loadingEvents ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">Loading certificates...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">
              You don’t have any eligible certificates yet.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Complete the minimum required days to unlock certificates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {events.map((ev) => (
              <div key={ev.eventId} className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{ev.eventName}</h3>
                </div>
                <button
                  onClick={() => handleGenerate(ev.eventId, ev.eventName)}
                  disabled={loadingId === ev.eventId}
                  className={`mt-5 flex items-center justify-center gap-2 py-2.5 rounded-lg text-white text-sm font-medium transition
                    ${loadingId === ev.eventId
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  <FiDownload />
                  {loadingId === ev.eventId ? "Generating..." : "Download Certificate"}
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
