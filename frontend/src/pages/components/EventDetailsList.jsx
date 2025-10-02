import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function EventDetailsList({ event, handleProceed }) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!event) return null;

  return (
    <div className="w-full max-w-3xl p-6 rounded-xl shadow-lg bg-white relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Event Information</h2>
        <button
          onClick={() => {
            navigate("/volunteer/eventsection", {
              state: location.state?.fromSearch || {},
            });
          }}
          className="text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      <h1 className="text-xl font-bold text-sky-700 mb-4">{event.eventName}</h1>

      <div className="space-y-3">
        <p><strong>Event Type:</strong> {event.eventType}</p>
        <p><strong>Organized by:</strong> {event.institute}</p>
        <p><strong>Location:</strong> {event.location}, {event.city}</p>
        <p>
          <strong>Event Duration:</strong>{" "}
          {new Date(event.startDate).toLocaleDateString("en-GB", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })} →{" "}
          {new Date(event.endDate).toLocaleDateString("en-GB", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p><strong>Description:</strong></p>
        <p className="text-justify">{event.description}</p>
        <p><strong>Qualification:</strong> {event.qualification}</p>
        <p><strong>Qualified Age Range:</strong> {event.minAge} - {event.maxAge}</p>

        <p className="flex items-center space-x-2">
          <strong>Minimum Commitment Days:</strong>
          <span>{event.minDay}</span>
          <div className="relative group cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>

            <div className="absolute bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {`To gain a certificate you have to work ${event.minDay} days, but you can volunteer for any number of days if you don't intend to gain a certificate.`}
            </div>
          </div>
        </p>

        <p><strong>Total Opportunities:</strong> {event.opportunity}</p>
      </div>

      <div className="mt-6">
        <button
          onClick={handleProceed}
          className="w-full bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 transition"
        >
          Proceed →
        </button>
      </div>
    </div>
  );
}
