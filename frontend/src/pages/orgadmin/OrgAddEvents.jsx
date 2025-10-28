import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import EventForm from "../components/EventForm";

export default function OrgEvents() {
  const [eventType, setEventType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const eventMeanings = {
    Community: "Engage with local communities to provide support and services.",
    Environmental: "Help preserve and protect the environment and natural resources.",
    Educational: "Support educational initiatives such as tutoring or mentoring.",
    Healthcare: "Assist in healthcare settings or promote health awareness.",
    Animal: "Support animal shelters or help with animal rescue initiatives.",
    "Disaster Relief": "Aid communities affected by natural or man-made disasters.",
    Virtual: "Participate in volunteering activities remotely from anywhere.",
  };

  const handleProceed = () => {
    if (eventType) {
      setError("");
      setShowForm(true);
    } else {
      setError("Please select an event type first.");
    }
  };

  const handleAdd = async (formData) => {
    const {
      eventName,
      institute,
      location,
      city,
      startDate,
      endDate,
      startTime,
      endTime,
      opportunity,
      minAge,
      maxAge,
      description,
      qualification,
      qualificationType,
      minDay,
    } = formData;

    if (new Date(startDate) > new Date(endDate)) {
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
        `${API_BASE_URL}/api/events/add`,
        {
          eventType, // passed from OrgEvents
          eventName,
          institute,
          location,
          city,
          startDate,
          endDate,
          startTime,
          endTime,
          opportunity,
          minAge,
          maxAge,
          description,
          qualification,
          qualificationType: qualification === "Required" ? qualificationType : "",
          minDay,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success("Event created successfully!");
        setShowForm(false);
        setEventType("");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create event. Please try again.");
    }
  };

  // STEP 1: Select Event Type
  if (!showForm) {
    return (
      <div className="flex justify-center items-center bg-sky-100 px-4 py-12 md:px-20 lg:px-40">
        <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-sky-800 text-center mb-6">
            Select Event Type
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Volunteering Event Type</label>
            <select
              value={eventType}
              onChange={(e) => {
                setEventType(e.target.value);
                if (e.target.value) setError("");
              }}
              className="w-full border border-gray-400 rounded-lg px-4 py-2"
            >
              <option value="">Choose type</option>
              {Object.keys(eventMeanings).map((type) => (
                <option key={type} value={type}>
                  {type} Volunteering
                </option>
              ))}
            </select>
          </div>

          {eventType && (
            <p className="text-sm text-gray-700 my-6">
              <strong>About:</strong> {eventMeanings[eventType]}
            </p>
          )}

          <button
            onClick={handleProceed}
            className="bg-sky-600 text-white w-full py-2 rounded-lg hover:bg-sky-700 transition-opacity duration-200"
          >
            Proceed →
          </button>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
      </div>
    );
  }

  // STEP 2: Event Form
  return (
    <div className="flex justify-center items-center bg-sky-100 px-4 py-12 md:px-20 lg:px-40">
      <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-sky-800">
            Add Event - {eventType}
          </h2>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="text-sky-600 hover:text-sky-700 hover:underline flex items-center"
          >
            ← Back
          </button>
        </div>

        <EventForm onSubmit={handleAdd} isEditMode={false} />

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
