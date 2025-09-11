import { Link } from "react-router-dom";
export default function Landing() {
  return (
    <div className="min-h-screen text-gray-800 flex items-start justify-end space-x-6 bg-gray-100 p-5">
      <Link to="/login" className="hover:underline text-lg">Login</Link>
      <Link to="/signup" className="hover:underline text-lg">Sign up</Link>
    </div>
  );
}