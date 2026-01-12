import { useState, useEffect } from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";

export default function OrgProfile() {
  const { user, token, setUser } = useUser(); // get user and token from context
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aboutInfo, setAboutInfo] = useState("");
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [profilePicRemoved, setProfilePicRemoved] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  // Save original values for "modified" check
  const [originalValues, setOriginalValues] = useState({});

  useEffect(() => {
    if (!user) return;

    setName(user.name);
    setEmail(user.email);
    setContactEmail(user.contactEmail || "");
    setPhone(user.phone || "");
    setAboutInfo(user.aboutInfo || "");

    setOriginalValues({
      name: user.name,
      email: user.email,
      contactEmail: user.contactEmail || "",
      phone: user.phone || "",
      aboutInfo: user.aboutInfo || "",
      profilePic: user.profilePic || null
    });
  }, [user]);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setPreview(URL.createObjectURL(file));
      setProfilePicRemoved(false); // user chose a new image, no removal
    }
  };

  const handleRemoveImage = () => {
    setProfilePicFile(null);
    setPreview(null);
    setProfilePicRemoved(true); // mark for removal
  };


  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Not authorized. Please login again.");
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
      } else if (profilePicRemoved) {
        formData.append("removeProfilePic", "true"); // send removal flag
      }


      const res = await axios.put(
        `${API_BASE_URL}/api/users/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile updated successfully!");
      
      // Update context with the returned user
      setUser(res.data.user);

      // Reset local image state
      setPreview(null);
      setProfilePicFile(null);
      setProfilePicRemoved(false); // reset removal flag


      // Update original values for change detection
      setOriginalValues({
        name: res.data.user.name,
        email: res.data.user.email,
        contactEmail: res.data.user.contactEmail || "",
        phone: res.data.user.phone || "",
        aboutInfo: res.data.user.aboutInfo || "",
        profilePic: res.data.user.profilePic || null,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile. Please try again.");
    }
  };


  if (!user) return <p className="text-center">Loading...</p>;

  const isModified =
    name !== originalValues.name ||
    email !== originalValues.email ||
    contactEmail !== originalValues.contactEmail ||
    phone !== originalValues.phone ||
    aboutInfo !== originalValues.aboutInfo ||
    profilePicFile !== null ||
    profilePicRemoved; // <-- now removal triggers save button


  return (
    <div className="flex justify-center items-center bg-sky-100 px-4 md:px-20 lg:px-40 py-12">
      <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-sky-800 mb-6 text-center">
          Edit Organization Profile
        </h2>

        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border"
              />
            ) : user.profilePicUrl && !profilePicRemoved ? (
              <img
                src={user.profilePicUrl}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-xl">
                ORG
              </div>
            )}

            {preview || (user.profilePicUrl && !profilePicRemoved) ? (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                title="Remove photo"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            ) : (
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
            <label className="block text-gray-700 font-medium">Email (for contacts)</label>
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
              onChange={(e) => setAboutInfo(e.target.value)}
              rows={5}
              className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
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
      </div>
    </div>
  );
}
