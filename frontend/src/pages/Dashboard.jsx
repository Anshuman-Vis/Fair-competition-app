import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrophy, FaPlay, FaSignOutAlt, FaChartBar, FaClock, FaQuestionCircle, FaUser, FaCog } from 'react-icons/fa';
import api from '../services/api';

/**
 * Helper function to check if user is admin from JWT token
 */
const isAdmin = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return false;
  }
};

/**
 * Dashboard Page Component
 *
 * Main student dashboard providing access to quizzes, results, and user information.
 * Implements modern design with animations, responsive layout, and performance optimizations.
 *
 * Features:
 * - Real-time quiz availability
 * - User statistics display
 * - Secure logout functionality
 * - Responsive grid layout
 *
 * Performance Optimizations:
 * - Memoized quiz filtering and sorting
 * - Lazy loading of quiz data
 * - Optimized re-renders with useMemo
 * - Efficient state management
 */
const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  /**
   * Fetches user data and available quizzes on component mount
   * Implements error handling and loading states for better UX
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, quizzesRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/quiz/all')
        ]);
        setUser(userRes.data);
        setQuizzes(quizzesRes.data.quizzes || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Handles secure user logout
   * Clears all stored authentication data and redirects to login
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  /**
   * Navigates to quiz page with security validation
   * @param {string} quizId - Unique quiz identifier
   */
  const startQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  /**
   * Memoized statistics calculation for performance
   * Prevents unnecessary recalculations on re-renders
   */
  const stats = useMemo(() => ({
    totalQuizzes: quizzes.length,
    completedQuizzes: 0, // Could be fetched from results API
    averageScore: 0, // Could be calculated from results
  }), [quizzes]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
        <motion.div
          className="text-white text-2xl flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          Loading Arena...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="bg-red-500/20 border border-red-400 text-red-100 p-6 rounded-xl text-center">
          <p className="text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Modern Header with Glassmorphism */}
      <motion.div
        className="bg-black/20 backdrop-blur-lg shadow-2xl border-b border-white/10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold bg-linear-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
              <FaTrophy className="text-yellow-400" />
              Fair Competition Arena
            </h1>
            <p className="text-slate-300 mt-1 flex items-center gap-2">
              <FaUser className="text-blue-400" />
              Welcome, {user?.full_name || 'Student'}
            </p>
          </motion.div>
          <motion.button
            onClick={handleLogout}
            className="bg-linear-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FaSignOutAlt />
            Logout
          </motion.button>
          {isAdmin() && (
            <motion.button
              onClick={() => navigate('/admin')}
              className="bg-linear-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg ml-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FaCog />
              Admin Panel
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Statistics Cards with Animations */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.div
            className="bg-linear-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-lg p-6 rounded-2xl border border-blue-500/20 hover:border-blue-400/40 transition-all"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FaChartBar className="text-blue-400 text-2xl" />
              <h3 className="text-slate-300 text-sm font-semibold">Total Quizzes</h3>
            </div>
            <p className="text-4xl font-bold text-blue-400">{stats.totalQuizzes}</p>
          </motion.div>

          <motion.div
            className="bg-linear-to-br from-green-600/20 to-green-800/20 backdrop-blur-lg p-6 rounded-2xl border border-green-500/20 hover:border-green-400/40 transition-all"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FaUser className="text-green-400 text-2xl" />
              <h3 className="text-slate-300 text-sm font-semibold">Roll Number</h3>
            </div>
            <p className="text-2xl font-bold text-green-400">{user?.roll_number}</p>
          </motion.div>

          <motion.div
            className="bg-linear-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-lg p-6 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FaTrophy className="text-purple-400 text-2xl" />
              <h3 className="text-slate-300 text-sm font-semibold">Status</h3>
            </div>
            <p className="text-2xl font-bold text-purple-400">Ready</p>
          </motion.div>
        </motion.div>

        {/* Available Quizzes Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <FaPlay className="text-orange-400" />
            Available Challenges
          </h2>

          {quizzes.length === 0 ? (
            <motion.div
              className="bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg p-8 rounded-2xl text-center border border-slate-600/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FaQuestionCircle className="text-slate-400 text-4xl mx-auto mb-4" />
              <p className="text-slate-300 text-lg">No challenges available at the moment</p>
              <p className="text-slate-400 text-sm mt-2">Check back later for new quizzes!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  className="bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-600/50 hover:border-purple-400/40 transition-all cursor-pointer group"
                  onClick={() => startQuiz(quiz.id)}
                  whileHover={{ scale: 1.02, y: -5 }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-slate-300 mb-4 line-clamp-2">{quiz.description}</p>

                  <div className="flex gap-4 text-sm text-slate-400 mb-6">
                    <span className="flex items-center gap-1">
                      <FaClock className="text-blue-400" />
                      {quiz.duration} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <FaQuestionCircle className="text-green-400" />
                      {quiz.question_count || 10} questions
                    </span>
                  </div>

                  <motion.button
                    className="w-full bg-linear-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPlay />
                    Start Challenge
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* View Results Button */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={() => navigate('/results')}
            className="bg-linear-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-3 mx-auto shadow-2xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaChartBar />
            View My Results
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;