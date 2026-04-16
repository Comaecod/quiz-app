import { useState } from 'react';

const PreAssessmentScreen = ({ config, onSuccess, onBack }) => {
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (secretKey.trim() === config.preassessmentsecretkey) {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setLoading(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  const handleChange = (e) => {
    setSecretKey(e.target.value);
    if (error) setError(false);
  };

  return (
    <div className="glass-card w-full max-w-md animate-slideUp">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-white mb-2">Enter Assessment Key</h2>
        <p className="text-gray-400">Get the key from your teacher to begin</p>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">{config.examType}</div>
          <div className="text-lg font-semibold text-white">Class {config.classNum} - {config.subject}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="password"
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 outline-none transition-all ${
              error ? 'border-red-500' : 'border-white/10 focus:border-primary/50'
            }`}
            placeholder="Enter assessment key"
            value={secretKey}
            onChange={handleChange}
            autoFocus
            disabled={loading}
          />
          {error && (
            <p className="text-red-400 text-sm mt-2">Incorrect key. Please try again.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !secretKey.trim()}
          className="w-full px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Start Assessment'}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 rounded-xl font-medium bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            ← Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default PreAssessmentScreen;
