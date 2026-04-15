import { useState, useCallback } from 'react';
import Timer from './Timer';
import QuestionCard from './QuestionCard';

/**
 * QuizScreen Component
 * Main quiz interface showing one question at a time
 */
const QuizScreen = ({ 
  questions, 
  studentInfo, 
  timeLimitMinutes,
  onQuizComplete 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isTimeUp, setIsTimeUp] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const currentAnswer = answers[currentQuestion.id];
  const hasAnswered = currentAnswer !== undefined && 
    (Array.isArray(currentAnswer) ? currentAnswer.length > 0 : true);

  const handleAnswerChange = useCallback((answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  }, [currentQuestion.id]);

  const handleNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, totalQuestions]);

  const handleTimeUp = useCallback(() => {
    setIsTimeUp(true);
    onQuizComplete(answers);
  }, [answers, onQuizComplete]);

  const handleSubmit = useCallback(() => {
    onQuizComplete(answers);
  }, [answers, onQuizComplete]);

  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '700px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {/* Top Bar with Timer and Progress */}
      <div className="flex justify-between items-center mb-lg" style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md) var(--space-lg)',
        marginBottom: 'var(--space-lg)'
      }}>
        {/* Student Info */}
        <div style={{ color: 'var(--text-light)' }}>
          <span style={{ fontWeight: '600' }}>
            {studentInfo.firstName} {studentInfo.lastName}
          </span>
          <span style={{ opacity: 0.7, marginLeft: '8px' }}>
            | Roll: {studentInfo.rollNumber}
          </span>
        </div>

        {/* Timer */}
        <Timer 
          minutes={timeLimitMinutes} 
          onTimeUp={handleTimeUp}
        />
      </div>

      {/* Progress Bar */}
      <div className="progress-container" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="progress-text">
          Question {currentIndex + 1} of {totalQuestions}
        </div>
      </div>

      {/* Question Card */}
      <QuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
        selectedAnswer={currentAnswer}
        onAnswerChange={handleAnswerChange}
      />

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-xl">
        <div style={{ color: 'var(--text-light)', opacity: 0.7 }}>
          {!hasAnswered && (
            <span>📝 You can skip this question (wrong answers get negative marking)</span>
          )}
        </div>
        
        <div className="flex gap-md">
          {!isLastQuestion ? (
            <button
              className="btn btn-primary"
              onClick={handleNext}
            >
              Next 
              <span>👉</span>
            </button>
          ) : (
            <button
              className="btn btn-success"
              onClick={handleSubmit}
            >
              Submit Quiz 
              <span>✅</span>
            </button>
          )}
        </div>
      </div>

      {/* Question Navigator Dots */}
      <div className="flex justify-center gap-sm mt-xl" style={{ flexWrap: 'wrap' }}>
        {questions.map((q, index) => {
          const isAnswered = answers[q.id] !== undefined &&
            (Array.isArray(answers[q.id]) ? answers[q.id].length > 0 : true);
          const isCurrent = index === currentIndex;
          
          return (
            <div
              key={q.id}
              style={{
                width: isCurrent ? '24px' : '12px',
                height: '12px',
                borderRadius: 'var(--radius-full)',
                background: isCurrent
                  ? 'var(--primary-color)'
                  : isAnswered
                    ? 'var(--success-color)'
                    : 'rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              // onClick={() => setCurrentIndex(index)}
              onClick={() => null} // Disable direct navigation to prevent skipping questions
              title={`Question ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default QuizScreen;
