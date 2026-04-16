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
  }, []);

  const handleKeySubmit = (e) => {
    e.preventDefault();
    
    if (secretKey.trim() === config.secretKey) {
      setIsUnlocked(true);
      setKeyError(false);
    } else {
      setKeyError(true);
    }
  };

  const handleKeyChange = (e) => {
    setSecretKey(e.target.value);
    if (keyError) setKeyError(false);
  };

  return (
    <div className="w-full max-w-3xl animate-slideUp">
      <div className="glass-card">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">
            {performance.emoji} {config.examTitle} Complete {performance.emoji}
          </h2>
          <p className="text-gray-400">
            Please remain seated. Do not look around. 👀
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
          <h3 className="text-xl font-semibold mb-1">
            {formatName(studentInfo.firstName)} {formatName(studentInfo.lastName)}
          </h3>
          <p className="text-gray-400">Roll Number: {studentInfo.rollNumber}</p>
        </div>

        <div className="text-center mb-4">
          <div className="text-6xl font-bold">
            {results.totalEarned.toFixed(1)}
            <span className="text-3xl text-gray-400">/{results.totalMarks}</span>
          </div>
        </div>

        <div className="text-center mb-4">
          <span className="text-3xl font-semibold">{results.percentage}% {performance.emoji}</span>
        </div>

        <div className="text-center mb-6">
          <span className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-2xl font-bold animate-bounce">
            {results.grade}
          </span>
        </div>

        <p className="text-center text-gray-400 mb-6">{performance.message}</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
            <div className="text-3xl font-bold text-green-400">{results.correctCount}</div>
            <div className="text-sm text-gray-400">✅ Correct</div>
          </div>
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
            <div className="text-3xl font-bold text-red-400">{results.wrongCount}</div>
            <div className="text-sm text-gray-400">❌ Wrong</div>
          </div>
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center">
            <div className="text-3xl font-bold text-yellow-400">{results.skippedCount}</div>
            <div className="text-sm text-gray-400">⏭️ Skipped</div>
          </div>
        </div>

        {hasSecretKey && !isUnlocked ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Answers Hidden</h3>
            <p className="text-gray-400 mb-6">Enter the secret key to view question analysis</p>
            
            <form onSubmit={handleKeySubmit} className="max-w-sm mx-auto space-y-4">
              <input
                type="password"
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 outline-none ${keyError ? 'border-red-500' : 'border-white/10 focus:border-primary/50'}`}
                placeholder="Enter secret key"
                value={secretKey}
                onChange={handleKeyChange}
                autoFocus
              />
              {keyError && (
                <p className="text-red-400 text-sm">⚠️ Incorrect secret key</p>
              )}
              <button type="submit" className="w-full px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90">
                Unlock Answers 🔓
              </button>
            </form>
          </div>
        ) : (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">📊 Question Analysis</h3>
            <div className="overflow-x-auto rounded-xl bg-black/20">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300 w-14">#</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Question</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300 w-36">Correct</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300 w-36">Your Answer</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300 w-16">Status</th>
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
                    
                    if (studentIdx !== undefined) {
                      const idx = Array.isArray(studentIdx) ? studentIdx : [studentIdx];
                      if (idx.length > 0) {
                        studentText = idx.map(i => question.options[i]?.text).filter(Boolean).join(', ') || '-';
                        statusClass = result.isCorrect ? 'text-green-400' : 'text-red-400';
                        statusIcon = result.isCorrect ? '✅' : '❌';
                      }
                    }

                    const truncated = question.text.length > 40 ? question.text.substring(0, 40) + '...' : question.text;

                    return (
                      <tr key={question.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3 text-sm">Q{question.questionNumber}</td>
                        <td className="px-4 py-3 text-sm" title={question.text}>{truncated}</td>
                        <td className="px-4 py-3 text-sm text-green-400">{correctText}</td>
                        <td className={`px-4 py-3 text-sm ${statusClass}`}>{studentText}</td>
                        <td className="px-4 py-3 text-center">{statusIcon}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="text-center p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-6">
          <p className="text-sm text-gray-300">💡 Review answers above to understand correct solutions. Practice makes perfect!</p>
        </div>

        <div className="text-center">
          <button 
            className="px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
            onClick={onRestart}
          >
            Back to Home 🏠
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
