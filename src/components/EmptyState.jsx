/**
 * EmptyState Component
 * Displayed when no exam is available
 */
const EmptyState = () => {
  return (
    <div className="glass-card empty-state" style={{ 
      animation: 'slideUp 0.6s ease-out',
      maxWidth: '500px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>📋</div>
      <h2 className="empty-title">No Exam Available</h2>
      <p className="empty-description">
        There is no exam scheduled at the moment.
      </p>
      <p className="empty-description" style={{ marginTop: 'var(--space-md)' }}>
        Please check back later or contact your teacher for more information.
      </p>
    </div>
  );
};

export default EmptyState;
