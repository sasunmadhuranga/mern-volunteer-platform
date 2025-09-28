import { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

export default function OrgProfile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aboutInfo, setAboutInfo] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState(null); // stored URL from DB
  const [profilePicFile, setProfilePicFile] = useState(null); // file to upload
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [originalProfilePic, setOriginalProfilePic] = useState(null);
  const [originalContactEmail, setOriginalContactEmail] = useState("");
  const [originalPhone, setOriginalPhone] = useState("");
  const [originalAboutInfo, setOriginalAboutInfo] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login.");
      return;
    }

    axios
        .get("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            const userData = res.data.user;

            setUser(userData);
            setName(userData.name);
            setEmail(userData.email);
            setProfilePicUrl(
              userData.profilePic
                ? `http://localhost:5000${userData.profilePic}`
                : null
            );
            setContactEmail(userData.contactEmail || "");
            setPhone(userData.phone || "");
            setAboutInfo(userData.aboutInfo || "")

            // ✅ Correctly set original values from userData
            setOriginalName(userData.name);
            setOriginalEmail(userData.email);
            setOriginalContactEmail(userData.contactEmail || "");
            setOriginalPhone(userData.phone || "");
            setOriginalProfilePic(userData.profilePic || null);
            setOriginalAboutInfo(userData.aboutInfo || "")
        })
      .catch(() => setError("Failed to fetch user details."));
  }, []);

  // Preview selected image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Remove profile picture
  const handleRemoveImage = () => {
    setProfilePicFile(null);
    setPreview(null);
    setProfilePicUrl(null); // remove existing too
  };

  // Save updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authorized. Please login again.");
      return;
    }


    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("contactEmail", contactEmail);
      formData.append("phone", phone);
      formData.append("aboutInfo", aboutInfo);
      if (profilePicFile) {
        formData.append("profilePic", profilePicFile);
      } else if (!profilePicUrl) {
        // if removed, tell backend
        formData.append("removeProfilePic", "true");
      }

      const res = await axios.put("http://localhost:5000/api/users/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Profile updated successfully!");
      setUser(res.data.user);
      setProfilePicUrl(
        res.data.user.profilePic
          ? `http://localhost:5000${res.data.user.profilePic}`
          : null
      );
      setPreview(null);
      setProfilePicFile(null);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    }
  };

  if (error) return <p className="text-red-600 text-center">{error}</p>;
  if (!user) return <p className="text-center">Loading...</p>;

  const isModified =
    name !== originalName ||
    email !== originalEmail ||
    contactEmail !== originalContactEmail ||
    phone !== originalPhone ||
    aboutInfo !== originalAboutInfo ||
    profilePicFile !== null ||
    (!profilePicUrl && originalProfilePic); // removed existing image  
    
  return (
    <div className="flex justify-center items-center bg-sky-100 px-4 md:px-20 lg:px-40 py-12">
      <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-sky-800 mb-6 text-center">
          Edit Organization Profile
        </h2>

        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
                {preview || profilePicUrl ? (
                  <img
                    src={preview || profilePicUrl}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-xl">
                    ORG
                  </div>
                )}

                {/* Conditional Button */}
                {preview || profilePicUrl  ? (
                // If image exists -> show remove button
                <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    title="Remove photo"
                >
                    <FiTrash2 className="w-5 h-5" />
                </button>
                ) : (
                // If no image -> show upload button
                <label
                    className="absolute bottom-0 right-0 bg-sky-600 text-white rounded-full p-1 hover:bg-sky-700 cursor-pointer"
                    title="Upload photo"
                >
                    <FiEdit2 className="w-5 h-5" />
                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    />
                </label>
                )}
            </div>
            </div>


        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Email(for contacts)</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">About Us</label>
            <textarea
              value={aboutInfo}
              onChange={(e)=> setAboutInfo(e.target.value)}
              rows={5}
              className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue">
              </textarea>
          </div>
          <button
            type="submit"
            className={`w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition-opacity duration-200 ${
                isModified ? "" : "invisible pointer-events-none"
            }`}
            >
            Save Changes
        </button>

        </form>

        {/* Feedback */}
        {success && <p className="text-green-600 mt-4 text-center">{success}</p>}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
