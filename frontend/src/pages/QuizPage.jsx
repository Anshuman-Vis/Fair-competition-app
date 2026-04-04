import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Timer from '../components/Timer.jsx';
import Proctor from '../components/Proctor.jsx';

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quiz/${quizId}/start`);
        setQuiz(res.data.quiz);
        setTimeRemaining(res.data.time_remaining || res.data.quiz.duration * 60);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        alert('Failed to load quiz');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId, navigate]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    if (!window.confirm('Are you sure you want to submit?')) return;
    try {
      await api.post(`/quiz/${quizId}/submit`, { answers });
      alert('Quiz submitted successfully!');
      navigate('/results');
    } catch (err) {
      alert('Error submitting quiz: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-2xl">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-2xl">Quiz not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <Proctor competitionId={quizId} onDisqualify={() => navigate('/')} />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-slate-800 p-6 rounded-lg">
          <div>
            <h1 className="text-3xl font-bold">{quiz.title}</h1>
            <p className="text-slate-300 mt-2">{quiz.description}</p>
          </div>
          <Timer
            initialSeconds={timeRemaining}
            onTimeUp={() => {
              alert('Time is up! Auto-submitting...');
              handleSubmit();
            }}
          />
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {quiz.questions && quiz.questions.map((q, idx) => (
            <div key={q.id} className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h3 className="text-lg font-bold mb-4">
                Question {idx + 1}: {q.text}
              </h3>
              <div className="space-y-2">
                {q.options &&
                  q.options.map((option, optIdx) => (
                    <label key={optIdx} className="flex items-center cursor-pointer hover:bg-slate-700 p-2 rounded">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={option}
                        checked={answers[q.id] === option}
                        onChange={() => handleAnswerChange(q.id, option)}
                        className="mr-3"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-bold text-lg"
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;