import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';

const Proctor = ({ competitionId, onDisqualify }) => {
  const [violations, setViolations] = useState(0);
  const [status, setStatus] = useState('monitoring');
  const MAX_VIOLATIONS = 3;

  const reportViolation = useCallback(
    async (type, description = '') => {
      try {
        setViolations((prev) => {
          const newCount = prev + 1;

          // Log violation to backend
          api.post('/proctor/log-violation', {
            competition_id: competitionId,
            violation_type: type,
            description,
            count: newCount,
          }).catch((err) => console.error('Failed to log violation', err));

          if (newCount >= MAX_VIOLATIONS) {
            setStatus('disqualified');
            onDisqualify(`Automatic disqualification: Maximum violations (${MAX_VIOLATIONS}) reached.`);
          }

          return newCount;
        });
      } catch (err) {
        console.error('Error in reportViolation:', err);
      }
    },
    [competitionId, onDisqualify]
  );

  useEffect(() => {
    // Request fullscreen on mount
    const elem = document.documentElement;
    if (elem.requestFullscreen && !document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request denied:', err);
      });
    }

    // 1. Detect Tab Visibility Change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportViolation('TAB_SWITCH_OR_MINIMIZE', 'User switched tabs or minimized window');
        alert('⚠️ SECURITY WARNING: Tab switching is not allowed. Violation recorded.');
      }
    };

    // 2. Detect Window Blur (clicking outside browser)
    const handleBlur = () => {
      reportViolation('WINDOW_FOCUS_LOST', 'User clicked outside the browser window');
      alert('⚠️ SECURITY WARNING: Please keep the exam window focused.');
    };

    // 3. Block Developer Tools & Inspect Element
    const handleKeyDown = (e) => {
      const blockedKeys = [
        { code: 123, name: 'F12' },
        {
          combo: (e) => e.ctrlKey && e.shiftKey && e.keyCode === 73,
          name: 'Ctrl+Shift+I',
        },
        {
          combo: (e) => e.ctrlKey && e.keyCode === 85,
          name: 'Ctrl+U',
        },
        {
          combo: (e) => e.ctrlKey && e.shiftKey && e.keyCode === 74,
          name: 'Ctrl+Shift+J',
        },
      ];

      for (let key of blockedKeys) {
        if (key.code === e.keyCode || (key.combo && key.combo(e))) {
          e.preventDefault();
          reportViolation('DEV_TOOLS_ATTEMPT', `Blocked: ${key.name}`);
          return false;
        }
      }
    };

    // 4. Block Right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
      reportViolation('RIGHT_CLICK_ATTEMPT', 'User attempted right-click');
      alert('⚠️ Right-click is disabled during the exam.');
      return false;
    };

    // 5. Block Copy, Cut, Paste
    const handleCopy = (e) => {
      e.preventDefault();
      reportViolation('COPY_ATTEMPT', 'User attempted to copy');
      return false;
    };

    const handlePaste = (e) => {
      e.preventDefault();
      reportViolation('PASTE_ATTEMPT', 'User attempted to paste');
      alert('⚠️ Pasting is disabled during the exam.');
      return false;
    };

    // 6. Fullscreen Change Detection
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        reportViolation('EXITED_FULLSCREEN', 'User exited fullscreen mode');
        alert('⚠️ SECURITY WARNING: You must remain in fullscreen mode.');

        // Try to re-enter fullscreen
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen().catch((err) => {
            console.warn('Could not re-enter fullscreen:', err);
          });
        }
      }
    };

    // Add Event Listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [reportViolation]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`flex items-center gap-3 px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
          status === 'disqualified'
            ? 'bg-red-900 border-red-600 text-red-100'
            : violations >= 2
            ? 'bg-yellow-900 border-yellow-600 text-yellow-100'
            : violations > 0
            ? 'bg-orange-900 border-orange-600 text-orange-100'
            : 'bg-green-900 border-green-600 text-green-100'
        }`}
      >
        <div
          className={`w-3 h-3 rounded-full ${
            status === 'disqualified'
              ? 'bg-red-300 animate-pulse'
              : violations > 0
              ? 'bg-yellow-300 animate-pulse'
              : 'bg-green-300'
          }`}
        ></div>
        <span className="text-xs uppercase tracking-wider">
          🔒 Proctoring: {violations}/{MAX_VIOLATIONS}
        </span>
      </div>
    </div>
  );
};

export default Proctor;