import { getMarksForQuestion } from '../data/constants';

/**
 * QuestionCard Component
 * Displays a single question with options
 * Supports both single and multiple correct answers
 */
const QuestionCard = ({ 
  question, 
  selectedAnswer, 
  onAnswerChange,
  showResults = false,
  isCorrect = null
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

  const handleOptionClick = (index) => {
    if (showResults) return;

    if (isMultiple) {
      const currentAnswers = selectedAnswer || [];
      const newAnswers = currentAnswers.includes(index)
        ? currentAnswers.filter(i => i !== index)
        : [...currentAnswers, index];
      onAnswerChange(newAnswers);
    } else {
      onAnswerChange(index);
    }
  };

  const isOptionSelected = (index) => {
    if (isMultiple) {
      return (selectedAnswer || []).includes(index);
    }
    return selectedAnswer === index;
  };

  const getOptionClass = (index) => {
    const baseClass = 'option-item';
    const selected = isOptionSelected(index) ? 'selected' : '';
    
    if (!showResults) {
      return `${baseClass} ${selected}`;
    }

    const correctAnswers = Array.isArray(question.isCorrect)
      ? question.isCorrect
      : [question.isCorrect];
    
    const isCorrectOption = correctAnswers.includes(index);
    
    if (isCorrectOption) {
      return `${baseClass} correct`;
    }
    if (selected && !isCorrectOption) {
      return `${baseClass} incorrect`;
    }
    return baseClass;
  };

  const renderCheckbox = (isSelected) => (
    <div className={`option-indicator option-checkbox ${isSelected ? 'selected' : ''}`}>
      {isSelected && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
  );

  const renderRadio = (isSelected) => (
    <div className={`option-indicator ${isSelected ? 'selected' : ''}`}>
      {isSelected && (
        <div style={{
          width: '10px',
          height: '10px',
          background: 'white',
          borderRadius: '50%'
        }} />
      )}
    </div>
  );

  return (
    <div className="question-card" style={{ animation: 'scaleIn 0.3s ease-out' }}>
      {/* Question Header */}
      <div className="question-header">
        <div>
          <span className="question-number">
            Q{questionNumber}
          </span>
          {isMultiple && (
            <span className="question-type-badge" style={{ marginLeft: '8px' }}>
              Multiple Answers
            </span>
          )}
        </div>
        <span className="question-marks">
          +{marks} {marks === 1 ? 'mark' : 'marks'}
        </span>
      </div>

      {/* Question Text */}
      <p className="question-text">{text}</p>

      {/* Question Image (if present) */}
      {image && (
        <img 
          src={image} 
          alt="Question illustration" 
          className="question-image"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}

      {/* Options */}
      <div className="options-container">
        {options.map((option, index) => (
          <div
            key={index}
            className={getOptionClass(index)}
            onClick={() => handleOptionClick(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOptionClick(index);
              }
            }}
          >
            {isMultiple 
              ? renderCheckbox(isOptionSelected(index))
              : renderRadio(isOptionSelected(index))
            }
            <span className="option-text">{option.text}</span>
            {showResults && (
              <span style={{ marginLeft: 'auto' }}>
                {Array.isArray(question.isCorrect)
                  ? question.isCorrect.includes(index)
                    ? '✅'
                    : isOptionSelected(index)
                      ? '❌'
                      : ''
                  : question.isCorrect === index
                    ? '✅'
                    : isOptionSelected(index)
                      ? '❌'
                      : ''
                }
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Explanation (shown in results) */}
      {showResults && explanation && (
        <div style={{
          marginTop: 'var(--space-lg)',
          padding: 'var(--space-md)',
          background: 'rgba(102, 126, 234, 0.1)',
          borderRadius: 'var(--radius-md)',
          borderLeft: '4px solid var(--primary-color)'
        }}>
          <strong style={{ color: 'var(--primary-color)' }}>💡 Explanation:</strong>
          <p style={{ 
            marginTop: 'var(--space-xs)', 
            color: 'var(--text-primary)',
            fontSize: '0.875rem'
          }}>
            {explanation}
          </p>
        </div>
      )}

      {/* Multiple answer hint */}
      {!showResults && isMultiple && (
        <p style={{
          marginTop: 'var(--space-md)',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          textAlign: 'center'
        }}>
          Select all answers that apply
        </p>
      )}
    </div>
  );
};

export default QuestionCard;
