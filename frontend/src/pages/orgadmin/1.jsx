import { useState, useEffect } from "react";

export default function EventForm({ initialValues = {}, onSubmit, isEditMode = false }) {
  // Default values or from initialValues (editing)
  const [eventName, setEventName] = useState(initialValues.eventName || "");
  const [institute, setInstitute] = useState(initialValues.institute || "");
  const [location, setLocation] = useState(initialValues.location || "");
  const [city, setCity] = useState(initialValues.city || "");
  const [startDate, setStartDate] = useState(initialValues.startDate ? initialValues.startDate.slice(0, 10) : "");
  const [endDate, setEndDate] = useState(initialValues.endDate ? initialValues.endDate.slice(0, 10) : "");
  const [opportunity, setOpportunity] = useState(initialValues.opportunity || 0);
  const [minAge, setMinAge] = useState(initialValues.minAge || 18);
  const [maxAge, setMaxAge] = useState(initialValues.maxAge || 18);
  const [qualification, setQualification] = useState(initialValues.qualification || "");
  const [qualificationType, setQualificationType] = useState(initialValues.qualificationType || "");
  const [minDay, setMinDay] = useState(initialValues.minDay || 0);
  const [description, setDescription] = useState(initialValues.description || "");

  // To reset maxAge if minAge changes
  useEffect(() => {
    if (maxAge < minAge) setMaxAge(minAge);
  }, [minAge, maxAge]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the whole form data back to parent
    onSubmit({
      eventName,
      institute,
      location,
      city,
      startDate,
      endDate,
      opportunity,
      minAge,
      maxAge,
      qualification,
      qualificationType,
      minDay,
      description,
    });
  };

  return (
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

      {/* Institute - disabled in edit mode */}
      <div>
        <label className="block text-gray-700 font-medium">Institute</label>
        <input
          type="text"
          value={institute}
          required
          disabled={isEditMode}
          onChange={(e) => setInstitute(e.target.value)}
          className={`w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none ${
            isEditMode ? "bg-gray-100 cursor-not-allowed" : "focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          }`}
        />
      </div>

      {/* Location - disabled in edit mode */}
      <div>
        <label className="block text-gray-700 font-medium">Location</label>
        <input
          type="text"
          value={location}
          required
          disabled={isEditMode}
          onChange={(e) => setLocation(e.target.value)}
          className={`w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none ${
            isEditMode ? "bg-gray-100 cursor-not-allowed" : "focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          }`}
        />
      </div>

      {/* City - disabled in edit mode */}
      <div>
        <label className="block text-gray-700 font-medium">City</label>
        <input
          type="text"
          value={city}
          required
          disabled={isEditMode}
          onChange={(e) => setCity(e.target.value)}
          className={`w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none ${
            isEditMode ? "bg-gray-100 cursor-not-allowed" : "focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          }`}
        />
      </div>

      {/* Start Date */}
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

      {/* End Date */}
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

      {/* Available Opportunities */}
      <div>
        <label className="block text-gray-700 font-medium">Available Opportunities</label>
        <input
          type="number"
          value={opportunity}
          min={0}
          required
          onChange={(e) => setOpportunity(Number(e.target.value))}
          className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Minimum Age */}
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

      {/* Maximum Age */}
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

      {/* Qualification */}
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

      {/* Type of Qualifications (conditional) */}
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

      {/* Min Work Days */}
      <div>
        <label className="block text-gray-700 font-medium">Min Work Days Needed for Certification</label>
        <input
          type="number"
          value={minDay}
          min={0}
          required
          onChange={(e) => setMinDay(Number(e.target.value))}
          className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Description */}
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

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="bg-sky-600 text-white w-full py-2 rounded-lg hover:bg-sky-700 transition-opacity duration-200"
        >
          {isEditMode ? "Update Event" : "Add Event"}
        </button>
      </div>
    </form>
  );
}
