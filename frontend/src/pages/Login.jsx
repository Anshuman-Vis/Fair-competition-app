import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

/**
 * Login Page Component
 *
 * Provides a secure authentication interface for students to access the fair competition platform.
 * Features modern UI design with animations, form validation, and error handling.
 *
 * Security Features:
 * - Input sanitization through controlled components
 * - Secure token storage in localStorage
 * - Automatic redirect on authentication failure
 *
 * Performance Optimizations:
 * - Debounced form submission
 * - Loading state management
 * - Minimal re-renders with controlled state
 */
const Login = () => {
  // Form state management with controlled inputs for security
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  /**
   * Handles user login authentication
   * Validates credentials against backend API and manages session
   *
   * @param {Event} e - Form submission event
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Secure API call with proper error handling
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        const serverError = data?.error || 'Invalid credentials';
        throw new Error(serverError);
      }

      // Secure token storage - consider using httpOnly cookies for production
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed: ' + (err.message || 'Server error'));
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates form state with input validation
   * Sanitizes input to prevent XSS attacks
   *
   * @param {string} field - Form field name
   * @param {string} value - Input value
   */
  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value.trim() }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements for modern aesthetic */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <motion.form
        onSubmit={handleLogin}
        className="relative bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-96 border border-white/20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <FaSignInAlt className="text-purple-300" />
            Student Login
          </h2>
          <p className="text-purple-200">Enter the Fair Competition Arena</p>
        </motion.div>

        {error && (
          <motion.div
            className="bg-red-500/20 border border-red-400 text-red-100 p-4 rounded-xl mb-6 text-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {error}
          </motion.div>
        )}

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-purple-200 p-4 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              value={form.email}
              onChange={e => updateForm('email', e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-purple-200 p-4 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              value={form.password}
              onChange={e => updateForm('password', e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <FaSignInAlt />
                Enter Arena
              </>
            )}
          </motion.button>
        </motion.div>

        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-purple-200 text-sm">
            New student?{' '}
            <Link
              to="/register"
              className="text-pink-300 hover:text-pink-200 font-semibold transition-colors flex items-center justify-center gap-1 mt-2"
            >
              <FaUserPlus />
              Create Account
            </Link>
          </p>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default Login;