import { useState, useMemo, useEffect, useRef } from 'react';
import { calculateTotalScore, getPerformanceMessage } from '../utils/scoring';
import { formatName } from '../utils/format';
import { saveQuizResult } from '../services/firebaseService';

/**
 * ResultScreen Component
 * Shows final quiz results with detailed analysis (locked by secret key)
 */
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

  // Check if answers should be hidden (if secret key is configured)
  const hasSecretKey = config.secretKey && config.secretKey.length > 0;

  // Calculate scores
  const results = useMemo(() => {
    return calculateTotalScore(questions, answers, config.wrongAnswerPenaltyFraction);
  }, [questions, answers, config.wrongAnswerPenaltyFraction]);

  const performance = getPerformanceMessage(results.percentage);

  // Save to Firebase (once)
  useEffect(() => {
    if (!hasSaved.current) {
      hasSaved.current = true;
      saveQuizResult(studentInfo, config, results).catch(console.error);
    }
  }, []);

  // Handle secret key submission
  const handleKeySubmit = (e) => {
    e.preventDefault();
    
    if (secretKey.trim() === config.secretKey) {
      setIsUnlocked(true);
      setKeyError(false);
    } else {
      setKeyError(true);
    }
  };

  // Handle key input change
  const handleKeyChange = (e) => {
    setSecretKey(e.target.value);
    if (keyError) setKeyError(false);
  };

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '800px',
      animation: 'slideUp 0.6s ease-out'
    }}>
      <div className="glass-card result-container">
        {/* Header */}
        <div className="result-header">
          <h2 className="heading" style={{ fontSize: '1.5rem' }}>
            {performance.emoji} {config.examTitle} Complete {performance.emoji}
          </h2>
          <p className="subheading result-subtitle">
            Please remain seated. Do not look around. 👀
          </p>
        </div>

        {/* Student info card */}
        <div className="student-card">
          <h3 className="student-name">
            {formatName(studentInfo.firstName)} {formatName(studentInfo.lastName)}
          </h3>
          <p>Roll Number: {studentInfo.rollNumber}</p>
        </div>

        {/* Score display */}
        <div className="result-score">
          {results.totalEarned.toFixed(1)}
          <span className="score-total">/{results.totalMarks}</span>
        </div>

        <div className="result-percentage">
          {results.percentage}% {performance.emoji}
        </div>

        <div className="result-grade" style={{ animation: 'bounce 1s ease-out' }}>
          {results.grade}
        </div>

        <p className="performance-message">{performance.message}</p>

        {/* Stats grid */}
        <div className="result-stats">
          <div className="stat-card correct">
            <div className="stat-value">{results.correctCount}</div>
            <div className="stat-label">✅ Correct</div>
          </div>
          <div className="stat-card wrong">
            <div className="stat-value">{results.wrongCount}</div>
            <div className="stat-label">❌ Wrong</div>
          </div>
          <div className="stat-card skipped">
            <div className="stat-value">{results.skippedCount}</div>
            <div className="stat-label">⏭️ Skipped</div>
          </div>
        </div>

        {/* Secret Key Unlock or Answers Table */}
        {hasSecretKey && !isUnlocked ? (
          /* Secret Key Form */
          <div className="unlock-section">
            <div className="unlock-icon">🔒</div>
            <h3 className="unlock-title">Answers Hidden</h3>
            <p className="unlock-description">
              Enter the secret key to view question analysis
            </p>
            
            <form onSubmit={handleKeySubmit} className="unlock-form">
              <input
                type="password"
                className={`form-input unlock-input ${keyError ? 'error' : ''}`}
                placeholder="Enter secret key"
                value={secretKey}
                onChange={handleKeyChange}
                autoFocus
              />
              {keyError && (
                <p className="error-message unlock-error">
                  ⚠️ Incorrect secret key
                </p>
              )}
              <button type="submit" className="btn btn-primary">
                Unlock Answers 🔓
              </button>
            </form>
          </div>
        ) : (
          /* Detailed question analysis table */
          <div className="result-table-container">
            <h3 className="result-table-title">📊 Question Analysis</h3>
            <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.1)' }}>
              <table className="result-table">
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>#</th>
                    <th>Question</th>
                    <th style={{ width: '150px' }}>Correct</th>
                    <th style={{ width: '150px' }}>Your Answer</th>
                    <th style={{ width: '60px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question, index) => {
                    const result = results.questionResults[index];
                    const correctIdx = Array.isArray(question.isCorrect) ? question.isCorrect : [question.isCorrect];
                    const correctText = correctIdx.map(i => question.options[i]?.text).filter(Boolean).join(', ') || '-';
                    
                    const studentIdx = answers[question.id];
                    let studentText = '-';
                    let statusClass = 'skipped-answer';
                    let statusIcon = '⏭️';
                    
                    if (studentIdx !== undefined) {
                      const idx = Array.isArray(studentIdx) ? studentIdx : [studentIdx];
                      if (idx.length > 0) {
                        studentText = idx.map(i => question.options[i]?.text).filter(Boolean).join(', ') || '-';
                        statusClass = result.isCorrect ? 'correct-answer' : 'wrong-answer';
                        statusIcon = result.isCorrect ? '✅' : '❌';
                      }
                    }

                    const truncated = question.text.length > 50 
                      ? question.text.substring(0, 50) + '...' 
                      : question.text;

                    return (
                      <tr key={question.id}>
                        <td>Q{question.questionNumber}</td>
                        <td title={question.text}>{truncated}</td>
                        <td className="correct-answer">{correctText}</td>
                        <td className={statusClass}>{studentText}</td>
                        <td>{statusIcon}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer tip */}
        <div className="tip-box">
          <p>💡 Review answers above to understand correct solutions. Practice makes perfect!</p>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
