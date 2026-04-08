import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ResultPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get('/quiz/last-result');
        setResult(res.data);
      } catch (err) {
        console.error('Error fetching result:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-2xl">Loading results...</div>
      </div>
    );
  }

  const score = result?.score || 0;
  const totalQuestions = result?.total_questions || 0;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const passed = percentage >= 60;

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
          Results
        </h2>
      </div>

      <div style={{ padding: "10px" }}>

        <div
          style={{ padding: "10px", cursor: "pointer" }}
        >
          <Link to="/dashboard" style={{ textDecoration: "none", color: "black" }}>
            Dashboard
          </Link>
        </div>

        <div
          style={{
            padding: "10px",
            background: "#e6f1fb"
          }}
        >
          Results
        </div>

      </div>

    </div>


    {/* Main */}
    <div style={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>

      <div style={{
        background: "white",
        padding: "40px",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        width: "500px",
        textAlign: "center"
      }}>

        <div style={{
          fontSize: "50px",
          marginBottom: "10px"
        }}>
          {passed ? "✅" : "❌"}
        </div>

        <h1 style={{
          fontSize: "26px",
          fontWeight: "600",
          marginBottom: "10px"
        }}>
          {passed ? "Great Job!" : "Assessment Complete"}
        </h1>

        <p style={{
          color: "#6b7280",
          marginBottom: "20px"
        }}>
          {passed
            ? "You have successfully completed the assessment!"
            : "Your session has been recorded and submitted."
          }
        </p>


        {/* Score */}
        <div style={{
          background: "#f3f4f6",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px"
        }}>

          <div style={{
            fontSize: "30px",
            fontWeight: "600"
          }}>
            {score} / {totalQuestions}
          </div>

          <div style={{
            fontSize: "20px",
            marginTop: "5px"
          }}>
            {percentage}%
          </div>

          <div style={{
            marginTop: "10px",
            fontWeight: "600",
            color: passed ? "#22c55e" : "#ef4444"
          }}>
            {passed ? "PASSED" : "SUBMITTED"}
          </div>

        </div>


        {/* Buttons */}
        <div style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center"
        }}>

          <Link
            to="/dashboard"
            style={{
              background: "#3b82f6",
              color: "white",
              padding: "10px 20px",
              borderRadius: "6px",
              textDecoration: "none"
            }}
          >
            Dashboard
          </Link>

          <button
            onClick={() => window.print()}
            style={{
              background: "#6b7280",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px"
            }}
          >
            Print
          </button>

        </div>

      </div>

    </div>

  </div>
);
};

export default ResultPage;