/**
 * IntroScreen Component
 * Welcome screen with exam details and two entry points: Assessments and Reports
 */
const IntroScreen = ({ config, onStart, onReports }) => {
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

      {/* Entry point buttons */}
      <div className='flex justify-center gap-lg mt-xl' style={{ flexWrap: 'wrap' }}>
        <button 
          className='btn btn-primary btn-lg flex items-center gap-sm' 
          style={{ minWidth: '200px' }}
          onClick={onStart}
        >
          <span style={{ fontSize: '1.5rem' }}>📝</span>
          <span>Assessments</span>
        </button>
        <button 
          className='btn btn-secondary btn-lg flex items-center gap-sm' 
          style={{ minWidth: '200px' }}
          onClick={onReports}
        >
          <span style={{ fontSize: '1.5rem' }}>📊</span>
          <span>Reports</span>
        </button>
      </div>
    </div>
  );
};

export default IntroScreen;
