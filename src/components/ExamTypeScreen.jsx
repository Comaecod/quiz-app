const ExamTypeScreen = ({ examTypes, onSelect }) => {
  const getExamIcon = (type) => {
    const icons = {
      'Slip Test': '📝',
      'Bridge Course': '🌉',
      'Unit Test 1': '📖',
      'Term 1': '📚',
      'Unit Test 2': '📖',
      'Term 2': '📚',
      'Learning': '📚'
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
      'Learning': 'Learn concepts and test yourself'
    };
    return descriptions[type] || 'Assessment';
  };

  return (
    <div className="glass-card w-full max-w-2xl animate-slideUp">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🎓</div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
          Sri Kanchi Kamakoti Sankara Vidyalaya
        </h1>
        <h2 className="text-xl font-semibold text-white">Select Assessment Type</h2>
        <p className="text-gray-400 mt-2">Choose the type of exam you want to take</p>
      </div>

      <div className="space-y-3">
        {examTypes.map((type) => (
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
    </div>
  );
};

export default ExamTypeScreen;
