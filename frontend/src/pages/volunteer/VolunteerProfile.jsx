import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useUser } from "../../context/UserContext";

export default function VolunteerProfile() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { user, setUser, token } = useUser(); // get user & token from context
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [birthday, setBirthday] = useState(user?.birthday || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [contactEmail, setContactEmail] = useState(user?.contactEmail || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [city, setCity] = useState(user?.city || "");
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setBirthday(user.birthday || "");
    setGender(user.gender || "");
    setContactEmail(user.contactEmail || "");
    setPhone(user.phone || "");
    setAddress(user.address || "");
    setCity(user.city || "");
    setPreview(user.profilePicUrl || null);
  }, [user]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("birthday", birthday);
      formData.append("gender", gender);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("contactEmail", contactEmail);

      if (profilePicFile) {
        formData.append("profilePic", profilePicFile);
      } else if (!preview) {
        formData.append("removeProfilePic", "true");
      }

      const res = await axios.put(
        `${API_BASE_URL}/api/users/update`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      setSuccess("Profile updated successfully.");
      const updatedUser = res.data.user;
      setUser(updatedUser); // update context
      setPreview(null);
      setProfilePicFile(null);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setProfilePicFile(null);
    setPreview(null);
  };

  if (!user) return <p className="text-center text-gray-700">Loading...</p>;

  return (
    <div className="flex justify-center items-center bg-neutral-100 px-4 py-12 md:px-20 lg:px-40">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="text-sky-600 hover:underline font-medium">Edit</button>
          ) : (
            <button onClick={() => setIsEditing(false)} className="text-sky-600 hover:underline font-medium">← Back</button>
          )}
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24">
            {preview ? (
              <img src={preview} alt="Profile" className="w-full h-full rounded-full object-cover border" />
            ) : (
              <div className="w-full h-full bg-gray-300 text-gray-500 rounded-full flex justify-center items-center text-xl">
                Volunteer
              </div>
            )}
            {isEditing && (
              <>
                {preview ? (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute bottom-0 right-0 bg-red-500 text-white hover:bg-red-600 p-1 rounded-full"
                    title="Remove photo"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                ) : (
                  <label className="absolute bottom-0 right-0 bg-sky-600 hover:bg-sky-700 text-white p-1 rounded-full cursor-pointer" title="Upload photo">
                    <FiEdit2 className="w-5 h-5" />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ProfileField label="Name" value={name} onChange={setName} isEditing={isEditing} />
          <ProfileField label="Birthday" type="date" value={birthday} onChange={setBirthday} isEditing={isEditing} />
          <ProfileField label="Gender" type="select" value={gender} onChange={setGender} isEditing={isEditing} />
          <ProfileField label="Email" type="email" value={contactEmail} onChange={setContactEmail} isEditing={isEditing} />
          <ProfileField label="Phone" type="tel" value={phone} onChange={setPhone} isEditing={isEditing} />
          <ProfileField label="Address" value={address} onChange={setAddress} isEditing={isEditing} />
          <ProfileField label="City" value={city} onChange={setCity} isEditing={isEditing} />

          {isEditing && (
            <button type="submit" className="w-full text-white bg-sky-600 hover:bg-sky-700 rounded-lg py-2 transition-opacity duration-200">
              Save Changes
            </button>
          )}
        </form>

        {success && <p className="text-green-600 text-center mt-4">{success}</p>}
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}

function ProfileField({ label, value, onChange, isEditing, type = "text" }) {
  const fieldId = label.toLowerCase().replace(" ", "-");

  return (
    <div>
      <label htmlFor={fieldId} className="block text-gray-700 font-medium">{label}</label>
      {!isEditing ? (
        <p className="py-2 text-gray-800">{type === "date" && value ? new Date(value).toLocaleDateString() : value || "—"}</p>
      ) : type === "select" ? (
        <select id={fieldId} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-400 py-2 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      ) : type === "date" ? (
        <DatePicker
          selected={value ? new Date(value) : null}
          onChange={(date) => onChange(date?.toISOString() || "")}
          maxDate={new Date()}
          className="w-full border border-gray-400 py-2 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={100}
        />
      ) : (
        <input
          id={fieldId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-400 py-2 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      )}
    </div>
  );
}
