import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { DotSpinner } from "./ui/DotSpinner";

export function AdminRoute({ children }) {
  const { isAuthenticated, isLoading, currentUser } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <DotSpinner size="5rem" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Admin-only pages
  if (currentUser?.is_super_admin !== true) {
    return <Navigate to="/offerings" replace />;
  }

  return children;
}

