import React from "react";
import axios from "axios";
export default function UserProfileDisplay({ onClose, loading, error, profile }) {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleDownload = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return alert("Not logged in");

    const res = await axios.get(
      `${API_BASE_URL}/api/event-applications/download/${profile.applicationId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );

    const contentType = res.headers["content-type"] || "application/pdf";
    const blob = new Blob([res.data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qualification.${profile.qualificationFile.format || "pdf"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download failed", err);
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative w-[500px] bg-white rounded-lg overflow-hidden shadow-md p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 text-xl hover:text-black"
          aria-label="Close"
        >
          ×
        </button>

        {/* Content */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : profile ? (
          <div className="flex flex-col items-center space-y-4">
            {/* Profile Picture */}
            {profile.profilePic ? (
              <img
                src={
                  profile.profilePic.startsWith("http")
                    ? profile.profilePic
                    : `${API_BASE_URL}/${profile.profilePic}`
                }
                alt={`${profile.name} profile`}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xl text-gray-600">No Image</span>
              </div>
            )}

            {/* User Info */}
            <h2 className="text-2xl font-semibold">{profile.name}</h2>
            <p><strong>Email:</strong> {profile.contactEmail}</p>
            <p><strong>Phone:</strong> {profile.phone || "N/A"}</p>

            {/* Qualification Download */}
            {profile.qualificationFile && (
              <button
                onClick={handleDownload}
                className="text-blue-600 underline hover:text-blue-800"
              >
                View / Download Qualification
              </button>
            )}
          </div>
        ) : (
          <p>No profile data available.</p>
        )}
      </div>
    </div>
  );
}
