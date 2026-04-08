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
  <div style={{
    display: "flex",
    height: "100vh",
    background: "#f8fafc",
    fontFamily: "system-ui"
  }}>

    {/* Left Panel */}
    <div style={{
      flex: 1,
      background: "#185fa5",
      color: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "60px"
    }}>

      <h1 style={{
        fontSize: "32px",
        fontWeight: "700",
        marginBottom: "10px"
      }}>
        FairComp
      </h1>

      <p style={{
        fontSize: "16px",
        opacity: "0.9"
      }}>
        Fair Competition Exam Platform
      </p>

      <div style={{
        marginTop: "40px",
        fontSize: "14px",
        opacity: "0.8"
      }}>
        Secure • Proctored • Professional
      </div>

    </div>


    {/* Register Form */}
    <div style={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>

      <form
        onSubmit={handleRegister}
        style={{
          width: "400px",
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          border: "1px solid #e5e7eb"
        }}
      >

        <h2 style={{
          fontSize: "22px",
          fontWeight: "600",
          marginBottom: "20px"
        }}>
          Create Account
        </h2>

        {errors.general && (
          <div style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "15px"
          }}>
            {errors.general}
          </div>
        )}

        {/* Full Name */}
        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="Full Name"
            value={form.full_name}
            onChange={(e)=>updateForm("full_name",e.target.value)}
            onBlur={()=>handleBlur("full_name")}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px"
            }}
          />
        </div>


        {/* Roll Number */}
        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="Roll Number"
            value={form.roll_number}
            onChange={(e)=>updateForm("roll_number",e.target.value)}
            onBlur={()=>handleBlur("roll_number")}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px"
            }}
          />
        </div>


        {/* Email */}
        <div style={{ marginBottom: "12px" }}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e)=>updateForm("email",e.target.value)}
            onBlur={()=>handleBlur("email")}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px"
            }}
          />
        </div>


        {/* Password */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e)=>updateForm("password",e.target.value)}
            onBlur={()=>handleBlur("password")}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px"
            }}
          />
        </div>


        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: "#185fa5",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>


        <div style={{
          marginTop: "15px",
          textAlign: "center",
          fontSize: "14px"
        }}>
          Already have account?{" "}
          <Link to="/" style={{
            color: "#185fa5",
            fontWeight: "600"
          }}>
            Login
          </Link>
        </div>

      </form>

    </div>

  </div>
);
};

export default Register;
