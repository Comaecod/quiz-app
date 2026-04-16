const ClassSelectionScreen = ({ examType, classes, onSelect, onBack }) => {
  return (
    <div className="glass-card w-full max-w-2xl animate-slideUp">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">👥</div>
        <h2 className="text-2xl font-bold text-white mb-2">{examType}</h2>
        <p className="text-gray-400">Select your Class</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {classes.map((classNum) => (
          <button
            key={classNum}
            onClick={() => onSelect(classNum)}
            className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all text-center group"
          >
            <div className="text-3xl font-bold text-white group-hover:text-primary transition-colors">
              Class
            </div>
            <div className="text-4xl font-bold text-white group-hover:text-primary transition-colors">
              {classNum}
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl font-medium bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
        >
          ← Back to Assessment Types
        </button>
      </div>
    </div>
  );
};

export default ClassSelectionScreen;
