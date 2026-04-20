import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { getExamTypes, getClassesForType, getSubjectsForClass, getExamConfig, getLearningTopics } from './utils/examLoader';
import { getQuizQuestions } from './utils/shuffle';
import migrateExams from './utils/migrateExams';
import migrateToLazyStructure from './utils/migrateLazy';
import ExamTypeScreen from './components/ExamTypeScreen';
import ClassSelectionScreen from './components/ClassSelectionScreen';
import SubjectSelectionScreen from './components/SubjectSelectionScreen';
import IntroScreen from './components/IntroScreen';
import PreAssessmentScreen from './components/PreAssessmentScreen';
import RollNumberScreen from './components/RollNumberScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import ReportsScreen from './components/ReportsScreen';
import EmptyState from './components/EmptyState';
import Footer from './components/Footer';
import './index.css';

function AppContent() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [examConfig, setExamConfig] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  
  const [loading, setLoading] = useState(true);
  const [examTypes, setExamTypes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState(null);

  const showMigration = searchParams.get('migrate') === 'true';

  const handleMigration = async () => {
    setMigrating(true);
    try {
      const result = await migrateExams();
      setMigrationResult(result);
    } catch (err) {
      setMigrationResult({ error: err.message });
    }
    setMigrating(false);
  };

  const handleLazyMigration = async () => {
    setMigrating(true);
    try {
      const result = await migrateToLazyStructure();
      setMigrationResult(result);
    } catch (err) {
      setMigrationResult({ error: err.message });
    }
    setMigrating(false);
  };

  const examType = searchParams.get('exam') || null;
  const classNum = searchParams.get('class') || null;
  const subject = searchParams.get('subject') || null;
  const screen = searchParams.get('screen') || 'home';

  // Fetch exam types on mount
  useEffect(() => {
    const loadExamTypes = async () => {
      try {
        const types = await getExamTypes();
        setExamTypes(types);
      } catch (err) {
        console.error('Error loading exam types:', err);
      } finally {
        setLoading(false);
      }
    };
    loadExamTypes();
  }, []);

  // Fetch classes when exam type changes
  useEffect(() => {
    const loadClasses = async () => {
      if (!examType) {
        setClasses([]);
        return;
      }
      try {
        const cls = await getClassesForType(examType);
        setClasses(cls);
      } catch (err) {
        console.error('Error loading classes:', err);
      }
    };
    loadClasses();
  }, [examType]);

  // Fetch subjects when examType and classNum change
  useEffect(() => {
    const loadSubjects = async () => {
      if (!examType || !classNum) {
        setSubjects([]);
        return;
      }
      try {
        const subs = await getSubjectsForClass(examType, classNum);
        setSubjects(subs);
      } catch (err) {
        console.error('Error loading subjects:', err);
      }
    };
    loadSubjects();
  }, [examType, classNum]);

  // Load exam config when any of these change
  useEffect(() => {
    const loadConfig = async () => {
      if (!examType || !subject) {
        setExamConfig(null);
        return;
      }
      try {
        // For Learning, classNum is null
        const config = await getExamConfig(examType, examType === 'Learning' ? null : classNum, subject);
        setExamConfig(config);
      } catch (err) {
        console.error('Error loading config:', err);
      }
    };
    loadConfig();
  }, [examType, classNum, subject]);

  const hasExams = examTypes.length > 0;

  const updateParams = useCallback((updates) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });
      return newParams;
    });
  }, [setSearchParams]);

  const clearExamParams = useCallback(() => {
    setSearchParams({});
    setExamConfig(null);
    setStudentInfo(null);
    setQuizQuestions([]);
    setAnswers({});
  }, [setSearchParams]);

  const handleSelectExamType = useCallback((type) => {
    if (type === 'Learning') {
      const topics = getLearningTopics();
      if (topics.length > 0) {
        updateParams({ exam: type, subject: topics[0], screen: 'intro' });
      }
    } else {
      updateParams({ exam: type, screen: 'class' });
    }
  }, [updateParams]);

  const handleSelectClass = useCallback((num) => {
    updateParams({ class: num, screen: 'subject' });
  }, [updateParams]);

  const handleSelectSubject = useCallback((subj) => {
    updateParams({ subject: subj, screen: 'intro' });
  }, [updateParams]);

  const handleIntroStart = useCallback(() => {
    updateParams({ screen: 'preassessment' });
  }, [updateParams]);

  const handlePreAssessmentSuccess = useCallback(() => {
    updateParams({ screen: 'student' });
  }, [updateParams]);

  const handleOpenReports = useCallback(() => {
    updateParams({ screen: 'reports' });
  }, [updateParams]);

  const handleStartWithStudentInfo = useCallback((info) => {
    if (!examConfig?.questions) return;
    const preparedQuestions = getQuizQuestions(examConfig.questions, examConfig.sections);
    setStudentInfo(info);
    setQuizQuestions(preparedQuestions);
    setAnswers({});
    updateParams({ screen: 'quiz' });
  }, [examConfig, updateParams]);

  const handleQuizComplete = useCallback((finalAnswers) => {
    setAnswers(finalAnswers);
    updateParams({ screen: 'result' });
  }, [updateParams]);

  const goToHome = useCallback(() => {
    clearExamParams();
    navigate('/');
  }, [clearExamParams, navigate]);

  const goBack = useCallback(() => {
    if (screen === 'reports') {
      updateParams({ screen: 'intro' });
      return;
    }
    if (screen === 'result') {
      updateParams({ screen: 'quiz' });
      return;
    }
    if (screen === 'quiz') {
      updateParams({ screen: 'student' });
      return;
    }
    if (screen === 'student') {
      updateParams({ screen: 'preassessment' });
      return;
    }
    if (screen === 'preassessment') {
      updateParams({ screen: 'intro' });
      return;
    }
    if (screen === 'intro') {
      updateParams({ screen: 'subject' });
      return;
    }
    if (screen === 'subject') {
      updateParams({ class: null, subject: null, screen: 'class' });
      return;
    }
    if (screen === 'class') {
      goToHome();
      return;
    }
    goToHome();
  }, [screen, updateParams, goToHome]);

  const renderScreen = () => {
    if (loading) {
      return (
        <div className="glass-card p-8 text-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      );
    }

    if (!hasExams && screen !== 'result') {
      return <EmptyState />;
    }

    switch (screen) {
      case 'home':
        return <ExamTypeScreen examTypes={examTypes} onSelect={handleSelectExamType} />;

      case 'class':
        return (
          <ClassSelectionScreen
            examType={examType}
            classes={classes}
            onSelect={handleSelectClass}
            onBack={goToHome}
          />
        );

      case 'subject':
        return (
          <SubjectSelectionScreen
            examType={examType}
            classNum={classNum}
            subjects={subjects}
            onSelect={handleSelectSubject}
            onBack={goBack}
          />
        );

      case 'intro':
        return examConfig ? (
          <IntroScreen
            config={examConfig}
            onStart={handleIntroStart}
            onReports={handleOpenReports}
            onBack={goBack}
          />
        ) : <EmptyState />;

      case 'preassessment':
        return examConfig ? (
          <PreAssessmentScreen
            config={examConfig}
            onSuccess={handlePreAssessmentSuccess}
            onBack={goBack}
          />
        ) : <EmptyState />;

      case 'student':
        return examConfig ? (
          <RollNumberScreen
            onStartQuiz={handleStartWithStudentInfo}
            questionsCount={examConfig.totalQuestions || 0}
            onBack={goBack}
          />
        ) : <EmptyState />;

      case 'quiz':
        return (
          <QuizScreen
            questions={quizQuestions}
            studentInfo={studentInfo}
            timeLimitMinutes={examConfig?.timeLimitMinutes || 0}
            wrongAnswerPenaltyFraction={examConfig?.wrongAnswerPenaltyFraction || 0}
            onQuizComplete={handleQuizComplete}
          />
        );

      case 'result':
        return (
          <ResultScreen
            questions={quizQuestions}
            answers={answers}
            studentInfo={studentInfo}
            config={examConfig}
            onRestart={goToHome}
          />
        );

      case 'reports':
        return <ReportsScreen config={examConfig} onBack={goBack} />;

      default:
        return <ExamTypeScreen examTypes={examTypes} onSelect={handleSelectExamType} />;
    }
  };

  return (
    <>
      {showMigration && (
        <div className="fixed bottom-4 right-4 z-50 glass-card p-4 rounded-xl max-w-sm">
          <h3 className="font-bold text-yellow-400 mb-2">Migration Tool</h3>
          {!migrationResult ? (
            <div className="space-y-2">
              <button
                onClick={handleMigration}
                disabled={migrating}
                className="block w-full px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium disabled:opacity-50 text-left"
              >
                {migrating ? 'Migrating...' : 'Old Migration (all in one)'}
              </button>
              <button
                onClick={handleLazyMigration}
                disabled={migrating}
                className="block w-full px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium disabled:opacity-50 text-left"
              >
                {migrating ? 'Migrating...' : 'NEW: Lazy Migration (recommended)'}
              </button>
            </div>
          ) : (
            <div className="text-sm">
              <p className="text-green-400">examTypes: {migrationResult.examTypesCreated}</p>
              <p className="text-green-400">examIndex: {migrationResult.examIndexCreated}</p>
              <p className="text-green-400">examConfigs: {migrationResult.examConfigsCreated}</p>
              {migrationResult.error && (
                <p className="text-red-400">Error: {migrationResult.error}</p>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-96 h-96 rounded-full bg-purple-500 opacity-20 -top-48 -left-48 animate-float" />
        <div className="absolute w-80 h-80 rounded-full bg-blue-500 opacity-20 top-1/2 -right-40 animate-float" style={{ animationDelay: '-5s' }} />
        <div className="absolute w-64 h-64 rounded-full bg-pink-500 opacity-20 bottom-0 left-1/3 animate-float" style={{ animationDelay: '-10s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pb-12">
        {renderScreen()}
      </div>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;