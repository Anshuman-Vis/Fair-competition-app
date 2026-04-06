import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaUsers,
  FaClipboardList,
  FaUserCheck,
  FaSignOutAlt,
  FaPlus,
  FaTrash,
  FaSearch,
  FaUser,
  FaTrophy
} from 'react-icons/fa';
import api from '../services/api';

/**
 * Admin Dashboard Component
 *
 * Comprehensive admin interface for managing users, quizzes, and assignments.
 * Provides full CRUD operations for quiz assignment system.
 *
 * Features:
 * - User management with search and filtering
 * - Quiz management overview
 * - Assignment creation and removal
 * - Real-time assignment tracking
 * - Role-based access control
 */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('assignments');
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const navigate = useNavigate();

  /**
   * Fetches all admin data on component mount
   */
  useEffect(() => {
    fetchAdminData();
  }, []);

  /**
   * Fetches users, quizzes, and assignments data
   */
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, quizzesRes, assignmentsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/quizzes'),
        api.get('/admin/assignments')
      ]);
      setUsers(usersRes.data.users || []);
      setQuizzes(quizzesRes.data.quizzes || []);
      setAssignments(assignmentsRes.data.assignments || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles quiz assignment creation
   */
  const handleAssignQuiz = async () => {
    if (!selectedUser || !selectedQuiz) return;

    try {
      await api.post('/admin/assignments', {
        user_id: selectedUser.id,
        quiz_id: selectedQuiz.id
      });
      setShowAssignModal(false);
      setSelectedUser(null);
      setSelectedQuiz(null);
      fetchAdminData(); // Refresh data
    } catch (err) {
      console.error('Error assigning quiz:', err);
      alert('Failed to assign quiz');
    }
  };

  /**
   * Handles assignment removal
   */
  const handleRemoveAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to remove this assignment?')) return;

    try {
      await api.delete(`/admin/assignments/${assignmentId}`);
      fetchAdminData(); // Refresh data
    } catch (err) {
      console.error('Error removing assignment:', err);
      alert('Failed to remove assignment');
    }
  };

  /**
   * Filters users based on search term
   */
  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.roll_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Handles secure logout
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <motion.div
          className="text-white text-2xl flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          Loading Admin Panel...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
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
            <h1 className="text-4xl font-bold bg-linear-to-br from-red-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
              <FaUserCheck className="text-red-400" />
              Admin Control Center
            </h1>
            <p className="text-slate-300 mt-1">Manage Users, Quizzes & Assignments</p>
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
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <motion.div
          className="flex gap-4 mb-8 border-b border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { id: 'assignments', label: 'Assignments', icon: FaUserCheck },
            { id: 'users', label: 'Users', icon: FaUsers },
            { id: 'quizzes', label: 'Quizzes', icon: FaClipboardList }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white border-b-2 border-purple-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <FaUserCheck className="text-purple-400" />
                Quiz Assignments
              </h2>
              <motion.button
                onClick={() => setShowAssignModal(true)}
                className="bg-linear-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus />
                Assign Quiz
              </motion.button>
            </div>

            <div className="grid gap-4">
              {assignments.map((assignment, index) => (
                <motion.div
                  key={assignment.id}
                  className="bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-600/50 hover:border-purple-400/40 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                        <FaUser className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{assignment.user?.full_name}</h3>
                        <p className="text-slate-300">{assignment.user?.roll_number} • {assignment.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <h4 className="text-lg font-semibold text-purple-300">{assignment.quiz?.title}</h4>
                        <p className="text-slate-400 text-sm">
                          Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}
                        </p>
                      </div>
                      <motion.button
                        onClick={() => handleRemoveAssignment(assignment.id)}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaTrash />
                        Remove
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {assignments.length === 0 && (
                <div className="bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg p-8 rounded-2xl text-center border border-slate-600/50">
                  <FaUserCheck className="text-slate-400 text-4xl mx-auto mb-4" />
                  <p className="text-slate-300 text-lg">No assignments yet</p>
                  <p className="text-slate-400 text-sm mt-2">Click "Assign Quiz" to get started</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <FaUsers className="text-blue-400" />
                User Management
              </h2>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800 border border-slate-600 text-white placeholder-slate-400 px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  className="bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-600/50 hover:border-blue-400/40 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <FaUser className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{user.full_name}</h3>
                        <p className="text-slate-300">{user.roll_number} • {user.email}</p>
                        <p className="text-slate-400 text-sm">Role: {user.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.is_disqualified
                          ? 'bg-red-600 text-white'
                          : 'bg-green-600 text-white'
                      }`}>
                        {user.is_disqualified ? 'Disqualified' : 'Active'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <FaClipboardList className="text-green-400" />
              Quiz Management
            </h2>

            <div className="grid gap-4">
              {quizzes.map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  className="bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-600/50 hover:border-green-400/40 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-white">{quiz.title}</h3>
                      <p className="text-slate-300 mb-2">{quiz.description}</p>
                      <div className="flex gap-4 text-sm text-slate-400">
                        <span>Duration: {quiz.duration} mins</span>
                        <span>Questions: {quiz.question_count}</span>
                        <span>Marks: {quiz.total_marks}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        quiz.is_active
                          ? 'bg-green-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}>
                        {quiz.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-slate-800 p-8 rounded-2xl w-full max-w-md mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <FaPlus className="text-green-400" />
              Assign Quiz
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">Select Student</label>
                <select
                  value={selectedUser?.id || ''}
                  onChange={(e) => setSelectedUser(users.find(u => u.id === parseInt(e.target.value)))}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a student...</option>
                  {users.filter(u => u.role === 'student').map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name} ({user.roll_number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Select Quiz</label>
                <select
                  value={selectedQuiz?.id || ''}
                  onChange={(e) => setSelectedQuiz(quizzes.find(q => q.id === parseInt(e.target.value)))}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a quiz...</option>
                  {quizzes.filter(q => q.is_active).map(quiz => (
                    <option key={quiz.id} value={quiz.id}>
                      {quiz.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <motion.button
                onClick={handleAssignQuiz}
                disabled={!selectedUser || !selectedQuiz}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaPlus />
                Assign
              </motion.button>
              <motion.button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedUser(null);
                  setSelectedQuiz(null);
                }}
                className="flex-1 bg-slate-600 hover:bg-slate-700 px-6 py-3 rounded-xl font-semibold transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;