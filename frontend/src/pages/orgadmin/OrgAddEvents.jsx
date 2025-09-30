import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export default function OrgEvents() {
  const [eventType, setEventType] = useState("");
  const [showForm, setShowForm] = useState(false); 
  const [eventName, setEventName] = useState("");
  const [institute, setInstitute] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [qualification, setQualification] = useState("");
  const [qualificationType, setQualificationType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [opportunity, setOpportunity] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [description, setDescription] = useState("");
  const [minDay, setMinDay] = useState("");
  const [error, setError] = useState("");

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
      setShowForm(true);
    } else {
      setError("Please select an event type first.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
        "http://localhost:5000/api/events/add",
        {
          eventType, // <-- include event type here
          eventName,
          institute,
          location,
          city,
          startDate,
          endDate,
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
        toast.success("Event created successfully!")
        console.log("New event ID:", res.data.id);
      }

      setEventName("");
      setInstitute("");
      setLocation("");
      setCity("");
      setStartDate("");
      setEndDate("");
      setOpportunity("");
      setMinAge("");
      setMaxAge("");
      setDescription("");
      setQualification("");
      setMinDay("");
      setEventType("");
      setShowForm(false); // Go back to event type selection
    } catch (err) {
      console.error(err);
      setError("Failed to create event. Please try again.");
    }
  };

  if (!showForm) {
    return (
      <div className="flex justify-center items-center bg-sky-100 px-4 py-12 md:px-20 lg:px-40">
        <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-md ">
          <h2 className="text-2xl font-semibold text-sky-800 text-center mb-6">
            Select Event Type
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Volunteering Event Type</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full border border-gray-400 rounded-lg px-4 py-2"
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

          {eventType && (
            <p className="text-sm text-gray-700 my-6">
              <strong>About: </strong>
              {eventMeanings[eventType]}
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
  return (
    <div className="flex justify-center items-center bg-sky-100 px-4 py-12 md:px-20 lg:px-40">
      <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-md ">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-sky-800">
            Add Event - {eventType}
          </h2>

          <button 
            type="button"
            onClick={((e) => setShowForm(false))}
            className="text-sky-600 hover:text-sky-700 hover:underline flex items-center">
            ← Back
          </button>
        </div>
        
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
            <label className="block text-gray-700 font-medium">City</label>
            <input
              type="text"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
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
            <label className="block text-gray-700 font-medium">Qualification</label>
            <select 
            value={qualification} 
            onChange={(e) => setQualification(e.target.value)}
            className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value="Required">Required</option>
              <option value="Not Required">Not Required</option>
            </select>
          </div>
          {qualification === "Required" && (
            <div>
              <label className="block text-gray-700 font-medium">Type of Qualifications</label>
              <select 
              value={qualificationType} 
              onChange={(e) => setQualificationType(e.target.value)}
              className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="O/L">O/L</option>
                <option value="A/L">A/L</option>
                <option value="Diploma">Diploma</option>
                <option value="Degree">Degree</option>
              </select>
          </div>
          )}
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
        
      </div>
    </div>
  );
}
