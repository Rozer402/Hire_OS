import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ToastContainer } from './components/ui/Toast';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Shared / Public Pages
import LandingPage from './pages/shared/LandingPage';
import { LoginPage } from './pages/shared/LoginPage';
import { RegisterPage } from './pages/shared/RegisterPage';
import { ForgotPasswordPage } from './pages/shared/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/shared/ResetPasswordPage';
import { JobsPage } from './pages/shared/JobsPage';
import { JobDetailPage } from './pages/shared/JobDetailPage';
import { ApplicationDetailPage } from './pages/shared/ApplicationDetailPage';

// Recruiter Pages
import { Dashboard as RecruiterDashboard } from './pages/recruiter/Dashboard';
import { PostJobPage } from './pages/recruiter/PostJobPage';
import { ApplicationsPage } from './pages/recruiter/ApplicationsPage';
import { InterviewsPage } from './pages/recruiter/InterviewsPage';
import { AnalyticsPage } from './pages/recruiter/AnalyticsPage';
import { CandidatesPage } from './pages/recruiter/CandidatesPage';
import { SettingsPage } from './pages/recruiter/SettingsPage';

// Candidate Pages
import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { MyApplicationsPage } from './pages/candidate/MyApplicationsPage';
import { MyInterviewsPage } from './pages/candidate/MyInterviewsPage';
import { ProfilePage } from './pages/shared/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Dashboard Layout Routes */}
        <Route element={<Layout />}>
          {/* Public but inside layout */}
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Recruiter - protected */}
          <Route element={<ProtectedRoute role="recruiter" />}>
            <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
            <Route path="/recruiter/post-job" element={<PostJobPage />} />
            <Route path="/recruiter/applications" element={<ApplicationsPage />} />
            <Route path="/recruiter/applications/:id" element={<ApplicationDetailPage />} />
            <Route path="/recruiter/interviews" element={<InterviewsPage />} />
            <Route path="/recruiter/analytics" element={<AnalyticsPage />} />
            <Route path="/recruiter/candidates" element={<CandidatesPage />} />
            <Route path="/recruiter/settings" element={<SettingsPage />} />
          </Route>

          {/* Candidate - protected */}
          <Route element={<ProtectedRoute role="candidate" />}>
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
            <Route path="/candidate/applications" element={<MyApplicationsPage />} />
            <Route path="/candidate/interviews" element={<MyInterviewsPage />} />
            <Route path="/candidate/interviews/:id" element={<MyInterviewsPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
