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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div
        className={`text-center p-12 rounded-3xl border-2 max-w-2xl ${
          passed
            ? 'bg-green-900 border-green-500'
            : 'bg-red-900 border-red-500'
        }`}
      >
        <div className="text-6xl mb-4">{passed ? '✅' : '❌'}</div>
        <h1 className={`text-5xl font-black mb-4 ${
          passed ? 'text-green-300' : 'text-red-300'
        }`}>
          {passed ? 'Great Job!' : 'Assessment Complete'}
        </h1>
        <p className="text-xl text-slate-200 mb-8">
          {passed
            ? 'You have successfully completed the assessment!'
            : 'Your session has been recorded and submitted.'
          }
        </p>

        {/* Score Display */}
        <div className="bg-slate-800 p-8 rounded-xl mb-6 border border-slate-700">
          <div className="text-5xl font-mono font-bold text-blue-400 mb-2">
            {score} / {totalQuestions}
          </div>
          <div className="text-2xl font-bold text-slate-300 mb-2">
            {percentage}%
          </div>
          <div className={`text-lg font-semibold ${
            passed ? 'text-green-300' : 'text-red-300'
          }`}>
            {passed ? 'PASSED' : 'SUBMITTED'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            to="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition"
          >
            Return to Dashboard
          </Link>
          <button
            onClick={() => window.print()}
            className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-lg font-bold transition"
          >
            Print Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;