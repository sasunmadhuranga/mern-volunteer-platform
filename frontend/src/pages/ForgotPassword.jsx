import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || "Request sent.");
      setMessageType(res.ok ? "success" : "error");
      if (res.ok) setEmail("");
    } catch (err) {
      console.error(err);
      setMessage("Server error, please try again later.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>

        {message && (
          <p
            className={`text-center mb-4 ${
              messageType === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <label htmlFor="email" className="sr-only">Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          required
          className="w-full border p-2 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded-lg ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="text-center mt-4 text-sm">
          <Link to="/login" className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}
