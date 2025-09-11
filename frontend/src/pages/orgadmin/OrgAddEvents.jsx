import { useState } from "react";
import axios from "axios";

export default function OrgEvents() {
  const [eventName, setEventName] = useState("");
  const [institute, setInstitute] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [opportunity, setOpportunity] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [description, setDescription] = useState("");
  const [minDay, setMinDay] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (endDate && new Date(startDate) > new Date(endDate)) {
        setError("End date cannot be before start date.");
        return;
        }
    if (minAge > maxAge) {
        setError("Minimum age cannot be greater than maximum age.");
        return;
        }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authorized. Please login again.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/events/add", // <-- adjust your backend route here
        {
          eventName,
          institute,
          location,
          startDate,
          endDate,
          opportunity,
          minAge,
          maxAge,
          description,
          minDay,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        console.log("New event ID:", res.data.id); // or do something useful
        }

      setSuccess("Event created successfully!");
      // ✅ reset form
      setEventName("");
      setInstitute("");
      setLocation("");
      setStartDate("");
      setEndDate("");
      setOpportunity("");
      setMinAge("");
      setMaxAge("");
      setDescription("");
      setMinDay("");
    } catch (err) {
      console.error(err);
      setError("Failed to create event. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center bg-sky-100 px-4 py-12 md:px-20 lg:px-40">
      <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-md ">
        <h2 className="text-2xl font-semibold text-sky-800 text-center mb-6">
          Add Events
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium">Event Name</label>
            <input
              type="text"
              value={eventName}
              required
              onChange={(e) => setEventName(e.target.value)}
              className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Institute</label>
            <input
              type="text"
              value={institute}
              required
              onChange={(e) => setInstitute(e.target.value)}
              className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Location</label>
            <input
              type="text"
              value={location}
              required
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Start Date</label>
            <input
              type="date"
              value={startDate}
              required
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">End Date</label>
            <input
              type="date"
              value={endDate}
              required
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              Available Opportunities
            </label>
            <input
              type="number"
              value={opportunity}
              min={0}
              required
              onChange={(e) => setOpportunity(Number(e.target.value))}
              className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Minimum Age</label>
            <input
              type="number"
              value={minAge}
              min={18}
              required
              onChange={(e) => setMinAge(Number(e.target.value))}
              className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Maximum Age</label>
            <input
              type="number"
              value={maxAge}
              min={minAge || 18}
              required
              onChange={(e) => setMaxAge(Number(e.target.value))}
              className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              Min Work Days Needed for Certification
            </label>
            <input
              type="number"
              value={minDay}
              min={0}
              required
              onChange={(e) => setMinDay(Number(e.target.value))}
              className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Description</label>
            <textarea
              value={description}
              rows={6}
              required
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              className="bg-sky-600 text-white w-full py-2 rounded-lg hover:bg-sky-700 transition-opacity duration-200"
            >
              Submit
            </button>
          </div>
        </form>
        {success && (
          <p className="text-green-600 mt-4 font-medium text-center">
            {success}
          </p>
        )}
        {error && (
          <p className="text-red-500 mt-4 font-medium text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
