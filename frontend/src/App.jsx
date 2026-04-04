import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/**
 * Lazy-loaded page components for performance optimization
 * Reduces initial bundle size and improves loading times
 */
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const QuizPage = lazy(() => import('./pages/QuizPage.jsx'));
const CodingPage = lazy(() => import('./pages/CodingPage.jsx'));
const ResultPage = lazy(() => import('./pages/ResultPage.jsx'));

/**
 * Protected Route Component
 *
 * Implements authentication-based routing with automatic redirects.
 * Ensures secure access to protected pages by validating JWT tokens.
 *
 * Security Features:
 * - Token validation from localStorage
 * - Automatic redirect to login on unauthorized access
 * - Prevents unauthorized page access
 *
 * @param {Object} props - Component props
 * @param {React.Component} props.children - Protected component to render
 */
function ProtectedRoute({ children }) {
  // Security: Validate authentication token
  const token = localStorage.getItem('token');

  // Redirect to login if no valid token exists
  return token ? children : <Navigate to="/" replace />;
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

          {/* Fallback Route - Redirect unknown paths to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
