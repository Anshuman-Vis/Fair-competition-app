import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get('/auth/me');
        setUser(userRes.data);

        const quizzesRes = await api.get('/quiz/all');
        setQuizzes(quizzesRes.data.quizzes || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const startQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">🎯 Fair Competition Arena</h1>
            <p className="text-slate-300 mt-1">Welcome, {user?.full_name || 'Student'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-700 p-6 rounded-lg border border-slate-600">
            <h3 className="text-slate-300 text-sm font-semibold">Total Quizzes</h3>
            <p className="text-4xl font-bold text-blue-400 mt-2">{quizzes.length}</p>
          </div>
          <div className="bg-slate-700 p-6 rounded-lg border border-slate-600">
            <h3 className="text-slate-300 text-sm font-semibold">Roll Number</h3>
            <p className="text-2xl font-bold text-green-400 mt-2">{user?.roll_number}</p>
          </div>
          <div className="bg-slate-700 p-6 rounded-lg border border-slate-600">
            <h3 className="text-slate-300 text-sm font-semibold">Status</h3>
            <p className="text-2xl font-bold text-yellow-400 mt-2">Ready</p>
          </div>
        </div>

        {/* Available Quizzes */}
        <div>
          <h2 className="text-2xl font-bold mb-6">📚 Available Quizzes</h2>
          {quizzes.length === 0 ? (
            <div className="bg-slate-700 p-8 rounded-lg text-center border border-slate-600">
              <p className="text-slate-300 text-lg">No quizzes available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-gradient-to-br from-slate-700 to-slate-800 p-6 rounded-lg border border-slate-600 hover:border-blue-500 transition cursor-pointer"
                  onClick={() => startQuiz(quiz.id)}
                >
                  <h3 className="text-xl font-bold text-white mb-2">{quiz.title}</h3>
                  <p className="text-slate-300 mb-4">{quiz.description}</p>
                  <div className="flex gap-4 text-sm text-slate-400 mb-4">
                    <span>⏱️ {quiz.duration} mins</span>
                    <span>❓ {quiz.question_count || 10} questions</span>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition">
                    Start Quiz
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View Results Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/results')}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold"
          >
            View My Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;