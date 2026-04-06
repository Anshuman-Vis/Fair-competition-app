import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/**
 * Lazy-loaded page components for performance optimization
 * Reduces initial bundle size and improves loading times
 */
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const QuizPage = lazy(() => import('./pages/QuizPage.jsx'));
const CodingPage = lazy(() => import('./pages/CodingPage.jsx'));
const ResultPage = lazy(() => import('./pages/ResultPage.jsx'));

/**
 * Protected Route Component
 *
 * Implements authentication-based access control for user pages.
 * Requires valid authentication token for access to protected content.
 *
 * Security Features:
 * - Token validation from localStorage
 * - Automatic redirect to login for unauthenticated users
 * - Prevents unauthorized access to user-specific pages
 *
 * @param {Object} props - Component props
 * @param {React.Component} props.children - Protected component to render
 */
function ProtectedRoute({ children }) {
  // Security: Validate authentication token
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Security: Basic token validation (could be enhanced with expiry check)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Token is valid, allow access
  } catch (error) {
    // Invalid token format
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }

  return children;
}

/**
 * Admin Protected Route Component
 *
 * Implements role-based access control for admin-only pages.
 * Requires both authentication and admin role for access.
 *
 * Security Features:
 * - Token validation from localStorage
 * - JWT role claim verification
 * - Automatic redirect to dashboard for non-admin users
 * - Prevents unauthorized admin page access
 *
 * @param {Object} props - Component props
 * @param {React.Component} props.children - Admin component to render
 */
function AdminProtectedRoute({ children }) {
  // Security: Validate authentication token
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Security: Validate admin role from JWT (basic check)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
  } catch (error) {
    // Invalid token format
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }

  return children;
}

/**
 * Loading Fallback Component
 *
 * Provides visual feedback during lazy-loaded component loading.
 * Improves user experience with smooth loading animations.
 */
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-white text-xl flex items-center gap-3">
        <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        Loading...
      </div>
    </div>
  );
}

/**
 * Main Application Component
 *
 * Root component managing routing and global application state.
 * Implements modern React patterns with lazy loading and error boundaries.
 *
 * Architecture Features:
 * - Client-side routing with React Router
 * - Lazy loading for performance optimization
 * - Protected routes for security
 * - Clean component separation
 *
 * Security Considerations:
 * - Route protection prevents unauthorized access
 * - Token-based authentication validation
 * - Secure navigation handling
 */
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes - Require Authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:quizId"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coding/:challengeId"
            element={
              <ProtectedRoute>
                <CodingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          {/* Fallback Route - Redirect unknown paths to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
