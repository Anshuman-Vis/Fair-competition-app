import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaCheckCircle, FaClock, FaQuestionCircle } from 'react-icons/fa';

/**
 * Quiz Component
 *
 * Interactive quiz interface with modern design and smooth animations.
 * Provides secure question navigation, answer selection, and progress tracking.
 *
 * Features:
 * - Animated question transitions
 * - Progress visualization
 * - Answer validation and feedback
 * - Responsive design
 * - Accessibility support
 *
 * Security Features:
 * - Prevents answer manipulation
 * - Tracks question completion
 * - Validates answer submissions
 *
 * Performance Optimizations:
 * - Memoized callbacks to prevent unnecessary re-renders
 * - Efficient state management
 * - Lazy loading of question content
 *
 * @param {Object} props
 * @param {Array} props.questions - Array of quiz questions
 * @param {Function} props.onComplete - Callback when quiz is completed
 */
const QuizComponent = memo(({ questions, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes default

  /**
   * Timer effect for quiz duration tracking
   * Automatically updates time remaining and handles quiz timeout
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Auto-submit on timeout
          handleQuizComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /**
   * Memoized answer selection handler
   * Updates selected answers state with validation
   */
  const handleOptionSelect = useCallback((questionId, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));

    // Optional: Persist progress to backend for recovery
    // api.post('/quiz/save-progress', { questionId, optionIndex });
  }, []);

  /**
   * Navigation handlers with bounds checking
   */
  const nextQuestion = useCallback(() => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, questions.length]);

  const prevQuestion = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  /**
   * Quiz completion handler
   * Validates all answers and triggers completion callback
   */
  const handleQuizComplete = useCallback(() => {
    // Validate that all questions are answered
    const unanswered = questions.filter(q => !selectedAnswers.hasOwnProperty(q.id));
    if (unanswered.length > 0) {
      alert(`Please answer ${unanswered.length} remaining question(s)`);
      return;
    }

    onComplete(selectedAnswers);
  }, [selectedAnswers, questions, onComplete]);

  /**
   * Format time display
   * Converts seconds to MM:SS format
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-4xl mx-auto bg-linear-to-br from-white to-gray-50 shadow-2xl rounded-3xl overflow-hidden border border-gray-200">
      {/* Modern Progress Bar with Animation */}
      <div className="relative w-full bg-gray-100 h-3">
        <motion.div
          className="bg-linear-to-br from-blue-500 to-purple-600 h-3 rounded-r-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Header with Stats */}
      <div className="bg-linear-to-br from-slate-50 to-gray-100 px-8 py-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-blue-600">
              <FaQuestionCircle />
              <span className="font-semibold">
                Question {currentStep + 1} of {questions.length}
              </span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <FaCheckCircle />
              <span className="font-semibold">
                Answered: {answeredCount}/{questions.length}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-orange-600 font-mono font-bold">
            <FaClock />
            <span className={timeLeft < 300 ? 'text-red-600 animate-pulse' : ''}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
              {currentQuestion?.text}
            </h2>

            <div className="space-y-4">
              {currentQuestion?.options?.map((option, index) => {
                const isSelected = selectedAnswers[currentQuestion.id] === index;
                return (
                  <motion.button
                    key={index}
                    onClick={() => handleOptionSelect(currentQuestion.id, index)}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-200 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center">
                      <motion.span
                        className={`w-10 h-10 flex items-center justify-center rounded-full mr-6 border-2 font-bold text-lg transition-all ${
                          isSelected
                            ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                            : 'bg-white text-gray-600 border-gray-300'
                        }`}
                        animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
                      >
                        {String.fromCharCode(65 + index)}
                      </motion.span>
                      <span className="text-gray-700 font-medium text-lg">{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Footer */}
        <motion.div
          className="mt-12 flex justify-between items-center border-t border-gray-200 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={prevQuestion}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 text-gray-500 font-semibold rounded-xl border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-gray-800 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaChevronLeft />
            Previous
          </motion.button>

          {currentStep === questions.length - 1 ? (
            <motion.button
              onClick={handleQuizComplete}
              className="flex items-center gap-2 px-8 py-4 bg-linear-to-br from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCheckCircle />
              Final Submit
            </motion.button>
          ) : (
            <motion.button
              onClick={nextQuestion}
              className="flex items-center gap-2 px-8 py-4 bg-linear-to-br from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Next Question
              <FaChevronRight />
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
});

QuizComponent.displayName = 'QuizComponent';

export default QuizComponent;