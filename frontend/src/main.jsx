import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

/**
 * Main Entry Point
 *
 * Initializes the React application and mounts it to the DOM.
 * Configures React Strict Mode for development warnings and optimizations.
 *
 * Performance Optimizations:
 * - Uses React 18's createRoot for concurrent features
 * - Strict Mode enabled for development (automatically removed in production)
 * - CSS imports optimized by Vite bundler
 *
 * Security Considerations:
 * - No sensitive data exposed in client-side code
 * - All authentication handled through secure API endpoints
 */

// Create React root and render the application
// React 18's createRoot enables concurrent features and automatic batching
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
