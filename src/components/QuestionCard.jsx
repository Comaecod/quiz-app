import { getMarksForQuestion } from '../data/constants';

/**
 * QuestionCard Component
 * Displays a single question with options
 */
const QuestionCard = ({ 
  question, 
  selectedAnswer, 
  onAnswerChange,
  onClearAnswer
}) => {
  const {
    questionNumber,
    text,
    image,
    type,
    options,
    explanation
  } = question;

  const marks = getMarksForQuestion(questionNumber);
  const isMultiple = type === 'multiple';

  // Check if answer is selected
  const isAnswered = selectedAnswer !== undefined && 
    (Array.isArray(selectedAnswer) ? selectedAnswer.length > 0 : true);

  // Handle option selection
  const handleOptionClick = (index) => {
    if (isMultiple) {
      const current = selectedAnswer || [];
      const updated = current.includes(index)
        ? current.filter(i => i !== index)
        : [...current, index];
      onAnswerChange(updated);
    } else {
      // Single: if already selected, deselect; otherwise select
      if (selectedAnswer === index) {
        onClearAnswer();
      } else {
        onAnswerChange(index);
      }
    }
  };

  // Check if option is selected
  const isOptionSelected = (index) => {
    if (isMultiple) {
      return (selectedAnswer || []).includes(index);
    }
    return selectedAnswer === index;
  };

  return (
    <div className="question-card" style={{ animation: 'scaleIn 0.3s ease-out' }}>
      {/* Question header */}
      <div className="question-header">
        <div>
          <span className="question-number">Q{questionNumber}</span>
          {isMultiple && (
            <span className="question-type-badge">Multiple Answers</span>
          )}
        </div>
        <div className="header-right">
          <span className="question-marks">
            +{marks} {marks === 1 ? 'mark' : 'marks'}
          </span>
          {isAnswered && (
            <button 
              className="clear-btn"
              onClick={onClearAnswer}
              title="Clear your answer"
            >
              Clear Answer
            </button>
          )}
        </div>
      </div>

      {/* Question text */}
      <p className="question-text">{text}</p>

      {/* Optional image */}
      {image && (
        <img 
          src={image} 
          alt="Question illustration" 
          className="question-image"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}

      {/* Options */}
      <div className="options-container">
        {options.map((option, index) => (
          <div
            key={index}
            className={`option-item ${isOptionSelected(index) ? 'selected' : ''}`}
            onClick={() => handleOptionClick(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOptionClick(index);
              }
            }}
            role="button"
            tabIndex={0}
          >
            {/* Radio or checkbox indicator */}
            <div className={`option-indicator ${isOptionSelected(index) ? 'selected' : ''}`}>
              {isOptionSelected(index) && (
                isMultiple ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <div className="radio-dot" />
                )
              )}
            </div>
            <span className="option-text">{option.text}</span>
          </div>
        ))}
      </div>

      {/* Multiple answer hint */}
      {isMultiple && (
        <p className="multiple-hint">Select all answers that apply</p>
      )}

      {/* Explanation (for results screen - extend this component if needed) */}
      {explanation && (
        <div className="explanation-box">
          <strong>💡 Explanation:</strong>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
