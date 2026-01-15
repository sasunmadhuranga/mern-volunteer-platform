import React from "react";
import { useNavigate } from "react-router-dom";

export default function EventList({
  events = [],
  handleOrgClick,
  filters = {},
}) {
  const navigate = useNavigate();

  if (!Array.isArray(events)) {
    return null;
  }

  return (
    <div className="mt-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.length > 0 ? (
        events.map((event) => (
          <div
            key={event._id}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300 space-y-4"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h2 className="text-lg md:text-xl font-semibold text-sky-700 leading-snug">
                {event.eventName}
              </h2>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {new Date(event.startDate).toLocaleDateString("en-GB", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                →{" "}
                {new Date(event.endDate).toLocaleDateString("en-GB", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Location Details */}
            <div className="text-sm space-y-1 text-gray-700">
              <p>
                <span className="font-semibold">City:</span> {event.city}
              </p>
              <p>
                <span className="font-semibold">Location:</span> {event.location}
              </p>
              <p>
                <span className="font-semibold">Organized by:</span>
                <button
                  className="text-blue-700 hover:underline ml-1"
                  onClick={() => handleOrgClick(event.organizerId)}
                >
                  {event.institute}
                </button>
              </p>
            </div>

            {/* Action Button */}
            <div>
              <button
                onClick={() =>
                  navigate(`/volunteer/eventregistration/${event._id}`, {
                    state: {
                      event,
                      fromSearch: {
                        filters,
                        results: events,
                      },
                    },
                  })
                }
                className="w-full bg-sky-600 text-white font-medium rounded-md py-2 px-4 hover:bg-sky-700 transition text-center"
              >
                Read more & apply →
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600 col-span-full text-center text-lg">
          No events found.
        </p>
      )}
    </div>
  );
}
