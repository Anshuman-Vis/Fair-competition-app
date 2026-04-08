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
  <div style={{
    display: "flex",
    height: "100vh",
    background: "#f8fafc",
    fontFamily: "system-ui"
  }}>

    {/* Sidebar */}
    <div style={{
      width: "230px",
      background: "#ffffff",
      borderRight: "1px solid #e5e7eb",
      display: "flex",
      flexDirection: "column"
    }}>
      
      <div style={{
        padding: "20px",
        borderBottom: "1px solid #e5e7eb"
      }}>
        <h2 style={{ fontWeight: "700" }}>
          Admin Panel
        </h2>
      </div>

      <div style={{ padding: "10px" }}>

        <div 
          style={{
            padding: "10px",
            cursor: "pointer",
            background: activeTab === "assignments" ? "#e6f1fb" : ""
          }}
          onClick={()=>setActiveTab("assignments")}
        >
          Assignments
        </div>

        <div 
          style={{
            padding: "10px",
            cursor: "pointer",
            background: activeTab === "users" ? "#e6f1fb" : ""
          }}
          onClick={()=>setActiveTab("users")}
        >
          Users
        </div>

        <div 
          style={{
            padding: "10px",
            cursor: "pointer",
            background: activeTab === "quizzes" ? "#e6f1fb" : ""
          }}
          onClick={()=>setActiveTab("quizzes")}
        >
          Quizzes
        </div>

      </div>

      <div style={{
        marginTop: "auto",
        padding: "20px"
      }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "10px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

    </div>


    {/* Main */}
    <div style={{
      flex: 1,
      padding: "20px",
      overflow: "auto"
    }}>

      <h1 style={{
        fontSize: "22px",
        fontWeight: "600",
        marginBottom: "20px"
      }}>
        Admin Dashboard
      </h1>


      {/* Assignments */}
      {activeTab === "assignments" && (
        <div>
          <button
            onClick={()=>setShowAssignModal(true)}
            style={{
              padding: "10px 15px",
              background: "#185fa5",
              color: "white",
              border: "none",
              borderRadius: "6px",
              marginBottom: "20px",
              cursor: "pointer"
            }}
          >
            Assign Quiz
          </button>

          {assignments.map((assignment)=>(
            <div
              key={assignment.id}
              style={{
                background: "white",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                marginBottom: "10px"
              }}
            >
              <div>
                {assignment.user?.full_name}
              </div>

              <div>
                {assignment.quiz?.title}
              </div>

              <button
                onClick={()=>handleRemoveAssignment(assignment.id)}
                style={{
                  marginTop: "10px",
                  padding: "6px 10px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "5px"
                }}
              >
                Remove
              </button>

            </div>
          ))}

        </div>
      )}


      {/* Users */}
      {activeTab === "users" && (
        <div>

          <input
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
            style={{
              padding: "10px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              marginBottom: "20px",
              width: "300px"
            }}
          />

          {filteredUsers.map((user)=>(
            <div
              key={user.id}
              style={{
                background: "white",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                marginBottom: "10px"
              }}
            >
              {user.full_name} - {user.email}
            </div>
          ))}

        </div>
      )}


      {/* Quizzes */}
      {activeTab === "quizzes" && (
        <div>

          {quizzes.map((quiz)=>(
            <div
              key={quiz.id}
              style={{
                background: "white",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                marginBottom: "10px"
              }}
            >
              {quiz.title}
            </div>
          ))}

        </div>
      )}

    </div>

  </div>
);
};

export default AdminDashboard;