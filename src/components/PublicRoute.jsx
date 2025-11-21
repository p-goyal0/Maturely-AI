import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // If user is already authenticated, redirect to industry selection
  if (isAuthenticated) {
    return <Navigate to="/industry" replace />;
  }

  return children;
}

