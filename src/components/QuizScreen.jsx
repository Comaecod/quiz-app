import { useState, useCallback } from 'react';
import Timer from './Timer';
import QuestionCard from './QuestionCard';

/**
 * QuizScreen Component
 * Main quiz interface - questions on left, navigator on right
 */
const QuizScreen = ({ 
  questions, 
  studentInfo, 
  timeLimitMinutes,
  onQuizComplete 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const currentAnswer = answers[currentQuestion.id];
  const hasAnswered = currentAnswer !== undefined && 
    (Array.isArray(currentAnswer) ? currentAnswer.length > 0 : true);

  // Update answer for current question
  const handleAnswerChange = useCallback((answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  }, [currentQuestion.id]);

  // Navigate to specific question
  const handleQuestionClick = (index) => {
    setCurrentIndex(index);
    setVisitedQuestions(prev => new Set([...prev, index]));
  };

  // Go to next question
  const handleNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setVisitedQuestions(prev => new Set([...prev, nextIndex]));
    }
  }, [currentIndex, totalQuestions]);

  // Timer ran out - auto submit
  const handleTimeUp = useCallback(() => {
    onQuizComplete(answers);
  }, [answers, onQuizComplete]);

  // Manual submit
  const handleSubmit = useCallback(() => {
    onQuizComplete(answers);
  }, [answers, onQuizComplete]);

  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Get status for a question
  const getQuestionStatus = (question, index) => {
    if (index === currentIndex) return 'current';
    
    const isVisited = visitedQuestions.has(index);
    const isAnswered = answers[question.id] !== undefined &&
      (Array.isArray(answers[question.id]) ? answers[question.id].length > 0 : true);
    
    if (!isVisited) return 'unvisited';
    if (isAnswered) return 'answered';
    return 'skipped';
  };

  // Stats calculations
  const answeredCount = questions.filter(q => {
    const a = answers[q.id];
    return a !== undefined && (Array.isArray(a) ? a.length > 0 : true);
  }).length;
  
  const skippedCount = visitedQuestions.size - answeredCount;
  const remainingCount = totalQuestions - visitedQuestions.size;

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '1200px',
      display: 'flex',
      gap: 'var(--space-lg)',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {/* Left Side - Question Area (2/3) */}
      <div style={{ flex: 2 }}>
        {/* Header: Student info + Timer */}
        <div className="header-bar">
          <div className="student-info">
            <span className="student-name">
              {studentInfo.firstName} {studentInfo.lastName}
            </span>
            <span className="student-roll">
              | Roll: {studentInfo.rollNumber}
            </span>
          </div>

          <Timer 
            minutes={timeLimitMinutes} 
            onTimeUp={handleTimeUp}
          />
        </div>

        {/* Progress bar */}
        <div className="progress-container" style={{ marginBottom: 'var(--space-lg)' }}>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-text">
            Question {currentIndex + 1} of {totalQuestions}
          </div>
        </div>

        {/* Question card */}
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          selectedAnswer={currentAnswer}
          onAnswerChange={handleAnswerChange}
          onClearAnswer={() => {
            setAnswers(prev => {
              const newAnswers = { ...prev };
              delete newAnswers[currentQuestion.id];
              return newAnswers;
            });
          }}
        />

        {/* Navigation buttons */}
        <div className="flex justify-between mt-xl">
          <div className="skip-warning">
            {!hasAnswered ? (
              <span>📝 Unattempted (wrong answers get negative marking)</span>
            ) : (
              <span>✅ You can change your answer or leave it unanswered</span>
            )}
          </div>
          
          <div className="flex gap-md">
            {!isLastQuestion ? (
              <button className="btn btn-primary" onClick={handleNext}>
                Next <span>👉</span>
              </button>
            ) : (
              <button className="btn btn-success" onClick={handleSubmit}>
                Submit Quiz <span>✅</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Question Navigator (1/3) */}
      <div className="question-navigator">
        {/* Centered content wrapper */}
        <div className="navigator-content">
          <h3 className="navigator-title">Questions</h3>
          
          {/* Legend */}
          <div className="navigator-legend">
            <div className="legend-item">
              <span className="legend-dot current"></span>
              <span>Current</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot answered"></span>
              <span>Answered</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot skipped"></span>
              <span>Skipped</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot unvisited"></span>
              <span>Unvisited</span>
            </div>
          </div>

          {/* Question grid */}
          <div className="navigator-grid">
            {questions.map((q, idx) => {
              const status = getQuestionStatus(q, idx);
              
              return (
                <button
                  key={q.id}
                  className={`nav-btn ${status}`}
                  onClick={() => handleQuestionClick(idx)}
                  title={`Question ${idx + 1}${status === 'answered' ? ' ✓' : status === 'skipped' ? ' (Skipped)' : ''}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Stats summary */}
          <div className="navigator-stats">
            <div className="stat-row">
              <span className="stat-label">Answered:</span>
              <span className="stat-value answered-color">{answeredCount}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Skipped:</span>
              <span className="stat-value skipped-color">{skippedCount}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Unvisited:</span>
              <span className="stat-value unvisited-color">{remainingCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
