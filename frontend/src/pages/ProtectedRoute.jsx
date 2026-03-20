import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useUser();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
