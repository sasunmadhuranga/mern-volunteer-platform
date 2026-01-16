import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function AttendanceScanner({ eventId, eventName, onComplete }) {
  const navigate = useNavigate();

  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);

  const [loading, setLoading] = useState(false);

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Colombo",
  });

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            if (!isRunningRef.current) return;

            isRunningRef.current = false;
            await handleScan(decodedText);
          }
        );

        isRunningRef.current = true;
      } catch (err) {
        toast.error("Camera access failed");
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && isRunningRef.current) {
        scannerRef.current
          .stop()
          .catch(() => {})
          .finally(() => scannerRef.current.clear());
      }
    };
  }, [handleScan]); 

  const handleScan = useCallback(async (result) => {
    try {
      const parsed = JSON.parse(result);

      if (!parsed.eventId || !parsed.date || !parsed.token || !parsed.scanType) {
        toast.error("Invalid QR Code");
        isRunningRef.current = true;
        return;
      }

      setLoading(true);
      const authToken = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/attendance/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Scan Failed");
        isRunningRef.current = true;
      } else {
        toast.success(data.message);
        onComplete?.(data.message);
        navigate("/volunteer/attendance", { replace: true });
      }
    } catch {
      toast.error("QR Parsing Failed");
      isRunningRef.current = true;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, navigate, onComplete]);

  return (
    <div className="flex justify-center items-center bg-neutral-100 px-4 py-12 md:px-20 lg:px-40">
      <div className="w-full max-w-md p-6 flex flex-col items-center bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold text-blue-600 mb-1">{eventName}</h1>
        <p className="text-gray-600 mb-4">Date: {today}</p>

        <div
          id="qr-reader"
          className="w-full h-80 bg-black rounded-xl overflow-hidden mb-4"
        />

        {loading && (
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        )}
      </div>
    </div>
  );
}
