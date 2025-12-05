import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function EventQR({ eventId }) {
  const [qr, setQr] = useState("");

  useEffect(() => {
    const fetchQR = async () => {
      const token = localStorage.getItem("token");
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/events/${eventId}/qr/${today}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setQr(res.data.qrImage);
      } catch (err) {
        console.error("Failed to fetch QR:", err);
      }
    };

    fetchQR();
  }, [eventId]);

  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold mb-2">Attendance QR Code</h3>
      <p className="text-sm text-gray-500 mb-2">
        For today ({new Date().toISOString().split("T")[0]})
      </p>

      {qr ? (
        <img src={qr} alt="Event QR Code" className="mx-auto w-48 h-48" />
      ) : (
        <p>Loading QR...</p>
      )}
    </div>
  );
}
