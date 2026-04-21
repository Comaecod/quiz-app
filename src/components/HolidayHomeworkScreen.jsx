const HolidayHomeworkScreen = ({ config, onBack }) => {
  const { content, examTitle, subject, classNum, teacher } = config;

  if (!content) {
    return (
      <div className="glass-card w-full max-w-2xl animate-slideUp">
        <p className="text-gray-400">No content available.</p>
        <button onClick={onBack} className="mt-4 px-6 py-2 rounded-lg bg-primary text-white">
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card w-full max-w-2xl animate-slideUp">
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🏖️</div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {examTitle}
        </h1>
        <p className="text-gray-400">Class {classNum} - {subject}</p>
        {teacher && <p className="text-sm text-gray-500 mt-1">Teacher: {teacher}</p>}
      </div>

      <div className="space-y-6 text-left">
        {content.period && (
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h3 className="font-semibold text-primary mb-1">📅 Duration</h3>
            <p className="text-gray-300">{content.period}</p>
          </div>
        )}

        {content.projects && content.projects.length > 0 && (
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h3 className="font-semibold text-primary mb-3">📋 Projects</h3>
            <div className="space-y-4">
              {content.projects.map((project, index) => (
                <div key={index} className="pl-4 border-l-2 border-primary/30">
                  <h4 className="font-medium text-white">{index + 1}. {project.title}</h4>
                  <p className="text-gray-400 text-sm mt-1">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {content.materials && (
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h3 className="font-semibold text-primary mb-1">🎒 Materials Required</h3>
            <p className="text-gray-300">{content.materials}</p>
          </div>
        )}

        {content.submission && (
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h3 className="font-semibold text-primary mb-1">📤 Submission</h3>
            <p className="text-gray-300">{content.submission}</p>
          </div>
        )}

        {content.grading && (
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h3 className="font-semibold text-primary mb-2">📊 Grading Criteria</h3>
            <div className="space-y-2 text-sm">
              {content.grading.belowAverage && (
                <p className="text-gray-400"><span className="text-red-400">Below Average:</span> {content.grading.belowAverage}</p>
              )}
              {content.grading.average && (
                <p className="text-gray-400"><span className="text-yellow-400">Average:</span> {content.grading.average}</p>
              )}
              {content.grading.bright && (
                <p className="text-gray-400"><span className="text-green-400">Bright:</span> {content.grading.bright}</p>
              )}
            </div>
          </div>
        )}

        {content.note && (
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-primary italic">💡 {content.note}</p>
          </div>
        )}
      </div>

      <button
        onClick={onBack}
        className="mt-6 w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center text-gray-400 hover:text-white"
      >
        ← Back
      </button>
    </div>
  );
};

export default HolidayHomeworkScreen;
