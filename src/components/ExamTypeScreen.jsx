const ExamTypeScreen = ({ examTypes, onSelect, showMainCategory, setShowMainCategory }) => {
  const getExamIcon = (type) => {
    const icons = {
      'Slip Test': '📝',
      'Bridge Course': '🌉',
      'Unit Test 1': '📖',
      'Term 1': '📚',
      'Unit Test 2': '📖',
      'Term 2': '📚',
      'Holiday Homework': '🏖️',
      'Assessments': '📋'
    };
    return icons[type] || '📋';
  };

  const getExamDescription = (type) => {
    const descriptions = {
      'Slip Test': 'Short assessment tests',
      'Bridge Course': 'Foundation courses',
      'Unit Test 1': 'First unit evaluation',
      'Term 1': 'First term examination',
      'Unit Test 2': 'Second unit evaluation',
      'Term 2': 'Second term examination',
      'Holiday Homework': 'View holiday homework projects and submissions',
      'Assessments': 'Take tests, quizzes and exams'
    };
    return descriptions[type] || 'Assessment';
  };

  if (showMainCategory) {
    return (
      <div className="glass-card w-full max-w-2xl animate-slideUp">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎓</div>
          <h2 className="text-2xl font-semibold text-white">Welcome</h2>
          <p className="text-gray-400 mt-2">Choose what you want to access</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setShowMainCategory(false)}
            className="w-full p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all text-left flex items-center gap-4 group"
          >
            <span className="text-4xl">📋</span>
            <div className="flex-1">
              <div className="font-semibold text-white text-lg group-hover:text-primary transition-colors">Assessments</div>
              <div className="text-sm text-gray-400">Take tests, quizzes and exams</div>
            </div>
            <span className="text-gray-500 group-hover:text-primary transition-colors text-xl">→</span>
          </button>

          <button
            onClick={() => onSelect('Holiday Homework')}
            className="w-full p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all text-left flex items-center gap-4 group"
          >
            <span className="text-4xl">🏖️</span>
            <div className="flex-1">
              <div className="font-semibold text-white text-lg group-hover:text-primary transition-colors">Holiday Homework</div>
              <div className="text-sm text-gray-400">View holiday homework projects and submissions</div>
            </div>
            <span className="text-gray-500 group-hover:text-primary transition-colors text-xl">→</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card w-full max-w-2xl animate-slideUp">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">📋</div>
        <h2 className="text-xl font-semibold text-white">Assessments</h2>
        <p className="text-gray-400 mt-2">Choose the type of exam you want to take</p>
      </div>

      <div className="space-y-3">
        {examTypes.filter(t => t !== 'Holiday Homework').map((type) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all text-left flex items-center gap-4 group"
          >
            <span className="text-3xl">{getExamIcon(type)}</span>
            <div className="flex-1">
              <div className="font-semibold text-white group-hover:text-primary transition-colors">{type}</div>
              <div className="text-sm text-gray-400">{getExamDescription(type)}</div>
            </div>
            <span className="text-gray-500 group-hover:text-primary transition-colors">→</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowMainCategory(true)}
        className="mt-6 w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center text-gray-400 hover:text-white"
      >
        ← Back to Home
      </button>
    </div>
  );
};

export default ExamTypeScreen;
