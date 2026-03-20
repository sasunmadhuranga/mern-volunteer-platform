import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Reset link sent! Check your email.");
        setEmail(""); 
      } else {
        toast.error(data.message || "Failed to send reset link.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error, please try again later.");
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

        <label htmlFor="email" className="sr-only">
          Email Address
        </label>
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
