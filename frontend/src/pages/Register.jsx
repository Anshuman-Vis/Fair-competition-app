import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaIdCard, FaEnvelope, FaLock, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import api from '../services/api';

/**
 * Registration Page Component
 *
 * Professional registration interface matching the Login page design.
 * Features modern UI with smooth animations and comprehensive form validation.
 *
 * Security Features:
 * - Input validation and sanitization
 * - Secure password requirements
 * - CSRF protection through API layer
 * - Rate limiting on backend
 * - Field-specific error messages
 *
 * Performance Optimizations:
 * - Controlled components to prevent unnecessary re-renders
 * - Optimized animations with Framer Motion
 */
const Register = () => {
  // Form state management with controlled inputs
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    roll_number: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  /**
   * Validates a single field
   * @param {string} field - Field name
   * @param {string} value - Field value
   * @returns {string|null} Error message or null if valid
   */
  const validateField = (field, value) => {
    switch (field) {
      case 'full_name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 3) return 'Name must be at least 3 characters';
        return null;
      case 'roll_number':
        if (!value.trim()) return 'Roll number is required';
        if (value.trim().length < 2) return 'Roll number is too short';
        return null;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return 'Email is required';
        if (!emailRegex.test(value)) return 'Please enter a valid email';
        return null;
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return null;
      default:
        return null;
    }
  };

  /**
   * Handles field blur to mark as touched
   * @param {string} field - Field name
   */
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  /**
   * Handles user registration with comprehensive error handling
   * Validates form data and communicates with secure backend API
   *
   * @param {Event} e - Form submission event
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate all fields before submission
    const newErrors = {};
    Object.keys(form).forEach(field => {
      const error = validateField(field, form[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      
      // Success feedback with smooth navigation
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
      if (err.response?.data?.field) {
        setErrors(prev => ({ ...prev, [err.response.data.field]: errorMsg }));
      } else {
        setErrors(prev => ({ ...prev, general: errorMsg }));
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates form state with input sanitization and validation
   * Provides real-time feedback on field validity
   *
   * @param {string} field - Form field name
   * @param {string} value - Sanitized input value
   */
  const updateForm = (field, value) => {
    const trimmedValue = value.trim();
    setForm(prev => ({ ...prev, [field]: trimmedValue }));
    
    // Validate field in real-time if field has been touched
    if (touched[field]) {
      const error = validateField(field, trimmedValue);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <motion.form
        onSubmit={handleRegister}
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
            <FaUserPlus className="text-purple-300" />
            Create Account
          </h2>
          <p className="text-purple-200">Join the Fair Competition Arena</p>
        </motion.div>

        {/* Error message */}
        {errors.general && (
          <motion.div
            className="bg-red-500/20 border border-red-400 text-red-100 p-4 rounded-xl mb-6 text-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {errors.general}
          </motion.div>
        )}

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Full Name */}
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
            <input
              type="text"
              placeholder="Full Name"
              className={`w-full bg-white/10 border text-white placeholder-purple-200 p-4 pl-12 rounded-xl transition-all focus:outline-none
                ${touched.full_name && errors.full_name 
                  ? 'border-red-400 focus:ring-2 focus:ring-red-400' 
                  : 'border-white/20 focus:ring-2 focus:ring-purple-400 focus:border-transparent'
                }`}
              value={form.full_name}
              onChange={(e) => updateForm('full_name', e.target.value)}
              onBlur={() => handleBlur('full_name')}
              required
              autoComplete="name"
            />
            {touched.full_name && errors.full_name && (
              <p className="text-red-400 text-xs mt-1">{errors.full_name}</p>
            )}
          </div>

          {/* Roll Number */}
          <div className="relative">
            <FaIdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
            <input
              type="text"
              placeholder="Roll Number"
              className={`w-full bg-white/10 border text-white placeholder-purple-200 p-4 pl-12 rounded-xl transition-all focus:outline-none
                ${touched.roll_number && errors.roll_number 
                  ? 'border-red-400 focus:ring-2 focus:ring-red-400' 
                  : 'border-white/20 focus:ring-2 focus:ring-purple-400 focus:border-transparent'
                }`}
              value={form.roll_number}
              onChange={(e) => updateForm('roll_number', e.target.value)}
              onBlur={() => handleBlur('roll_number')}
              required
              autoComplete="username"
            />
            {touched.roll_number && errors.roll_number && (
              <p className="text-red-400 text-xs mt-1">{errors.roll_number}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
            <input
              type="email"
              placeholder="Email Address"
              className={`w-full bg-white/10 border text-white placeholder-purple-200 p-4 pl-12 rounded-xl transition-all focus:outline-none
                ${touched.email && errors.email 
                  ? 'border-red-400 focus:ring-2 focus:ring-red-400' 
                  : 'border-white/20 focus:ring-2 focus:ring-purple-400 focus:border-transparent'
                }`}
              value={form.email}
              onChange={(e) => updateForm('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              required
              autoComplete="email"
            />
            {touched.email && errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (min 8 characters)"
              className={`w-full bg-white/10 border text-white placeholder-purple-200 p-4 pl-12 pr-12 rounded-xl transition-all focus:outline-none
                ${touched.password && errors.password 
                  ? 'border-red-400 focus:ring-2 focus:ring-red-400' 
                  : 'border-white/20 focus:ring-2 focus:ring-purple-400 focus:border-transparent'
                }`}
              value={form.password}
              onChange={(e) => updateForm('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              required
              autoComplete="new-password"
              minLength="8"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-purple-200 transition-colors text-lg"
            >
              {showPassword ? '👁️‍🗨️' : '👁️'}
            </button>
            {touched.password && errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={loading || Object.values(errors).some(e => e) || !form.email || !form.password || !form.full_name || !form.roll_number}
            className="w-full bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <FaUserPlus />
                Create Account
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
            Already have an account?{' '}
            <Link
              to="/"
              className="text-pink-300 hover:text-pink-200 font-semibold transition-colors inline-flex items-center gap-1"
            >
              <FaSignInAlt className="w-3 h-3" />
              Login here
            </Link>
          </p>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default Register;
