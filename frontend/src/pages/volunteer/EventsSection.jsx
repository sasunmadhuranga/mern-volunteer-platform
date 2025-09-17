import { useEffect, useState } from "react";

export default function EventsSection() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    fetch("http://localhost:5000/api/users/protected", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.message === "Invalid or expired token") {
          setError("Session expired. Please log in again.");
        } else {
          setData(result);
        }
      })
      .catch(() => setError("Server error while fetching data."));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Volunteer Dashboard</h2>
      <p className="text-gray-700">Welcome, {data.user.role}!</p>
      <pre className="bg-gray-100 p-4 rounded mt-4">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
