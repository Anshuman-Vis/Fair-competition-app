import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import CodeEditor from '../components/CodeEditor.jsx';
import Proctor from '../components/Proctor.jsx';
import Timer from '../components/Timer.jsx';

const CodingPage = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [output, setOutput] = useState('');

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await api.get(`/coding/${challengeId}`);
        setChallenge(res.data);
        setCode(res.data.template || '');
      } catch (err) {
        console.error('Error fetching challenge:', err);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, [challengeId, navigate]);

  const handleRunCode = async () => {
    try {
      const res = await api.post('/coding/run', {
        code,
        challenge_id: challengeId,
      });
      setOutput(res.data.output || 'Code executed successfully');
    } catch (err) {
      setOutput('Error: ' + (err.response?.data?.message || 'Execution failed'));
    }
  };

  const handleSubmitCode = async () => {
    if (!window.confirm('Are you sure you want to submit?')) return;
    try {
      const res = await api.post('/coding/submit', {
        code,
        challenge_id: challengeId,
      });
      alert('Code submitted successfully!');
      navigate('/results');
    } catch (err) {
      alert('Error submitting code: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-2xl">Loading challenge...</div>
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

    <Proctor competitionId={challengeId} onDisqualify={() => navigate('/')} />

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
          Coding Arena
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
          Coding
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
      display: "flex",
      flexDirection: "column"
    }}>

      {/* Header */}
      <div style={{
        padding: "15px 20px",
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <h1 style={{
            fontSize: "20px",
            fontWeight: "600"
          }}>
            {challenge?.title || "Coding Challenge"}
          </h1>

          <p style={{
            fontSize: "13px",
            color: "#6b7280"
          }}>
            {challenge?.difficulty}
          </p>
        </div>

        <Timer
          initialSeconds={challenge?.duration * 60 || 3600}
          onTimeUp={() => handleSubmitCode()}
        />
      </div>


      {/* Content */}
      <div style={{
        display: "flex",
        flex: 1
      }}>

        {/* Problem */}
        <div style={{
          width: "35%",
          background: "white",
          padding: "20px",
          borderRight: "1px solid #e5e7eb",
          overflow: "auto"
        }}>

          <h2 style={{
            fontWeight: "600",
            marginBottom: "10px"
          }}>
            Problem
          </h2>

          <div style={{
            fontSize: "14px",
            color: "#374151"
          }}>
            {challenge?.description}
          </div>

          <div style={{ marginTop: "20px" }}>
            <h3>Sample Input</h3>
            <pre style={{
              background: "#f3f4f6",
              padding: "10px",
              borderRadius: "6px"
            }}>
              {challenge?.sample_input}
            </pre>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h3>Sample Output</h3>
            <pre style={{
              background: "#f3f4f6",
              padding: "10px",
              borderRadius: "6px"
            }}>
              {challenge?.sample_output}
            </pre>
          </div>

        </div>


        {/* Editor */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column"
        }}>

          <CodeEditor
            code={code}
            onChange={setCode}
            language={challenge?.language || 'python'}
          />

          <div style={{
            padding: "10px",
            background: "white",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            gap: "10px"
          }}>

            <button
              onClick={handleRunCode}
              style={{
                flex: 1,
                background: "#3b82f6",
                color: "white",
                padding: "10px",
                border: "none",
                borderRadius: "6px"
              }}
            >
              Run Code
            </button>

            <button
              onClick={handleSubmitCode}
              style={{
                flex: 1,
                background: "#22c55e",
                color: "white",
                padding: "10px",
                border: "none",
                borderRadius: "6px"
              }}
            >
              Submit Solution
            </button>

          </div>

          <div style={{
            flex: 1,
            padding: "20px",
            background: "#f3f4f6",
            overflow: "auto"
          }}>
            <h3>Output</h3>
            <pre>{output}</pre>
          </div>

        </div>

      </div>

    </div>

  </div>
);
};

export default CodingPage;