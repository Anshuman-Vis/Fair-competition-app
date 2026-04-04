import React, { useState } from 'react';

const QuizComponent = ({ questions, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleOptionSelect = (questionId, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex
    });
    // Optional: api.post('/quiz/save-progress', { questionId, optionIndex });
  };

  const nextQuestion = () => {
    if (currentStep < questions.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevQuestion = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const currentQuestion = questions[currentStep];

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
      {/* Progress Bar */}
      <div className="w-full bg-gray-100 h-2">
        <div 
          className="bg-blue-600 h-2 transition-all duration-300" 
          style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
            Question {currentStep + 1} of {questions.length}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          {currentQuestion.text}
        </h2>

        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(currentQuestion.id, index)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedAnswers[currentQuestion.id] === index
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <span className={`w-8 h-8 flex items-center justify-center rounded-full mr-4 border ${
                  selectedAnswers[currentQuestion.id] === index ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-100 text-gray-500'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-gray-700 font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 flex justify-between border-t pt-6">
          <button
            onClick={prevQuestion}
            disabled={currentStep === 0}
            className="px-6 py-2 text-gray-500 font-semibold disabled:opacity-30 hover:text-gray-800 transition"
          >
            Previous
          </button>
          
          {currentStep === questions.length - 1 ? (
            <button
              onClick={() => onComplete(selectedAnswers)}
              className="px-8 py-2 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition"
            >
              Final Submit
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="px-8 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;