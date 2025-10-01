import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import EventDetailsList from '../components/EventDetailsList';
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
            <EventDetailsList event={event} handleProceed={handleProceed}/>
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
                    <div className="flex items-center space-x-2 relative group">
                        <label className="block text-gray-700 font-medium">Qualifications</label>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-500 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>

                        <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            {`For this event, you have to submit ${event.qualificationType} qualification.`}
                        </div>
                    </div>

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
