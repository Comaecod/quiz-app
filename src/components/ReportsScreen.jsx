import { useState, useMemo, useCallback } from 'react';
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

  const fetchReportData = useCallback(async () => {
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
  }, []);

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

  const getSortLabel = (key, label) => {
    if (sortConfig.key !== key) return `${label}, sortable`;
    return `${label}, sorted ${sortConfig.direction === 'asc' ? 'ascending' : 'descending'}`;
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <span className="opacity-30" aria-hidden="true">↕</span>;
    return <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  if (!hasSecretKey) {
    return (
      <div className="glass-card w-full max-w-md animate-slideUp" role="region" aria-labelledby="no-key-heading">
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-4xl sm:text-5xl mb-4" aria-hidden="true">📊</div>
          <h2 id="no-key-heading" className="text-2xl font-bold mb-2">Reports</h2>
          <p className="text-gray-400">Teacher secret key not configured</p>
        </div>
        <div className="text-center">
          <button className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90" onClick={onBack} aria-label="Go back">
            ← Back
          </button>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="glass-card w-full max-w-md animate-slideUp" role="region" aria-labelledby="unlock-heading">
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-4xl sm:text-5xl mb-4" aria-hidden="true">📊</div>
          <h2 id="unlock-heading" className="text-2xl font-bold mb-2">Teacher Reports</h2>
          <p className="text-gray-400">Enter teacher secret key to view reports</p>
        </div>

        <form onSubmit={handleKeySubmit} className="space-y-4">
          <div>
            <label htmlFor="teacher-key" className="sr-only">Teacher Secret Key</label>
            <input
              id="teacher-key"
              type="password"
              className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 outline-none ${keyError ? 'border-red-500' : 'border-white/10 focus:border-primary/50'}`}
              placeholder="Enter teacher secret key"
              value={secretKey}
              onChange={handleKeyChange}
              autoFocus
              aria-required="true"
              aria-invalid={keyError ? 'true' : 'false'}
              aria-describedby={keyError ? 'teacher-key-error' : undefined}
            />
          </div>
          {keyError && (
            <p id="teacher-key-error" className="text-red-400 text-sm" role="alert"><span aria-hidden="true">⚠️</span> Incorrect secret key</p>
          )}
          <button type="submit" className="w-full px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90">
            View Reports <span aria-hidden="true">🔓</span>
          </button>
          <button type="button" className="w-full px-6 py-3 rounded-xl font-medium bg-white/10 border border-white/20 text-white hover:bg-white/20" onClick={onBack} aria-label="Go back">
            ← Back
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <article className="glass-card animate-slideUp" role="region" aria-labelledby="reports-heading">
        <header className="text-center mb-6 sm:mb-8">
          <div className="text-4xl sm:text-5xl mb-4" aria-hidden="true">📊</div>
          <h2 id="reports-heading" className="text-xl sm:text-2xl font-bold mb-2">Class {QUIZ_CONFIG.className} - {QUIZ_CONFIG.examTitle}</h2>
          <p className="text-gray-400">{QUIZ_CONFIG.subject} | {QUIZ_CONFIG.teacher}</p>
        </header>

        {loading ? (
          <div className="text-center py-12" role="status" aria-live="polite">
            <p className="text-gray-400">Loading reports...</p>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No reports found for this assessment.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium" style={{ 
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.2))',
                border: '1px solid rgba(16, 185, 129, 0.4)'
              }} role="status" aria-live="polite">
                <span aria-hidden="true">👥</span>
                <span>Total Students Submitted: {sortedData.length}</span>
              </div>
              <button 
                className="px-4 py-2 rounded-xl font-medium bg-white/10 border border-white/20 text-white hover:bg-white/20 flex items-center gap-2" 
                onClick={fetchReportData}
                aria-label="Refresh reports"
              >
                <span aria-hidden="true">🔄</span> Refresh
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl bg-black/20">
              <table className="w-full min-w-[600px]">
                <caption className="sr-only">Student quiz results</caption>
                <thead>
                  <tr className="border-b border-white/10">
                    <th 
                      className="px-3 sm:px-4 py-3 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:text-white" 
                      onClick={() => handleSort('name')}
                      aria-sort={sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      Name <SortIcon columnKey="name" />
                      <span className="sr-only">{getSortLabel('name', '')}</span>
                    </th>
                    <th 
                      className="px-3 sm:px-4 py-3 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:text-white w-20 sm:w-24" 
                      onClick={() => handleSort('rollNumber')}
                      aria-sort={sortConfig.key === 'rollNumber' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      Roll No <SortIcon columnKey="rollNumber" />
                      <span className="sr-only">{getSortLabel('rollNumber', '')}</span>
                    </th>
                    <th 
                      className="px-3 sm:px-4 py-3 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:text-white w-16 sm:w-20" 
                      onClick={() => handleSort('correct')}
                      aria-sort={sortConfig.key === 'correct' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      Correct <SortIcon columnKey="correct" />
                      <span className="sr-only">{getSortLabel('correct', '')}</span>
                    </th>
                    <th 
                      className="px-3 sm:px-4 py-3 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:text-white w-16 sm:w-20" 
                      onClick={() => handleSort('wrong')}
                      aria-sort={sortConfig.key === 'wrong' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      Wrong <SortIcon columnKey="wrong" />
                      <span className="sr-only">{getSortLabel('wrong', '')}</span>
                    </th>
                    <th 
                      className="px-3 sm:px-4 py-3 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:text-white w-16 sm:w-20" 
                      onClick={() => handleSort('skipped')}
                      aria-sort={sortConfig.key === 'skipped' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      Skipped <SortIcon columnKey="skipped" />
                      <span className="sr-only">{getSortLabel('skipped', '')}</span>
                    </th>
                    <th 
                      className="px-3 sm:px-4 py-3 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:text-white w-16 sm:w-20" 
                      onClick={() => handleSort('marks')}
                      aria-sort={sortConfig.key === 'marks' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      Marks <SortIcon columnKey="marks" />
                      <span className="sr-only">{getSortLabel('marks', '')}</span>
                    </th>
                    <th 
                      className="px-3 sm:px-4 py-3 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:text-white w-16 sm:w-20" 
                      onClick={() => handleSort('percentage')}
                      aria-sort={sortConfig.key === 'percentage' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      % <SortIcon columnKey="percentage" />
                      <span className="sr-only">{getSortLabel('percentage', '')}</span>
                    </th>
                    <th 
                      className="px-3 sm:px-4 py-3 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:text-white w-16 sm:w-20" 
                      onClick={() => handleSort('grade')}
                      aria-sort={sortConfig.key === 'grade' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      Grade <SortIcon columnKey="grade" />
                      <span className="sr-only">{getSortLabel('grade', '')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((row) => (
                    <tr key={row.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-3 sm:px-4 py-3 text-sm">{row.name}</td>
                      <td className="px-3 sm:px-4 py-3 text-sm">{row.rollNumber}</td>
                      <td className="px-3 sm:px-4 py-3 text-sm text-green-400">{row.correct}</td>
                      <td className="px-3 sm:px-4 py-3 text-sm text-red-400">{row.wrong}</td>
                      <td className="px-3 sm:px-4 py-3 text-sm text-yellow-400">{row.skipped}</td>
                      <td className="px-3 sm:px-4 py-3 text-sm">{row.marks}</td>
                      <td className="px-3 sm:px-4 py-3 text-sm">{row.percentage}%</td>
                      <td className="px-3 sm:px-4 py-3 text-sm font-medium">{row.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="text-center mt-6 sm:mt-8">
          <button className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90" onClick={onBack} aria-label="Go back">
            ← Back
          </button>
        </div>
      </article>
    </div>
  );
};

export default ReportsScreen;
