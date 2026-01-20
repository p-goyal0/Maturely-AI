import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, currentUser } = useAuthStore();
  const location = useLocation();

  // Wait for authentication check to complete
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // If onboarding is complete, redirect away from onboarding pages
  const onboardingPages = ['/industry', '/company-type', '/company-info'];
  if (currentUser?.is_onboarding_complete === true && onboardingPages.includes(location.pathname)) {
    return <Navigate to="/offerings" replace />;
  }

  return children;
}

