import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export default function EventRegistration() {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [showApplication, setShowApplication] = useState(false);
  const [qualificationFile, setQualificationFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (!event) {
      navigate("/volunteer/eventsection");
    }
  }, [event, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token){
        setError("No token found. Please log in again")
        return;
    }
    axios.get(`${API_BASE_URL}/api/users/me`, {
            headers: {Authorization: `Bearer ${token}`},
        })
        .then((res) => {
            const userData = res.data.user; 
            setName(userData.name);
            setBirthday(userData.birthday);
            setContactEmail(userData.contactEmail);
            setPhone(userData.phone);
        })
        .catch(() => setError("Failed to fetch user details."))
  }, [API_BASE_URL])

  if (!event) return null;

  const handleProceed = () => {
    setShowApplication(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try{
        const token = localStorage.getItem("token");
        if(!token){
            setError("No token found. Please log in again.")
            return;
        }
        if(event.qualification === "Required" && !qualificationFile){
            setError("Please upload your qualification document.");
            return;
        }
        const formData = new FormData();
        const age = calculateAge(birthday);
        formData.append("eventId", event._id);
        formData.append("name", name);
        formData.append("age", age);
        formData.append("contactEmail", contactEmail);
        formData.append("phone", phone);
        if(qualificationFile){
            formData.append("qualificationFile", qualificationFile);
        }
        await axios.post(`${API_BASE_URL}/api/event-applications`, formData, {
            headers: {Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            },
        });
        toast.success("Application submitted successfully!");
        setTimeout(() => {
            navigate("/volunteer/eventsection");
        }, 1500);
    }
    
    catch(err){
        console.error(err);
        toast.error("Failed to submit the application.");
    }finally{
        setSubmitting(false);
    }
  }

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
    };

  const age = calculateAge(birthday);
  const disabledBtn = age < event.minAge || age > event.maxAge;

  if(!showApplication){
    return (
        <div className="flex justify-center items-center bg-neutral-100 px-4 py-12 md:px-20 lg:px-40">
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
            <p><strong>Event Duration:</strong>{" "}
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

            {/* Minimum Commitment Days with tooltip */}
            <p className="flex items-center space-x-2">
                <strong>Minimum Commitment Days:</strong>
                <span>{event.minDay}</span>
                <div className="relative group cursor-pointer">
                {/* Info icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 12v.01" />
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {`To gain a certificate you have to work ${event.minDay} days, but you can volunteer for any number of days if you don't intend to gain a certificate`}
                </div>
                </div>
            </p>

            <p><strong>Total Opportunities:</strong> {event.opportunity}</p>
            </div>

            {/* Apply Button Placeholder */}
            <div className="mt-6">
            <button 
            onClick={handleProceed}
            className="w-full bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 transition">
                Proceed →
            </button>
            </div>
        </div>
        </div>
    );
    };
return(
    <div className="flex justify-center items-center bg-neutral-100 px-4 py-12 md:px-20 lg:px-40">
        <div className="w-full max-w-3xl p-6 rounded-xl shadow-md bg-white relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">Application</h2>
                <button 
                    onClick={() => 
                        setShowApplication(false)
                    }
                    className="text-blue-600 hover:underline"
                >
                    ← Back
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-medium">Name</label>
                    <input
                        type="text"
                        value={name}
                        readOnly
                        className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Age</label>
                    <input
                        type="text"
                        value={calculateAge(birthday)}
                        readOnly
                        className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none"
                    />

                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Email</label>
                    <input
                        type="email"
                        value={contactEmail}
                        readOnly
                        className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Phone</label>
                    <input
                        type="tel"
                        value={phone}
                        readOnly
                        className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none"
                    />
                </div>
                {event.qualification === "Required" && 
                (
                    <div>
                    <label className="block text-gray-700 font-medium">Qualifications</label>
                    <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => setQualificationFile(e.target.files[0])}
                        className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none"
                    />
                </div>
                )
                }
                <div>
                    {error && <p className="text-red-600 my-3">{error}</p>}
                    {disabledBtn &&
                    <p className="text-red-600 text-sm my-3">
                        You do not meet the age requirement for this event.
                    </p>
                    }
                    <button 
                    className="w-full bg-sky-600 px-4 py-2 text-white rounded-lg hover:bg-sky-700"
                    disabled={disabledBtn || submitting}
                    >
                    {submitting ? "Submitting" : "Submit"}</button>
                </div>
            </form>
        </div>
    </div>
);
}
