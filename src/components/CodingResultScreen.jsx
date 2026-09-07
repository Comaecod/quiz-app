import { useRef, useState } from 'react';
import { subjectLabel } from '../utils/format';
import { getPerformanceMessage } from '../utils/scoring';
import { validateAnswerReveal } from '../utils/auth';
import { CertificateCard } from './TimedAssessmentResultScreen';

const CodeBlock = ({ label, code, highlight }) => (
  <div className="rounded-xl overflow-hidden border border-white/10">
    <div className="flex items-center justify-between px-4 py-2 bg-[#282843] border-b border-white/10">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      {highlight !== undefined && (
        <span className={`text-sm font-semibold ${highlight ? 'text-green-400' : 'text-red-400'}`}>
          {highlight ? 'Correct' : 'Incorrect'}
        </span>
      )}
    </div>
    <pre className="p-4 text-sm leading-6 font-mono text-gray-200 bg-[#1e1e1e] overflow-x-auto whitespace-pre-wrap">{code || '(no code submitted)'}</pre>
  </div>
);

export default function CodingResultScreen({ assessment, studentInfo, results, code, solutionCode, onBack }) {
  const [showCertificate, setShowCertificate] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [keyError, setKeyError] = useState(false);
  const keyInputRef = useRef(null);

  const hasSecretKey = assessment?.secretKey?.length > 0;
  const performance = getPerformanceMessage(results.percentage);
  const subject = subjectLabel(assessment?.subject) || 'General';
  const testCaseResults = results.testCaseResults || [];

  const handleKeySubmit = (e) => {
    e.preventDefault();
    if (validateAnswerReveal(secretKey, assessment)) {
      setIsUnlocked(true);
      setKeyError(false);
    } else {
      setKeyError(true);
      if (keyInputRef.current) keyInputRef.current.focus();
    }
  };

  const revealAllowed = !hasSecretKey || isUnlocked;

  return (
    <div className="fixed inset-0 z-50 bg-[#1a1a2e] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-[#282843] border-b border-white/10 shrink-0">
        <div className="min-w-0">
          <h2 className="text-white font-semibold truncate">{assessment?.title || 'Coding Assessment'}</h2>
          <p className="text-xs text-gray-400">Subject: {subject}</p>
        </div>
        <button onClick={onBack} className="ml-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors shrink-0">
          Back to Assessments
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-5 space-y-5">
          <div className="text-center">
            <div className="text-5xl mb-2">{performance.emoji}</div>
            <h2 className="text-2xl font-bold text-white">{performance.message}</h2>
            {studentInfo && (
              <p className="text-gray-400 mt-1">
                {studentInfo.firstName} {studentInfo.lastName}
              </p>
            )}
          </div>

          <div className="glass-card !bg-[#282843] !border-white/10 p-5 sm:p-6 text-center">
            <div className="text-5xl font-bold text-white">
              {results.totalEarned.toFixed(1)}
              <span className="text-2xl text-gray-400">/{results.totalMarks}</span>
            </div>
            <p className="text-gray-400 text-sm mt-1">{results.percentage}%</p>
            <div className="inline-block mt-3 px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-lg font-bold text-white">
              {results.grade}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              {results.correctCount} of {testCaseResults.length || results.correctCount + results.wrongCount} test cases passed
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
              <div className="text-2xl font-bold text-green-400">{results.correctCount}</div>
              <div className="text-xs text-gray-400">✅ Passed</div>
            </div>
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
              <div className="text-2xl font-bold text-red-400">{results.wrongCount}</div>
              <div className="text-xs text-gray-400">❌ Failed</div>
            </div>
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center">
              <div className="text-2xl font-bold text-yellow-400">{results.skippedCount}</div>
              <div className="text-xs text-gray-400">⏭️ Skipped</div>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
              <div className="text-2xl font-bold text-blue-400">{testCaseResults.length || results.correctCount + results.wrongCount}</div>
              <div className="text-xs text-gray-400">🧪 Test Cases</div>
            </div>
          </div>

          {revealAllowed ? (
            <>
              <div>
                <h3 className="text-base font-semibold text-white mb-3">🧪 Test Case Results</h3>
                <div className="overflow-x-auto rounded-xl bg-[#282843] border border-white/10">
                  <table className="w-full min-w-[480px] text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-left text-gray-300 w-12">#</th>
                        <th className="px-4 py-3 text-left text-gray-300">Input</th>
                        <th className="px-4 py-3 text-left text-gray-300">Expected</th>
                        <th className="px-4 py-3 text-left text-gray-300">Got</th>
                        <th className="px-4 py-3 text-center text-gray-300 w-16">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testCaseResults.map((r, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td className="px-4 py-3 text-gray-400">T{i + 1}</td>
                          <td className="px-4 py-3 font-mono text-gray-300">{r.testCase?.input ?? '-'}</td>
                          <td className="px-4 py-3 font-mono text-gray-300">{r.testCase?.expected ?? '-'}</td>
                          <td className="px-4 py-3 font-mono text-gray-300">{r.output ?? '-'}</td>
                          <td className="px-4 py-3 text-center">{r.passed ? '✅' : '❌'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-white mb-3">💻 Code Comparison</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <CodeBlock label="Your Code" code={code} />
                  <CodeBlock label="Expected Solution" code={solutionCode} />
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 bg-[#282843] border border-white/10 rounded-2xl">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="text-lg font-semibold text-white mb-2">Solutions Hidden</h3>
              <p className="text-gray-400 mb-6">Enter the answer reveal key to view test case results and the expected solution</p>
              <form onSubmit={handleKeySubmit} className="max-w-sm mx-auto space-y-4">
                <input
                  ref={keyInputRef}
                  type="password"
                  className={`w-full px-4 py-3 rounded-xl bg-black/5 border text-white placeholder-gray-500 outline-none ${keyError ? 'border-red-500' : 'border-white/10 focus:border-primary/50'}`}
                  placeholder="Enter answer reveal key"
                  value={secretKey}
                  onChange={(e) => { setSecretKey(e.target.value); if (keyError) setKeyError(false); }}
                />
                {keyError && <p className="text-red-400 text-sm">⚠️ Incorrect key</p>}
                <button type="submit" className="w-full px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90">
                  Unlock Solutions 🔓
                </button>
              </form>
            </div>
          )}

          <div>
            <button
              onClick={() => setShowCertificate(!showCertificate)}
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium hover:opacity-90 flex items-center justify-center gap-2"
            >
              <span>🎓</span>
              <span>{showCertificate ? 'Hide Certificate' : 'Show Certificate'}</span>
              <span className={`transition-transform ${showCertificate ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {showCertificate && (
              <div className="mt-4 animate-fadeIn">
                <CertificateCard studentInfo={studentInfo} assessment={assessment} results={results} />
              </div>
            )}
          </div>

          <div className="text-center pb-6">
            <button onClick={onBack} className="px-6 py-3 rounded-xl font-medium bg-white/10 hover:bg-white/20 text-white">
              Back to Assessments 🏠
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
