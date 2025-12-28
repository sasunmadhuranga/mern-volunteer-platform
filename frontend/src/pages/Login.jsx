import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();
  const { setUser, setToken } = useUser(); // grab setToken from context
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login successful!");
        setMessageType("success");

        // Save token and user data in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Update context
        setUser(data.user);
        setToken(data.token); // ✅ update context token too

        // Redirect based on role
        if (data.user.role === "ADMIN") navigate("/admin", { replace: true });
        else if (data.user.role === "ORG_ADMIN") navigate("/org", {replace: true});
        else navigate("/volunteer");

      } else {
        setMessage(data.message || "Invalid credentials.");
        setMessageType("error");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error, please try again later.");
      setMessageType("error");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Log in</h2>

        {message && (
          <div
            className={`text-sm font-medium text-center mb-4 py-2 px-4 rounded ${
              messageType === "success"
                ? "text-green-700 bg-green-100"
                : "text-red-700 bg-red-100"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-700">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 font-semibold hover:underline">
            Sign up
          </Link>
        </p>

        <p className="text-center mt-2">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  );
}
