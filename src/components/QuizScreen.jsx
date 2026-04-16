import { useState, useCallback } from 'react';
import Timer from './Timer';
import QuestionCard from './QuestionCard';
import Footer from './Footer';

const QuizScreen = ({ 
  questions, 
  studentInfo, 
  timeLimitMinutes,
  wrongAnswerPenaltyFraction,
  onQuizComplete 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const currentAnswer = answers[currentQuestion.id];
  const hasAnswered = currentAnswer !== undefined && 
    (Array.isArray(currentAnswer) ? currentAnswer.length > 0 : true);

  const handleAnswerChange = useCallback((answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  }, [currentQuestion.id]);

  const handleQuestionClick = (index) => {
    setCurrentIndex(index);
    setVisitedQuestions(prev => new Set([...prev, index]));
  };

  const handleNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setVisitedQuestions(prev => new Set([...prev, nextIndex]));
    }
  }, [currentIndex, totalQuestions]);

  const handleTimeUp = useCallback(() => {
    onQuizComplete(answers);
  }, [answers, onQuizComplete]);

  const handleSubmit = useCallback(() => {
    onQuizComplete(answers);
  }, [answers, onQuizComplete]);

  const handleClearAnswer = () => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[currentQuestion.id];
      return newAnswers;
    });
  };

  const isLastQuestion = currentIndex === totalQuestions - 1;

  const getQuestionStatus = (question, index) => {
    if (index === currentIndex) return 'current';
    
    const isVisited = visitedQuestions.has(index);
    const isAnswered = answers[question.id] !== undefined &&
      (Array.isArray(answers[question.id]) ? answers[question.id].length > 0 : true);
    
    if (!isVisited) return 'unvisited';
    if (isAnswered) return 'answered';
    return 'skipped';
  };

  const answeredCount = questions.filter(q => {
    const a = answers[q.id];
    return a !== undefined && (Array.isArray(a) ? a.length > 0 : true);
  }).length;
  
  const skippedCount = visitedQuestions.size - answeredCount;
  const remainingCount = totalQuestions - visitedQuestions.size;

  return (
    <div className="w-full max-w-6xl flex gap-6 animate-fadeIn h-[calc(100vh-120px)]">
      <div className="flex-1 flex flex-col min-w-0">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          selectedAnswer={currentAnswer}
          onAnswerChange={handleAnswerChange}
          onClearAnswer={handleClearAnswer}
        />

        <div className="flex justify-between items-center mt-4 flex-shrink-0">
          <div className="text-sm">
            {!hasAnswered ? (
              wrongAnswerPenaltyFraction > 0 ? (
                <span className="text-yellow-400">📝 Unattempted (wrong answers have -{wrongAnswerPenaltyFraction * 100}% penalty)</span>
              ) : (
                <span className="text-gray-400">📝 Unattempted question</span>
              )
            ) : (
              <span className="text-green-400">✅ You can change your answer or leave it unanswered</span>
            )}
          </div>
          
          <div className="flex gap-4">
            {!isLastQuestion ? (
              <button className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all" onClick={handleNext}>
                Next <span>👉</span>
              </button>
            ) : (
              <button className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 transition-all" onClick={handleSubmit}>
                Submit Quiz <span>✅</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-80 flex-shrink-0 flex flex-col gap-4">
        <div className="sticky top-4 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base font-semibold text-white">{studentInfo.firstName} {studentInfo.lastName}</div>
              <div className="text-gray-400 text-sm">Roll: {studentInfo.rollNumber}</div>
            </div>
            <Timer minutes={timeLimitMinutes} onTimeUp={handleTimeUp} />
          </div>
        </div>

        <div className="sticky top-36 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex gap-3 mb-4 flex-wrap justify-center text-xs">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-primary"></span>
              <span>Current</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-500"></span>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-yellow-500"></span>
              <span>Skipped</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-gray-600"></span>
              <span>Unvisited</span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-4">
            {questions.map((q, idx) => {
              const status = getQuestionStatus(q, idx);
              const bgColor = status === 'current' ? 'bg-primary' : 
                             status === 'answered' ? 'bg-green-500' : 
                             status === 'skipped' ? 'bg-yellow-500' : 'bg-gray-600';
              
              return (
                <button
                  key={q.id}
                  className={`w-10 h-10 rounded-lg font-medium text-sm ${bgColor} hover:opacity-80 transition-all`}
                  onClick={() => handleQuestionClick(idx)}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Answered:</span>
              <span className="text-green-400 font-medium">{answeredCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Skipped:</span>
              <span className="text-yellow-400 font-medium">{skippedCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Unvisited:</span>
              <span className="text-gray-400 font-medium">{remainingCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
