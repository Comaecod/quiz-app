/**
 * IntroScreen Component
 * Welcome screen with exam details and start button
 */
const IntroScreen = ({ config, onStart }) => {
  const { 
    examTitle, 
    className, 
    schoolName, 
    timeLimitMinutes, 
    teacher, 
    invigilator, 
    subject,
    totalMarks,
    wrongAnswerPenaltyFraction
  } = config;

  return (
    <div className='glass-card' style={{ animation: 'slideUp 0.6s ease-out' }}>
      {/* School header */}
      <div className='text-center mb-xl'>
        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>🎓</div>
        <h1 className='heading' style={{ fontSize: '1.75rem' }}>{schoolName}</h1>
      </div>

      {/* Exam title */}
      <div className='text-center mb-xl'>
        <h2 className='subheading exam-title'>{examTitle}</h2>
        <p className='exam-subtitle'>Class {className} | {subject}</p>
      </div>

      {/* Teacher & Invigilator */}
      <div className='header-info mb-lg'>
        <div className='info-badge'>
          <span>👩‍🏫</span>
          <span>Teacher: {teacher || 'N/A'}</span>
        </div>
        <div className='info-badge'>
          <span>👨‍💼</span>
          <span>Invigilator: {invigilator || 'N/A'}</span>
        </div>
      </div>

      {/* Exam info badges */}
      <div className='header-info'>
        <div className='info-badge'>
          <span>⏱️</span>
          <span>{timeLimitMinutes} Minutes</span>
        </div>
        <div className='info-badge'>
          <span>📊</span>
          <span>{totalMarks} Marks</span>
        </div>
      </div>

      {/* Instructions */}
      <div className='instructions'>
        <h3 className='instructions-title'><span>📋</span> Instructions</h3>
        <ul className='instructions-list'>
          <li>Answer all questions to the best of your ability</li>
          <li>No back navigation - answer each question once</li>
          <li>Timer starts when you begin the quiz</li>
          <li>Quiz auto-submits when time runs out</li>
          {wrongAnswerPenaltyFraction > 0 && (
            <li>Wrong answers have -{wrongAnswerPenaltyFraction * 100}% negative marking</li>
          )}
        </ul>
      </div>

      {/* Start button */}
      <div className='text-center mt-xl'>
        <button className='btn btn-primary btn-lg' onClick={onStart}>
          Start Test <span>👉</span>
        </button>
      </div>
    </div>
  );
};

export default IntroScreen;
