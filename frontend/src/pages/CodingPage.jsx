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
    <div className="h-screen flex flex-col bg-slate-900 text-white">
      <Proctor competitionId={challengeId} onDisqualify={() => navigate('/')} />

      {/* Header */}
      <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
        <div>
          <h1 className="text-2xl font-bold">{challenge?.title || 'Coding Challenge'}</h1>
          <p className="text-slate-300 text-sm">{challenge?.difficulty}</p>
        </div>
        <Timer initialSeconds={challenge?.duration * 60 || 3600} onTimeUp={() => handleSubmitCode()} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Problem Description */}
        <div className="w-1/3 bg-slate-800 p-6 overflow-y-auto border-r border-slate-700">
          <h2 className="text-xl font-bold mb-4">Problem</h2>
          <div className="text-slate-300 whitespace-pre-wrap text-sm">
            {challenge?.description || 'No description provided'}
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Sample Input</h3>
            <pre className="bg-slate-900 p-3 rounded text-xs overflow-x-auto">
              {challenge?.sample_input || ''}
            </pre>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold mb-2">Sample Output</h3>
            <pre className="bg-slate-900 p-3 rounded text-xs overflow-x-auto">
              {challenge?.sample_output || ''}
            </pre>
          </div>
        </div>

        {/* Code Editor and Output */}
        <div className="w-2/3 flex flex-col">
          <CodeEditor
            code={code}
            onChange={setCode}
            language={challenge?.language || 'python'}
          />
          <div className="bg-slate-800 border-t border-slate-700 p-4 flex gap-2">
            <button
              onClick={handleRunCode}
              className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
            >
              Run Code
            </button>
            <button
              onClick={handleSubmitCode}
              className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded font-semibold"
            >
              Submit Solution
            </button>
          </div>
          <div className="flex-1 bg-slate-900 p-4 border-t border-slate-700 overflow-y-auto">
            <h3 className="text-lg font-bold mb-2">Output</h3>
            <pre className="text-slate-300 text-sm whitespace-pre-wrap">{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingPage;