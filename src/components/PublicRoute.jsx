import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useEffect } from "react";
import { PageHeader } from "./shared/PageHeader";

export function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  // Wait for authentication check to complete
  if (isLoading) {
    return (
      <div className="min-h-screen relative" style={{ backgroundColor: '#d3f4ee' }}>
        {/* Header */}
        <PageHeader
          zIndex="z-50"
        />
        
        {/* Loading Content */}
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-gray-900 text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  // If user is already authenticated, redirect to industry selection
  if (isAuthenticated) {
    return <Navigate to="/industry" replace />;
  }

  return children;
}

