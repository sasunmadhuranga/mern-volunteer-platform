import { useEffect, useState } from "react";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function EventQR({ eventId }) {
  const [qr, setQr] = useState("");

  useEffect(() => {
    const fetchQR = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/events/${eventId}/qr`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQr(res.data.qrCodeDataURL);
    };
    fetchQR();
  }, [eventId]);

  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold mb-2">Attendance QR Code</h3>
      {qr ? <img src={qr} alt="Event QR Code" className="mx-auto w-48 h-48"/> : <p>Loading QR...</p>}
    </div>
  );
}
