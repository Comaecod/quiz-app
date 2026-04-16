import { getMarksForQuestion } from '../data/constants';

const QuestionCard = ({ 
  question, 
  selectedAnswer, 
  onAnswerChange,
  onClearAnswer
}) => {
  const {
    questionNumber,
    originalId,
    text,
    image,
    type,
    options,
    explanation
  } = question;

  const marks = getMarksForQuestion(originalId);
  const isMultiple = type === 'multiple';

  const isAnswered = selectedAnswer !== undefined && 
    (Array.isArray(selectedAnswer) ? selectedAnswer.length > 0 : true);

  const handleOptionClick = (index) => {
    if (isMultiple) {
      const current = selectedAnswer || [];
      const updated = current.includes(index)
        ? current.filter(i => i !== index)
        : [...current, index];
      onAnswerChange(updated);
    } else {
      if (selectedAnswer === index) {
        onClearAnswer();
      } else {
        onAnswerChange(index);
      }
    }
  };

  const isOptionSelected = (index) => {
    if (isMultiple) {
      return (selectedAnswer || []).includes(index);
    }
    return selectedAnswer === index;
  };

  const shouldUseGrid = image && options.every(opt => opt.text.length <= 40);
  const isGridLayout = shouldUseGrid && !isMultiple;

  return (
    <div className="glass-card animate-scaleIn h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-primary/20 text-primary font-semibold">Q{questionNumber}</span>
          {isMultiple && (
            <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs font-medium">Multiple Answers</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-white/10 text-sm">
            +{marks} {marks === 1 ? 'mark' : 'marks'}
          </span>
          {isAnswered && (
            <button 
              className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors"
              onClick={onClearAnswer}
            >
              Clear Answer
            </button>
          )}
        </div>
      </div>

      <p className="text-lg mb-4 flex-shrink-0">{text}</p>

      {image && (
        <div className="flex-shrink-0 mb-4 flex justify-center">
          <img 
            src={image} 
            alt="Question illustration" 
            className="max-h-80 max-w-full object-contain rounded-xl"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      <div className={`flex-1 overflow-y-auto min-h-0 ${isGridLayout ? 'grid grid-cols-2 gap-3' : 'space-y-3'}`}>
        {options.map((option, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex-shrink-0 ${
              isOptionSelected(index) 
                ? 'border-primary bg-primary/10' 
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
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
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                isOptionSelected(index) ? 'border-primary bg-primary' : 'border-gray-500'
              }`}>
                {isOptionSelected(index) && !isMultiple && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
                {isOptionSelected(index) && isMultiple && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm">{option.text}</span>
            </div>
          </div>
        ))}
      </div>

      {isMultiple && (
        <p className="text-sm text-gray-400 mt-4 flex-shrink-0">Select all answers that apply</p>
      )}

      {explanation && (
        <div className="mt-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex-shrink-0">
          <strong className="text-sm">💡 Explanation:</strong>
          <p className="mt-1 text-xs text-gray-300">{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
