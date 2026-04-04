import React, { useState, useEffect } from 'react';

const Timer = ({ initialSeconds, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
    }
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const isCritical = timeLeft < 300; // 5 minutes
  const isVeryLow = timeLeft < 60; // 1 minute

  return (
    <div
      className={`px-6 py-3 rounded-lg border-2 font-bold transition-all ${
        isVeryLow
          ? 'bg-red-900 border-red-500 animate-pulse text-red-200'
          : isCritical
          ? 'bg-yellow-900 border-yellow-500 text-yellow-200'
          : 'bg-slate-700 border-slate-600 text-white'
      }`}
    >
      <span className="text-sm">⏱️ Time Left: </span>
      <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default Timer;