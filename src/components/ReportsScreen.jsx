import { useState, useMemo } from 'react';
import { QUIZ_CONFIG } from '../data/constants';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const ReportsScreen = ({ onBack }) => {
  const [secretKey, setSecretKey] = useState('');
  const [keyError, setKeyError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'percentage', direction: 'desc' });

  const hasSecretKey = QUIZ_CONFIG.teacherSecretKey && QUIZ_CONFIG.teacherSecretKey.length > 0;

  const handleKeySubmit = (e) => {
    e.preventDefault();
    
    if (secretKey.trim() === QUIZ_CONFIG.teacherSecretKey) {
      setIsUnlocked(true);
      setKeyError(false);
      fetchReportData();
    } else {
      setKeyError(true);
    }
  };

  const handleKeyChange = (e) => {
    setSecretKey(e.target.value);
    if (keyError) setKeyError(false);
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'quizResults'),
        where('className', '==', QUIZ_CONFIG.className),
        where('examTitle', '==', QUIZ_CONFIG.examTitle),
        where('teacher', '==', QUIZ_CONFIG.teacher)
      );
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          name: `${d.studentInfo?.firstName || ''} ${d.studentInfo?.lastName || ''}`.trim(),
          rollNumber: Number(d.studentInfo?.rollNumber) || d.studentInfo?.rollNumber,
          correct: d.results?.correctCount || 0,
          wrong: d.results?.wrongCount || 0,
          skipped: d.results?.skippedCount || 0,
          marks: d.results?.totalEarned || 0,
          percentage: parseFloat(d.results?.percentage) || 0,
          grade: d.results?.grade || '-'
        };
      });
      
      setReportData(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReportData([]);
    }
    setLoading(false);
  };

  const sortedData = useMemo(() => {
    if (!reportData.length) return [];
    
    return [...reportData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (typeof aVal === 'string') {
        return sortConfig.direction === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
      
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [reportData, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <span style={{ opacity: 0.3 }}>↕</span>;
    return <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  if (!hasSecretKey) {
    return (
      <div className='glass-card' style={{ animation: 'slideUp 0.6s ease-out' }}>
        <div className="text-center mb-xl">
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📊</div>
          <h2 className="heading">Reports</h2>
          <p className="subheading" style={{ fontSize: '1rem', opacity: 0.8 }}>
            Teacher secret key not configured
          </p>
        </div>
        <div className="text-center mt-xl">
          <button className='btn btn-primary' onClick={onBack}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className='glass-card' style={{ animation: 'slideUp 0.6s ease-out' }}>
        <div className="text-center mb-xl">
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📊</div>
          <h2 className="heading">Teacher Reports</h2>
          <p className="subheading" style={{ fontSize: '1rem', opacity: 0.8 }}>
            Enter teacher secret key to view reports
          </p>
        </div>

        <form onSubmit={handleKeySubmit} className="unlock-form">
          <input
            type="password"
            className={`form-input unlock-input ${keyError ? 'error' : ''}`}
            placeholder="Enter teacher secret key"
            value={secretKey}
            onChange={handleKeyChange}
            autoFocus
          />
          {keyError && (
            <p className="error-message unlock-error">
              ⚠️ Incorrect secret key
            </p>
          )}
          <button type="submit" className="btn btn-primary btn-block">
            View Reports 🔓
          </button>
          <button type="button" className="btn btn-secondary btn-block mt-md" onClick={onBack}>
            ← Back
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '1000px' }}>
      <div className='glass-card' style={{ animation: 'slideUp 0.6s ease-out' }}>
        <div className="text-center mb-xl">
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📊</div>
          <h2 className="heading">Class {QUIZ_CONFIG.className} - {QUIZ_CONFIG.examTitle}</h2>
          <p className="subheading" style={{ fontSize: '1rem', opacity: 0.8 }}>
            {QUIZ_CONFIG.subject} | {QUIZ_CONFIG.teacher}
          </p>
        </div>

        {loading ? (
          <div className="text-center" style={{ padding: 'var(--space-xl)' }}>
            <p>Loading reports...</p>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="text-center" style={{ padding: 'var(--space-xl)' }}>
            <p>No reports found for this assessment.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-lg" style={{ flexWrap: 'wrap', gap: 'var(--space-md)' }}>
              <div className='info-badge' style={{ 
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.2))',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                padding: 'var(--space-md) var(--space-lg)',
                fontSize: '1rem'
              }}>
                <span>👥</span>
                <span style={{ fontWeight: 600 }}>Total Students Submitted: {sortedData.length}</span>
              </div>
              <button 
                className='btn btn-secondary' 
                onClick={fetchReportData}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}
              >
                <span>🔄</span> Refresh
              </button>
            </div>

            <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.1)' }}>
              <table className="result-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                      Name <SortIcon columnKey="name" />
                    </th>
                    <th onClick={() => handleSort('rollNumber')} style={{ cursor: 'pointer', width: '100px' }}>
                      Roll No <SortIcon columnKey="rollNumber" />
                    </th>
                    <th onClick={() => handleSort('correct')} style={{ cursor: 'pointer', width: '80px' }}>
                      Correct <SortIcon columnKey="correct" />
                    </th>
                    <th onClick={() => handleSort('wrong')} style={{ cursor: 'pointer', width: '80px' }}>
                      Wrong <SortIcon columnKey="wrong" />
                    </th>
                    <th onClick={() => handleSort('skipped')} style={{ cursor: 'pointer', width: '80px' }}>
                      Skipped <SortIcon columnKey="skipped" />
                    </th>
                    <th onClick={() => handleSort('marks')} style={{ cursor: 'pointer', width: '80px' }}>
                      Marks <SortIcon columnKey="marks" />
                    </th>
                    <th onClick={() => handleSort('percentage')} style={{ cursor: 'pointer', width: '100px' }}>
                      % <SortIcon columnKey="percentage" />
                    </th>
                    <th onClick={() => handleSort('grade')} style={{ cursor: 'pointer', width: '80px' }}>
                      Grade <SortIcon columnKey="grade" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((row) => (
                    <tr key={row.id}>
                      <td>{row.name}</td>
                      <td>{row.rollNumber}</td>
                      <td>{row.correct}</td>
                      <td>{row.wrong}</td>
                      <td>{row.skipped}</td>
                      <td>{row.marks}</td>
                      <td>{row.percentage}%</td>
                      <td>{row.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="text-center mt-xl">
          <button className='btn btn-primary' onClick={onBack}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsScreen;
