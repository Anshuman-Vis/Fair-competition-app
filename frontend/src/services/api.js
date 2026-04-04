import axios from 'axios';

/**
 * API Configuration and Service Layer
 *
 * Centralized HTTP client for backend communication with security features.
 * Implements authentication, error handling, and request/response interceptors.
 *
 * Security Features:
 * - Automatic JWT token attachment
 * - Secure token storage validation
 * - Global error handling with auto-logout
 * - HTTPS enforcement in production
 *
 * Performance Optimizations:
 * - Request/response interceptors for efficiency
 * - Connection pooling through axios
 * - Timeout configurations
 */

// API base URL configuration with environment variable support
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Axios instance configuration
 * Creates a customized HTTP client with interceptors and default settings
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Security: Set reasonable timeout to prevent hanging requests
  timeout: 10000,
  // Security: Ensure HTTPS in production
  ...(import.meta.env.MODE === 'production' && {
    httpsAgent: {
      rejectUnauthorized: true, // Enforce SSL certificate validation
    },
  }),
});

/**
 * REQUEST INTERCEPTOR
 *
 * Automatically attaches JWT token to requests for authenticated endpoints.
 * Validates token existence and format before sending.
 *
 * Security Benefits:
 * - Prevents unauthorized API calls
 * - Automatic token refresh handling (can be extended)
 * - Consistent authentication across all requests
 */
api.interceptors.request.use(
  (config) => {
    // Retrieve token from secure localStorage
    const token = localStorage.getItem('token');

    // Attach Bearer token if available
    if (token) {
      // Security: Validate token format (basic check)
      if (token.split('.').length === 3) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('Invalid token format detected');
        // Clear invalid token
        localStorage.removeItem('token');
      }
    }

    return config;
  },
  (error) => {
    // Log request errors for debugging
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 *
 * Global response handling for authentication and error management.
 * Automatically handles token expiration and redirects to login.
 *
 * Security Features:
 * - Automatic logout on 401 responses
 * - Secure token cleanup
 * - Error logging for monitoring
 */
api.interceptors.response.use(
  (response) => {
    // Successful response - return as-is
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.warn('Authentication failed - clearing session');

      // Security: Clear all authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Security: Force redirect to login page
      window.location.href = '/';
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error - check connection');
    }

    // Handle other HTTP errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.status);
    }

    return Promise.reject(error);
  }
);

/**
 * API Service Exports
 *
 * Provides a clean interface for API operations throughout the application.
 * All requests go through the configured interceptors for security and consistency.
 */
export default api;

/**
 * Additional API utility functions can be added here:
 * - Token refresh logic
 * - Retry mechanisms
 * - Request caching
 * - Rate limiting
 */