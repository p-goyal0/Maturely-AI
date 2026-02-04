import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import HomePage from "./components/pages/HomePage";
import { IndustrySelectionPage } from "./components/pages/IndustrySelectionPage";
import { CompanyTypePage } from "./components/pages/CompanyTypePage";
import { CompanyInfoPage } from "./components/pages/CompanyInfoPage";
import { AssessmentsDashboard } from "./components/pages/AssessmentsDashboard";
import { AssessmentListPage } from "./components/pages/AssessmentListPage";
import { CompletedAssessmentsPage } from "./components/pages/CompletedAssessmentsPage";
import { ComparisonAssessmentResultsPage } from "./components/pages/ComparisonAssessmentsResultPage";
import { OfferingsPage } from "./components/pages/OfferingsPage";
import { ResultsDashboard } from "./components/pages/ResultsDashboard";
import { RoadmapGenerator } from "./components/pages/RoadmapGenerator";
import { UseCaseLibrary } from "./components/pages/UseCaseLibrary";
import { ProjectInitiationPage } from "./components/pages/ProjectInitiationPage";
import { UseCasesBankPage } from "./components/pages/UseCasesBankPage";
import { RoleManagementPage } from "./components/pages/RoleManagementPage";
import { TeamManagementPage } from "./components/pages/TeamManagementPage";
import { SettingsPage } from "./components/pages/SettingsPage";
import { LoginPage } from "./components/pages/LoginPage";
import { SignInPage } from "./components/pages/SignInPage";
import { SignUpPage } from "./components/pages/SignUpPage";
import { CreatePasswordPage } from "./components/pages/CreatePasswordPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { AdminRoute } from "./components/AdminRoute";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen gradient-mesh">
        <Routes>
          {/* Public Routes - Redirect authenticated users to home */}
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SignInPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUpPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          {/* Standalone Create Password – no auth required */}
          <Route path="/create-password" element={<CreatePasswordPage />} />

          {/* Public Landing Page */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <HomePage />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/industry"
            element={
              <ProtectedRoute>
                <IndustrySelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company-type"
            element={
              <ProtectedRoute>
                <CompanyTypePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company-info"
            element={
              <ProtectedRoute>
                <CompanyInfoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offerings"
            element={
              <ProtectedRoute>
                <OfferingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-assessments"
            element={
              <ProtectedRoute>
                <AssessmentListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/completed-assessments"
            element={
              <ProtectedRoute>
                <CompletedAssessmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/comparison-assessment-results"
            element={
              <ProtectedRoute>
                <ComparisonAssessmentResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessments"
            element={
              <ProtectedRoute>
                <AssessmentsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <ResultsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <RoadmapGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usecases"
            element={
              <ProtectedRoute>
                <UseCaseLibrary />
              </ProtectedRoute>
            }
          />
          {/* Standalone: Project Initiation / Studio — choose new use case vs start from scratch */}
          <Route path="/studio" element={<ProjectInitiationPage />} />
          {/* Use Case Explorer / Inspire Me — list from API, expandable cards */}
          <Route path="/use-case-explorer" element={<UseCasesBankPage />} />
          <Route
            path="/role-management"
            element={
              <AdminRoute>
                <RoleManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path="/team-management"
            element={
              <AdminRoute>
                <TeamManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <AdminRoute>
                <SettingsPage />
              </AdminRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
