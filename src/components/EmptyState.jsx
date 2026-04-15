/**
 * EmptyState Component
 * Displayed when question bank is empty
 */
const EmptyState = ({ message, icon = '📭' }) => {
  return (
    <div className="glass-card empty-state" style={{ 
      animation: 'slideUp 0.6s ease-out',
      maxWidth: '500px'
    }}>
      <div className="empty-icon">{icon}</div>
      <h2 className="empty-title">Question Bank Empty</h2>
      <p className="empty-description">
        📭 {message || 'No questions available. Please add questions to the question bank to start the quiz.'}
      </p>
      
      <div style={{
        marginTop: 'var(--space-xl)',
        padding: 'var(--space-lg)',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 'var(--radius-md)',
        textAlign: 'left'
      }}>
        <h3 style={{ 
          color: 'var(--text-light)', 
          fontSize: '1rem',
          marginBottom: 'var(--space-md)'
        }}>
          📝 How to add questions:
        </h3>
        <ol style={{ 
          color: 'var(--text-light)', 
          opacity: 0.9,
          paddingLeft: 'var(--space-lg)',
          fontSize: '0.875rem',
          lineHeight: '1.8'
        }}>
          <li>Open <code style={{ 
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>src/data/constants.js</code></li>
          <li>Follow the template to add your questions</li>
          <li>Each question needs: text, type, options, and isCorrect</li>
          <li>Save the file and refresh the page</li>
        </ol>
      </div>
    </div>
  );
};

export default EmptyState;
