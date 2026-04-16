import { useState } from 'react';
import { formatName } from '../utils/format';

const RollNumberScreen = ({ onStartQuiz, questionsCount, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    rollNumber: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required';
    } else if (!/^\d+$/.test(formData.rollNumber.trim())) {
      newErrors.rollNumber = 'Must be numeric';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onStartQuiz({
        firstName: formatName(formData.firstName),
        lastName: formatName(formData.lastName),
        rollNumber: Number(formData.rollNumber.trim()) || formData.rollNumber.trim()
      });
    }
  };

  return (
    <div className="glass-card w-full max-w-md animate-slideUp">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">✍️</div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Student Details
        </h2>
        <p className="text-gray-400 text-lg mt-2">
          Fill in your details to begin
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="firstName">
            First Name 👤
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 outline-none transition-all ${errors.firstName ? 'border-red-500' : 'border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20'}`}
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
            autoComplete="given-name"
          />
          {errors.firstName && (
            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
              <span>⚠️</span> {errors.firstName}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="lastName">
            Last Name 👤
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 outline-none transition-all ${errors.lastName ? 'border-red-500' : 'border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20'}`}
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
            autoComplete="family-name"
          />
          {errors.lastName && (
            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
              <span>⚠️</span> {errors.lastName}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="rollNumber">
            Roll Number 🔢
          </label>
          <input
            type="text"
            id="rollNumber"
            name="rollNumber"
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 outline-none transition-all ${errors.rollNumber ? 'border-red-500' : 'border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20'}`}
            placeholder="Enter your roll number"
            value={formData.rollNumber}
            onChange={handleChange}
            autoComplete="off"
          />
          {errors.rollNumber && (
            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
              <span>⚠️</span> {errors.rollNumber}
            </p>
          )}
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-sm">
            <span>📝</span>
            <span>{questionsCount} questions will be selected randomly</span>
          </div>
        </div>

        <button type="submit" className="w-full px-8 py-4 rounded-xl font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 transition-all text-lg mb-3">
          Begin Quiz <span>🏁</span>
        </button>
        
        <div className="text-center">
          <button type="button" className="px-6 py-3 rounded-xl font-medium bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all" onClick={onBack}>
            ← Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default RollNumberScreen;
