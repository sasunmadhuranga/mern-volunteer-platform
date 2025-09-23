import { useEffect, useState } from "react";
import axios from "axios";

export default function EventsSection() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // You can use user data here later
      })
      .catch(() => setError("Failed to fetch user details."));
  }, [API_BASE_URL]);

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex justify-center items-center bg-neutral-100 px-4 py-12 md:px-20 lg:px-40">
      <div className="w-full">
        {/* Center the row horizontally on md+ */}
        <div className="md:flex md:justify-center">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            {/* Event Type */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-2 w-full md:w-auto">
              <label className="text-gray-700 md:whitespace-nowrap mb-1">Event Type</label>
              <select
                value={""}
                onChange={() => {}}
                className="border border-gray-400 rounded-md px-4 py-2 w-full"
              >
                <option value="">Choose type</option>
                <option value="Community">Community Volunteering</option>
                <option value="Environmental">Environmental Volunteering</option>
                <option value="Educational">Educational Volunteering</option>
                <option value="Healthcare">Healthcare Volunteering</option>
                <option value="Animal">Animal Volunteering</option>
                <option value="Disaster Relief">Disaster Relief Volunteering</option>
                <option value="Virtual">Virtual Volunteering</option>
              </select>
            </div>

            {/* Name */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-2 w-full md:w-auto">
              <label className="text-gray-700 md:whitespace-nowrap mb-1">Name</label>
              <input
                type="text"
                value={""}
                onChange={() => {}}
                className="border border-gray-400 rounded-md px-4 py-2 w-full"
              />
            </div>

            {/* City */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-2 w-full md:w-auto">
              <label className="text-gray-700 md:whitespace-nowrap mb-1">City</label>
              <input
                type="text"
                value={""}
                onChange={() => {}}
                className="border border-gray-400 rounded-md px-4 py-2 w-full"
              />
            </div>

            {/* Search Button */}
            <div className="w-full md:w-auto">
              <button className="w-full bg-sky-600 text-white rounded-md px-6 py-2 hover:bg-sky-700 transition">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
