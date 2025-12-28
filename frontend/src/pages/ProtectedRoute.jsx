import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useUser();

  // Wait until user is loaded
  if (loading) return null;

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based protection
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
