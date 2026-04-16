import { useState } from 'react';
import { formatName } from '../utils/format';

/**
 * RollNumberScreen Component
 * Collects student details before starting quiz
 */
const RollNumberScreen = ({ onStartQuiz, questionsCount }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    rollNumber: ''
  });
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form fields
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

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onStartQuiz({
        firstName: formatName(formData.firstName),
        lastName: formatName(formData.lastName),
        rollNumber: formData.rollNumber.trim()
      });
    }
  };

  return (
    <div className="glass-card" style={{ animation: 'slideUp 0.6s ease-out' }}>
      {/* Header */}
      <div className="text-center mb-xl">
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>✍️</div>
        <h2 className="heading">Student Details</h2>
        <p className="subheading" style={{ fontSize: '1rem', opacity: 0.8 }}>
          Fill in your details to begin
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* First Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="firstName">First Name 👤</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className={`form-input ${errors.firstName ? 'error' : ''}`}
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
            autoComplete="given-name"
          />
          {errors.firstName && (
            <div className="error-message"><span>⚠️</span> {errors.firstName}</div>
          )}
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="lastName">Last Name 👤</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className={`form-input ${errors.lastName ? 'error' : ''}`}
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
            autoComplete="family-name"
          />
          {errors.lastName && (
            <div className="error-message"><span>⚠️</span> {errors.lastName}</div>
          )}
        </div>

        {/* Roll Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="rollNumber">Roll Number 🔢</label>
          <input
            type="text"
            id="rollNumber"
            name="rollNumber"
            className={`form-input ${errors.rollNumber ? 'error' : ''}`}
            placeholder="Enter your roll number"
            value={formData.rollNumber}
            onChange={handleChange}
            autoComplete="off"
          />
          {errors.rollNumber && (
            <div className="error-message"><span>⚠️</span> {errors.rollNumber}</div>
          )}
        </div>

        {/* Info badge */}
        <div className="text-center mt-lg mb-lg">
          <div className="info-badge" style={{ background: 'rgba(102, 126, 234, 0.3)' }}>
            <span>📝</span>
            <span>{questionsCount} questions will be selected randomly</span>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-success btn-lg btn-block">
          Begin Quiz <span>🏁</span>
        </button>
      </form>
    </div>
  );
};

export default RollNumberScreen;
