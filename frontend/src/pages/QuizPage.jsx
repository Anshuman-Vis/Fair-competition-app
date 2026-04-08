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
  <div style={{
    display: "flex",
    height: "100vh",
    background: "#f8fafc",
    fontFamily: "system-ui"
  }}>

    <Proctor competitionId={quizId} onDisqualify={() => navigate('/')} />

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
          Quiz Arena
        </h2>
      </div>

      <div style={{ padding: "10px" }}>

        <div
          style={{ padding: "10px", cursor: "pointer" }}
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </div>

        <div
          style={{
            padding: "10px",
            background: "#e6f1fb"
          }}
        >
          Quiz
        </div>

        <div
          style={{ padding: "10px", cursor: "pointer" }}
          onClick={() => navigate('/results')}
        >
          Results
        </div>

      </div>

    </div>


    {/* Main */}
    <div style={{
      flex: 1,
      padding: "20px",
      overflow: "auto"
    }}>

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
        border: "1px solid #e5e7eb"
      }}>

        <div>
          <h1 style={{
            fontSize: "22px",
            fontWeight: "600"
          }}>
            {quiz.title}
          </h1>

          <p style={{
            color: "#6b7280",
            marginTop: "5px"
          }}>
            {quiz.description}
          </p>
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
      <div>

        {quiz.questions && quiz.questions.map((q, idx) => (

          <div
            key={q.id}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "15px",
              border: "1px solid #e5e7eb"
            }}
          >

            <h3 style={{
              marginBottom: "15px",
              fontWeight: "600"
            }}>
              Question {idx + 1}: {q.text}
            </h3>

            {q.options && q.options.map((option, optIdx) => (

              <label
                key={optIdx}
                style={{
                  display: "flex",
                  padding: "10px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  marginBottom: "8px",
                  cursor: "pointer"
                }}
              >

                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={option}
                  checked={answers[q.id] === option}
                  onChange={() => handleAnswerChange(q.id, option)}
                  style={{ marginRight: "10px" }}
                />

                {option}

              </label>

            ))}

          </div>

        ))}

      </div>


      {/* Submit */}
      <div style={{
        textAlign: "center",
        marginTop: "20px"
      }}>

        <button
          onClick={handleSubmit}
          style={{
            background: "#22c55e",
            color: "white",
            padding: "12px 30px",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Submit Quiz
        </button>

      </div>

    </div>

  </div>
);
};

export default QuizPage;