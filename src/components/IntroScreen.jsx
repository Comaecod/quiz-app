import { calculateTotalMarks } from '../data/constants';

/**
 * IntroScreen Component
 * Displays the welcome screen with exam details and start button
 */
const IntroScreen = ({ config, onStart }) => {
  const { examTitle, className, schoolName, timeLimitMinutes } = config;

  return (
    <div
      className='glass-card'
      style={{ animation: 'slideUp 0.6s ease-out' }}>
      {/* School Logo/Icon */}
      <div className='text-center mb-xl'>
        <div
          style={{
            fontSize: '4rem',
            marginBottom: 'var(--space-md)',
          }}>
          🎓
        </div>
        <h1
          className='heading'
          style={{ fontSize: '1.75rem' }}>
          {schoolName}
        </h1>
      </div>

      {/* Exam Title */}
      <div className='text-center mb-xl'>
        <h2
          className='subheading'
          style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }}>
          {examTitle}
        </h2>
        <p
          className='text-muted'
          style={{
            color: 'var(--text-primary)',
            fontSize: '1.25rem',
            fontWeight: 800,
            marginTop: 'var(--space-sm)',
          }}>
          Class {className} Assessment
        </p>
      </div>

      {/* Exam Info Badges */}
      <div className='header-info'>
        <div className='info-badge'>
          <span>📚</span>
          <span>{config.questionsPerPaper} Questions</span>
        </div>
        <div className='info-badge'>
          <span>⏱️</span>
          <span>{timeLimitMinutes} Minutes</span>
        </div>
        <div className='info-badge'>
          <span>📊</span>
          <span>{calculateTotalMarks(config.questionsPerPaper)} Marks</span>
        </div>
      </div>

      {/* Instructions */}
      <div className='instructions'>
        <h3 className='instructions-title'>
          <span>📋</span> Instructions
        </h3>
        <ul className='instructions-list'>
          <li>Answer all questions to the best of your ability</li>
          <li>No back navigation - answer each question once</li>
          <li>Timer starts when you begin the quiz</li>
          <li>Quiz auto-submits when time runs out</li>
          <li>Wrong answers have negative marking</li>
        </ul>
      </div>

      {/* Start Button */}
      <div className='text-center mt-xl'>
        <button
          className='btn btn-primary btn-lg'
          onClick={onStart}
          style={{
            fontSize: '1.125rem',
            padding: 'var(--space-lg) var(--space-2xl)',
          }}>
          Start Test
          <span style={{ fontSize: '1.25rem' }}>👉</span>
        </button>
      </div>
    </div>
  );
};

export default IntroScreen;
