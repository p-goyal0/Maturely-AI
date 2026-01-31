import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useEffect } from "react";
import { PageHeader } from "./shared/PageHeader";
import CubeLoader from "./ui/CubeLoader";

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
        <div className="flex flex-col items-center justify-center min-h-screen pt-20 gap-4">
          <CubeLoader size={48} />
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

