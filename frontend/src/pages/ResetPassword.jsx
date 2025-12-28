import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/reset-password/${resetToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );
      const data = await res.json();
      setMessage(data.message || "Operation completed.");
      setMessageType(res.ok ? "success" : "error");

      if (res.ok) setTimeout(() => navigate("/login"), 1500);
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
        <h2 className="text-xl font-bold mb-4 text-center">Reset Password</h2>

        {message && (
          <p
            className={`text-center mb-4 ${
              messageType === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <label htmlFor="password" className="sr-only">
          New Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="New password"
          required
          minLength={8}
          className="w-full border p-2 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded-lg ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
