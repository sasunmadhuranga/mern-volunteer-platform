import { useState } from "react";
import { Link } from 'react-router-dom';
export default function Signup() {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "VOLUNTEER",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Registration successful!");
        setMessageType("success");

        // Clear form
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "VOLUNTEER",
        });
      } else {
        setMessage(data.message || "Something went wrong.");
        setMessageType("error");
      }

    } catch (error) {
      setMessage("Could not reach the server.");
      setMessageType("error");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Sign Up
        </h2>

        {message && (
          <div
            className={`text-sm font-medium mb-4 text-center px-4 py-2 rounded ${
              messageType === "success"
                ? "text-green-700 bg-green-100"
                : "text-red-700 bg-red-100"
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex space-x-2 mb-4">
          <button
            type="button"
            onClick={() => handleRoleSelect("VOLUNTEER")}
            className={`flex-1 py-2 font-semibold rounded-lg border ${
              formData.role === "VOLUNTEER"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            Volunteer
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect("ORG_ADMIN")}
            className={`flex-1 py-2 border font-semibold rounded-lg ${
              formData.role === "ORG_ADMIN"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            Org Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            value={formData.name}
            required
            className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            required
            className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            required
            className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign Up as {formData.role === "VOLUNTEER" ? "Volunteer" : "Org Admin"}
          </button>
          <h1 className="text-center">Have an account? {" "} 
            <Link to="/login" className="text-blue-500 font-bold hover:underline">
              Log in
            </Link>

          </h1>
        </form>
      </div>
    </div>
  );
}
