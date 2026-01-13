export default function OrgProfileDisplay({ onClose, loading, error, profile }) {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative w-[500px] bg-white rounded-lg overflow-hidden shadow-md p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 text-xl hover:text-black"
          aria-label="Close"
        >
          ×
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : profile ? (
          <>
            <div className="flex flex-col items-center space-y-4">
              {profile.profilePic ? (
                <img
                  src={profile.profilePic.startsWith("http") ? profile.profilePic : `${API_BASE_URL}/${profile.profilePic}`}
                  alt={`${profile.name} profile`}
                  className="w-24 h-24 rounded-full object-cover"
                />

              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xl text-gray-600">No Image</span>
                </div>
              )}
              <h2 className="text-2xl font-semibold">{profile.name}</h2>
              <p><strong>Email:</strong> {profile.contactEmail}</p>
              <p><strong>Phone:</strong> {profile.phone || "N/A"}</p>
            </div>
            <div className="mt-4 text-gray-700">
              <h3 className="font-semibold mb-2">About</h3>
              <p>{profile.aboutInfo || "No additional information provided."}</p>
            </div>
          </>
        ) : (
          <p>No profile data available.</p>
        )}
      </div>
    </div>
  );
}
