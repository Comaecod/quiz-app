const EmptyState = () => {
  return (
    <div className="glass-card w-full max-w-md text-center animate-slideUp">
      <div className="text-6xl mb-4">📋</div>
      <h2 className="text-2xl font-bold mb-4">No Exam Available</h2>
      <p className="text-gray-400 mb-4">
        There is no exam scheduled at the moment.
      </p>
      <p className="text-gray-400">
        Please check back later or contact your teacher for more information.
      </p>
    </div>
  );
};

export default EmptyState;
