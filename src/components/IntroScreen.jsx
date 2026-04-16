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
    <div className="glass-card w-full max-w-lg animate-slideUp">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎓</div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {schoolName}
        </h1>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-white mb-2">{examTitle}</h2>
        <p className="text-gray-400">Class {className} | {subject}</p>
      </div>

      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-sm">
          <span>👩‍🏫</span>
          <span>Teacher: {teacher || 'N/A'}</span>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-sm">
          <span>👨‍💼</span>
          <span>Invigilator: {invigilator || 'N/A'}</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-sm">
          <span>⏱️</span>
          <span>{timeLimitMinutes} Minutes</span>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-sm">
          <span>📊</span>
          <span>{totalMarks} Marks</span>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-8 flex-wrap">
        <button 
          className="px-8 py-4 rounded-xl font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all hover:scale-105 min-w-[200px] flex items-center justify-center gap-2 text-lg" 
          onClick={onStart}
        >
          <span className="text-2xl">📝</span>
          <span>Assessments</span>
        </button>
        <button 
          className="px-8 py-4 rounded-xl font-medium bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all min-w-[200px] flex items-center justify-center gap-2 text-lg" 
          onClick={onReports}
        >
          <span className="text-2xl">📊</span>
          <span>Reports</span>
        </button>
      </div>
    </div>
  );
};

export default IntroScreen;
