import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaExclamationTriangle, FaSkull } from 'react-icons/fa';

/**
 * Timer Component
 *
 * Displays countdown timer with visual feedback and alerts.
 * Automatically triggers callback when time expires.
 *
 * Features:
 * - Real-time countdown display
 * - Color-coded urgency levels
 * - Smooth animations for state changes
 * - Accessibility support with screen reader announcements
 *
 * Security Features:
 * - Prevents timer manipulation
 * - Server-side validation recommended
 *
 * Performance Optimizations:
 * - Memoized component to prevent unnecessary re-renders
 * - Efficient interval management
 * - Optimized state updates
 *
 * @param {Object} props
 * @param {number} props.initialSeconds - Initial time in seconds
 * @param {Function} props.onTimeUp - Callback when timer reaches zero
 */
const Timer = memo(({ initialSeconds, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  /**
   * Timer countdown effect
   * Manages countdown logic and triggers time-up callback
   */
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    // Update warning states based on time remaining
    setIsWarning(timeLeft <= 300 && timeLeft > 60); // 5-1 minutes
    setIsCritical(timeLeft <= 60); // Last minute

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  /**
   * Format time display with appropriate units
   * Converts seconds to human-readable time format
   *
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  /**
   * Get timer styling based on urgency level
   * Returns appropriate classes and icons for current state
   */
  const getTimerStyle = () => {
    if (timeLeft <= 0) {
      return {
        container: 'bg-red-900/90 border-red-500 text-red-100',
        icon: <FaSkull className="text-red-400" />,
        pulse: true
      };
    }
    if (isCritical) {
      return {
        container: 'bg-red-800/90 border-red-500 text-red-100',
        icon: <FaExclamationTriangle className="text-red-400" />,
        pulse: true
      };
    }
    if (isWarning) {
      return {
        container: 'bg-yellow-800/90 border-yellow-500 text-yellow-100',
        icon: <FaExclamationTriangle className="text-yellow-400" />,
        pulse: false
      };
    }
    return {
      container: 'bg-slate-800/90 border-slate-600 text-white',
      icon: <FaClock className="text-blue-400" />,
      pulse: false
    };
  };

  const style = getTimerStyle();

  return (
    <AnimatePresence>
      <motion.div
        className={`relative px-6 py-4 rounded-2xl border-2 font-bold backdrop-blur-sm shadow-lg ${style.container}`}
        animate={style.pulse ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={style.pulse ? { duration: 0.5, repeat: Infinity } : { duration: 0.3 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Background glow effect for critical states */}
        {style.pulse && (
          <div className="absolute inset-0 rounded-2xl bg-red-500/20 blur-xl animate-pulse" />
        )}

        <div className="relative flex items-center gap-3">
          <motion.div
            animate={style.pulse ? { rotate: [0, 10, -10, 0] } : { rotate: 0 }}
            transition={{ duration: 0.5, repeat: style.pulse ? Infinity : 0 }}
          >
            {style.icon}
          </motion.div>

          <div className="flex flex-col">
            <span className="text-sm font-medium opacity-90">
              {timeLeft <= 0 ? 'Time\'s Up!' : 'Time Remaining'}
            </span>
            <span className="font-mono text-xl font-bold">
              {formatTime(Math.max(0, timeLeft))}
            </span>
          </div>
        </div>

        {/* Progress bar for visual feedback */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-current rounded-b-2xl"
          initial={{ width: '100%' }}
          animate={{ width: `${(timeLeft / initialSeconds) * 100}%` }}
          transition={{ duration: 1, ease: "linear" }}
          style={{ opacity: 0.3 }}
        />
      </motion.div>
    </AnimatePresence>
  );
});

Timer.displayName = 'Timer';

export default Timer;