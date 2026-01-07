import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";

export default function Landing() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const { setUser, setToken } = useUser();

  // Fetch public events
  useEffect(() => {
    const fetchPublicEvents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/events/public`);
        setEvents(res.data.slice(0, 6));
      } catch (err) {
        console.error("Failed to load public events");
      }
    };
    fetchPublicEvents();
  }, [API_BASE_URL]);

  // Check if user is logged in
  useEffect(() => {
    const redirectIfLoggedIn = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // Not logged in, stay on landing

      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data.user;
        setUser(user);
        setToken(token);

        // Redirect by role
        if (user.role === "ADMIN") navigate("/admin", { replace: true });
        else if (user.role === "ORG_ADMIN") navigate("/org", { replace: true });
        else navigate("/volunteer", { replace: true });

      } catch (err) {
        console.log("Token invalid or expired", err);
        localStorage.removeItem("token"); // remove invalid token
      }
    };

    redirectIfLoggedIn();
  }, [API_BASE_URL, navigate, setUser, setToken]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <h1 className="text-xl font-bold text-sky-700">VolunteerHub</h1>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-700 hover:text-sky-600">
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700"
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sky-600 to-blue-700 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Be the Change. <br /> Volunteer for What Matters.
          </h2>
          <p className="text-lg md:text-xl text-sky-100 mb-10">
            Explore verified volunteer opportunities and make a real impact in
            your community.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="bg-white text-sky-700 font-semibold px-8 py-3 rounded-md hover:bg-gray-100"
            >
              Join as a Volunteer
            </Link>
            <button
              onClick={() => navigate("/login")}
              className="border border-white px-8 py-3 rounded-md hover:bg-white hover:text-sky-700 transition"
            >
              Login to Continue
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sky-100">
            <div>
              <p className="text-3xl font-bold">100+</p>
              <p className="text-sm">Active Events</p>
            </div>
            <div>
              <p className="text-3xl font-bold">50+</p>
              <p className="text-sm">Partner Organizations</p>
            </div>
            <div>
              <p className="text-3xl font-bold">1,000+</p>
              <p className="text-sm">Volunteers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-semibold text-center mb-12">
          Upcoming Volunteer Opportunities
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-2xl shadow-md p-6 hover:-translate-y-1 hover:shadow-xl transition relative"
            >
              <span className="inline-block text-xs bg-sky-100 text-sky-700 px-3 py-1 rounded-full mb-3">
                {event.eventType} &nbsp;Event
              </span>

              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {event.eventName}
              </h4>

              <p className="text-sm text-gray-600 mb-1">
                📍 {event.location}, {event.city}
              </p>

              <p className="text-sm text-gray-500 mb-4">
                🗓{" "}
                {new Date(event.startDate).toLocaleDateString()} –{" "}
                {new Date(event.endDate).toLocaleDateString()}
              </p>

              <button
                onClick={() => navigate("/login")}
                className="mt-auto w-full bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700"
              >
                Login to Apply →
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            Want to see more opportunities?
          </p>
          <Link
            to="/signup"
            className="text-sky-600 font-semibold hover:underline"
          >
            Create an account to explore all events →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6 border-t">
        © {new Date().getFullYear()} VolunteerHub. All rights reserved.
      </footer>
    </div>
  );
}
