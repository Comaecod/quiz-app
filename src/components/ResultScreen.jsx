import { useMemo, useEffect, useRef } from 'react';
import { 
  calculateTotalScore, 
  getPerformanceMessage,
} from '../utils/scoring';
import { saveQuizResult } from '../services/firebaseService';

/**
 * ResultScreen Component
 * Displays the final quiz results with detailed analysis
 */
const ResultScreen = ({ 
  questions, 
  answers, 
  studentInfo, 
  config,
  onRestart 
}) => {
  const { examTitle, wrongAnswerPenaltyFraction } = config;
  const hasSaved = useRef(false);

  const results = useMemo(() => {
    return calculateTotalScore(
      questions, 
      answers, 
      wrongAnswerPenaltyFraction
    );
  }, [questions, answers, wrongAnswerPenaltyFraction]);

  const performance = getPerformanceMessage(results.percentage);

  useEffect(() => {
    if (!hasSaved.current) {
      hasSaved.current = true;
      saveQuizResult(studentInfo, config, results).catch(console.error);
    }
  }, []);

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
            {performance.emoji} {examTitle} is now over! {performance.emoji}
          </h2>
          <p className="subheading" style={{ fontSize: '1rem', marginTop: 'var(--space-sm)' }}>
            Please remain seated where you are 🪑
          </p>
          <p className="subheading" style={{ fontSize: '0.875rem', opacity: 0.7 }}>
            Call the invigilator to check your score
          </p>
          <p className="subheading" style={{ fontSize: '0.875rem', opacity: 0.7 }}>
            Do not look around 👀
          </p>
        </div>

        {/* Student Info */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-lg)',
          marginBottom: 'var(--space-xl)'
        }}>
          <h3 style={{ 
            color: 'var(--text-light)', 
            fontSize: '1.25rem',
            marginBottom: 'var(--space-sm)'
          }}>
            {studentInfo.firstName} {studentInfo.lastName}
          </h3>
          <p style={{ color: 'var(--text-light)', opacity: 0.8 }}>
            Roll Number: {studentInfo.rollNumber}
          </p>
        </div>

        {/* Score Display */}
        <div className="result-score">
          {results.totalEarned.toFixed(1)}
          <span style={{ 
            fontSize: '1.5rem', 
            opacity: 0.8,
            fontWeight: '500'
          }}>
            /{results.totalMarks}
          </span>
        </div>

        <div className="result-percentage">
          {results.percentage}% {performance.emoji}
        </div>

        <div className="result-grade" style={{
          animation: 'bounce 1s ease-out'
        }}>
          {results.grade}
        </div>

        <p style={{ 
          color: 'var(--text-light)',
          fontSize: '1.125rem',
          fontWeight: '600',
          marginTop: 'var(--space-md)'
        }}>
          {performance.message}
        </p>

        {/* Stats Grid */}
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

        {/* Detailed Results Table */}
        <div className="result-table-container">
          <h3 className="result-table-title">
            📊 Detailed Question Analysis
          </h3>
          <div style={{ 
            overflowX: 'auto',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.1)'
          }}>
            <table className="result-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>Question</th>
                  <th style={{ width: '150px' }}>Correct Answer</th>
                  <th style={{ width: '150px' }}>Your Answer</th>
                  <th style={{ width: '60px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question, index) => {
                  const result = results.questionResults[index];
                  const correctAnswers = Array.isArray(question.isCorrect)
                    ? question.isCorrect
                    : [question.isCorrect];
                  
                  const correctText = correctAnswers
                    .map(i => question.options[i]?.text)
                    .filter(Boolean)
                    .join(', ') || '-';
                  
                  const studentAnswerIndices = answers[question.id];
                  let studentText = '-';
                  let statusClass = 'skipped-answer';
                  let statusIcon = '⏭️';
                  
                  if (studentAnswerIndices !== undefined) {
                    const indices = Array.isArray(studentAnswerIndices)
                      ? studentAnswerIndices
                      : [studentAnswerIndices];
                    
                    if (indices.length > 0) {
                      studentText = indices
                        .map(i => question.options[i]?.text)
                        .filter(Boolean)
                        .join(', ') || '-';
                      
                      if (result.isCorrect) {
                        statusClass = 'correct-answer';
                        statusIcon = '✅';
                      } else {
                        statusClass = 'wrong-answer';
                        statusIcon = '❌';
                      }
                    }
                  }
                  
                  const truncatedQuestion = question.text.length > 50
                    ? question.text.substring(0, 50) + '...'
                    : question.text;
                  
                  return (
                    <tr key={question.id}>
                      <td>Q{question.questionNumber}</td>
                      <td title={question.text}>{truncatedQuestion}</td>
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

        {/* Restart Button */}
        {/* <div className="text-center mt-xl">
          <button
            className="btn btn-primary btn-lg"
            onClick={onRestart}
          >
            🔄 Take Quiz Again
          </button>
        </div> */}

        {/* Footer Message */}
        <div style={{
          marginTop: 'var(--space-xl)',
          padding: 'var(--space-md)',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-md)'
        }}>
          <p style={{ 
            color: 'var(--text-light)', 
            fontSize: '0.875rem',
            opacity: 0.8
          }}>
            💡 Tip: Review your answers above to understand the correct solutions.
            Practice makes perfect!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
