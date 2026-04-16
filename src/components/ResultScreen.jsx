import { useState, useMemo, useEffect, useRef } from 'react';
import { calculateTotalScore, getPerformanceMessage } from '../utils/scoring';
import { formatName } from '../utils/format';
import { saveQuizResult } from '../services/firebaseService';

const ResultScreen = ({ 
  questions, 
  answers, 
  studentInfo, 
  config,
  onRestart 
}) => {
  const [secretKey, setSecretKey] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [keyError, setKeyError] = useState(false);
  const hasSaved = useRef(false);
  const keyInputRef = useRef(null);

  const hasSecretKey = config.secretKey && config.secretKey.length > 0;

  const results = useMemo(() => {
    return calculateTotalScore(questions, answers, config.wrongAnswerPenaltyFraction);
  }, [questions, answers, config.wrongAnswerPenaltyFraction]);

  const performance = getPerformanceMessage(results.percentage);

  useEffect(() => {
    if (!hasSaved.current) {
      hasSaved.current = true;
      saveQuizResult(studentInfo, config, results).catch(console.error);
    }
  }, [studentInfo, config, results]);

  const handleKeySubmit = (e) => {
    e.preventDefault();
    
    if (secretKey.trim() === config.secretKey) {
      setIsUnlocked(true);
      setKeyError(false);
    } else {
      setKeyError(true);
      if (keyInputRef.current) {
        keyInputRef.current.focus();
      }
    }
  };

  const handleKeyChange = (e) => {
    setSecretKey(e.target.value);
    if (keyError) setKeyError(false);
  };

  return (
    <div className="w-full max-w-3xl animate-slideUp" role="region" aria-labelledby="result-heading">
      <article className="glass-card">
        <header className="text-center mb-6 sm:mb-8">
          <h2 id="result-heading" className="text-xl sm:text-2xl font-bold mb-2">
            <span aria-hidden="true">{performance.emoji}</span> {config.examTitle} Complete <span aria-hidden="true">{performance.emoji}</span>
          </h2>
          <p className="text-gray-400">
            Please remain seated. Do not look around. <span aria-hidden="true">👀</span>
          </p>
        </header>

        <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-1">
            {formatName(studentInfo.firstName)} {formatName(studentInfo.lastName)}
          </h3>
          <p className="text-gray-400">Roll Number: {studentInfo.rollNumber}</p>
        </div>

        <div className="text-center mb-4" role="status" aria-live="polite" aria-label="Your score">
          <div className="text-5xl sm:text-6xl font-bold">
            {results.totalEarned.toFixed(1)}
            <span className="text-2xl sm:text-3xl text-gray-400">/{results.totalMarks}</span>
          </div>
        </div>

        <div className="text-center mb-4">
          <span className="text-2xl sm:text-3xl font-semibold" aria-label={`Percentage: ${results.percentage} percent`}>{results.percentage}% <span aria-hidden="true">{performance.emoji}</span></span>
        </div>

        <div className="text-center mb-4 sm:mb-6">
          <span className="inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-xl sm:text-2xl font-bold animate-bounce" aria-label={`Grade: ${results.grade}`}>
            {results.grade}
          </span>
        </div>

        <p className="text-center text-gray-400 mb-4 sm:mb-6">{performance.message}</p>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8" role="list" aria-label="Question statistics">
          <div className="p-3 sm:p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center" role="listitem">
            <div className="text-2xl sm:text-3xl font-bold text-green-400" aria-label={`${results.correctCount} correct answers`}>{results.correctCount}</div>
            <div className="text-xs sm:text-sm text-gray-400"><span aria-hidden="true">✅</span> Correct</div>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center" role="listitem">
            <div className="text-2xl sm:text-3xl font-bold text-red-400" aria-label={`${results.wrongCount} wrong answers`}>{results.wrongCount}</div>
            <div className="text-xs sm:text-sm text-gray-400"><span aria-hidden="true">❌</span> Wrong</div>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center" role="listitem">
            <div className="text-2xl sm:text-3xl font-bold text-yellow-400" aria-label={`${results.skippedCount} skipped questions`}>{results.skippedCount}</div>
            <div className="text-xs sm:text-sm text-gray-400"><span aria-hidden="true">⏭️</span> Skipped</div>
          </div>
        </div>

        {hasSecretKey && !isUnlocked ? (
          <div className="text-center py-6 sm:py-8">
            <div className="text-4xl sm:text-5xl mb-4" aria-hidden="true">🔒</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Answers Hidden</h3>
            <p className="text-gray-400 mb-6">Enter the secret key to view question analysis</p>
            
            <form onSubmit={handleKeySubmit} className="max-w-sm mx-auto space-y-4">
              <div>
                <label htmlFor="secret-key" className="sr-only">Secret Key</label>
                <input
                  ref={keyInputRef}
                  id="secret-key"
                  type="password"
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 outline-none ${keyError ? 'border-red-500' : 'border-white/10 focus:border-primary/50'}`}
                  placeholder="Enter secret key"
                  value={secretKey}
                  onChange={handleKeyChange}
                  autoFocus
                  aria-required="true"
                  aria-invalid={keyError ? 'true' : 'false'}
                  aria-describedby={keyError ? 'key-error' : undefined}
                />
              </div>
              {keyError && (
                <p id="key-error" className="text-red-400 text-sm" role="alert"><span aria-hidden="true">⚠️</span> Incorrect secret key</p>
              )}
              <button type="submit" className="w-full px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90">
                Unlock Answers <span aria-hidden="true">🔓</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4"><span aria-hidden="true">📊</span> Question Analysis</h3>
            <div className="overflow-x-auto rounded-xl bg-black/20">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-3 sm:px-4 py-3 text-left text-sm font-semibold text-gray-300 w-12" scope="col">#</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-sm font-semibold text-gray-300" scope="col">Question</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-sm font-semibold text-gray-300 w-32" scope="col">Correct</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-sm font-semibold text-gray-300 w-32" scope="col">Your Answer</th>
                    <th className="px-3 sm:px-4 py-3 text-center text-sm font-semibold text-gray-300 w-12" scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question, index) => {
                    const result = results.questionResults[index];
                    const correctIdx = Array.isArray(question.isCorrect) ? question.isCorrect : [question.isCorrect];
                    const correctText = correctIdx.map(i => question.options[i]?.text).filter(Boolean).join(', ') || '-';
                    
                    const studentIdx = answers[question.id];
                    let studentText = '-';
                    let statusClass = 'text-yellow-400';
                    let statusIcon = '⏭️';
                    let statusLabel = 'Skipped';
                    
                    if (studentIdx !== undefined) {
                      const idx = Array.isArray(studentIdx) ? studentIdx : [studentIdx];
                      if (idx.length > 0) {
                        studentText = idx.map(i => question.options[i]?.text).filter(Boolean).join(', ') || '-';
                        statusClass = result.isCorrect ? 'text-green-400' : 'text-red-400';
                        statusIcon = result.isCorrect ? '✅' : '❌';
                        statusLabel = result.isCorrect ? 'Correct' : 'Wrong';
                      }
                    }

                    const truncated = question.text.length > 40 ? question.text.substring(0, 40) + '...' : question.text;

                    return (
                      <tr key={question.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-3 sm:px-4 py-3 text-sm">Q{question.questionNumber}</td>
                        <td className="px-3 sm:px-4 py-3 text-sm" title={question.text}>{truncated}</td>
                        <td className="px-3 sm:px-4 py-3 text-sm text-green-400">{correctText}</td>
                        <td className={`px-3 sm:px-4 py-3 text-sm ${statusClass}`}>{studentText}</td>
                        <td className="px-3 sm:px-4 py-3 text-center" aria-label={statusLabel}>{statusIcon}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <aside className="text-center p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-4 sm:mb-6" aria-label="Study tip">
          <p className="text-sm text-gray-300"><span aria-hidden="true">💡</span> Review answers above to understand correct solutions. Practice makes perfect!</p>
        </aside>

        <div className="text-center">
          <button 
            className="px-6 sm:px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
            onClick={onRestart}
            aria-label="Return to home screen"
          >
            Back to Home <span aria-hidden="true">🏠</span>
          </button>
        </div>
      </article>
    </div>
  );
};

export default ResultScreen;
