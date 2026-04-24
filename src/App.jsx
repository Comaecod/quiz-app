import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { getExamTypes, getClassesForType, getSubjectsForClass, getExamConfig, getHolidayTypes, getHolidayClassesForType } from './utils/examLoader';
import { getQuizQuestions } from './utils/shuffle';
import { trackPageView, getPageViewCount } from './services/firebaseService';
import migrateToLazyStructure from './utils/migrateLazy';
import ExamTypeScreen from './components/ExamTypeScreen';
import HolidayTypeScreen from './components/HolidayTypeScreen';
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
import HolidayHomeworkScreen from './components/HolidayHomeworkScreen';
import StaffDirectoryScreen from './components/StaffDirectoryScreen';
import Header from './components/Header';
import BetaBanner from './components/BetaBanner';
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
  const [showMainCategory, setShowMainCategory] = useState(true);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [holidayTypes, setHolidayTypes] = useState([]);
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState(null);
  const [pageViewCount, setPageViewCount] = useState(null);
  const [previousPath, setPreviousPath] = useState('/');
  
  const showMigration = searchParams.get('migrate') === 'true';
  const hasExams = examTypes.length > 0;

  useEffect(() => {
    const initAnalytics = async () => {
      await trackPageView();
      const count = await getPageViewCount();
      setPageViewCount(count);
    };
    initAnalytics();
  }, []);

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

  useEffect(() => {
    const loadClasses = async () => {
      if (!examType) {
        setClasses([]);
        return;
      }
      try {
        let cls;
        if (examType === 'Holiday Homework') {
          const holidayType = searchParams.get('holidayType');
          if (holidayType) {
            cls = await getHolidayClassesForType(holidayType);
          } else {
            cls = [];
          }
        } else {
          cls = await getClassesForType(examType);
        }
        setClasses(cls);
      } catch (err) {
        console.error('Error loading classes:', err);
      }
    };
    loadClasses();
  }, [examType, searchParams]);

  useEffect(() => {
    const loadHolidayTypes = async () => {
      if (examType === 'Holiday Homework') {
        try {
          const types = await getHolidayTypes();
          setHolidayTypes(types);
        } catch (err) {
          console.error('Error loading holiday types:', err);
        }
      } else {
        setHolidayTypes([]);
      }
    };
    loadHolidayTypes();
  }, [examType]);

  useEffect(() => {
    const loadSubjects = async () => {
      if (!examType || !classNum) {
        setSubjects([]);
        return;
      }
      setSubjectsLoading(true);
      try {
        const subs = await getSubjectsForClass(examType, classNum);
        setSubjects(subs);
      } catch (err) {
        console.error('Error loading subjects:', err);
        setSubjects([]);
      } finally {
        setSubjectsLoading(false);
      }
    };
    loadSubjects();
  }, [examType, classNum]);

  useEffect(() => {
    const loadConfig = async () => {
      if (!examType || !subject) {
        setExamConfig(null);
        return;
      }
      setConfigLoading(true);
      try {
        const holidayType = examType === 'Holiday Homework' ? searchParams.get('holidayType') : null;
        const config = await getExamConfig(examType, classNum, subject, holidayType);
        setExamConfig(config);
      } catch (err) {
        console.error('Error loading config:', err);
      } finally {
        setConfigLoading(false);
      }
    };
    loadConfig();
  }, [examType, classNum, subject, searchParams]);

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
    if (type === 'Holiday Homework') {
      updateParams({ exam: type, screen: 'holiday-type' });
    } else {
      setShowMainCategory(false);
      updateParams({ exam: type, screen: 'class' });
    }
  }, [updateParams]);

  const handleSelectHolidayType = useCallback((type) => {
    updateParams({ holidayType: type, screen: 'class' });
  }, [updateParams]);

  const handleSelectClass = useCallback((num) => {
    updateParams({ class: num, screen: 'subject' });
  }, [updateParams]);

  const handleSelectSubject = useCallback((subj) => {
    if (examType === 'Holiday Homework') {
      updateParams({ subject: subj, screen: 'content' });
    } else {
      updateParams({ subject: subj, screen: 'intro' });
    }
  }, [examType, updateParams]);

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
    setShowMainCategory(true);
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
    if (screen === 'content') {
      updateParams({ screen: 'subject' });
      return;
    }
    if (screen === 'subject') {
      if (examType === 'Holiday Homework') {
        updateParams({ class: null, subject: null, screen: 'holiday-type' });
      } else {
        updateParams({ class: null, subject: null, screen: 'class' });
      }
      return;
    }
    if (screen === 'class') {
      if (examType === 'Holiday Homework') {
        updateParams({ screen: 'holiday-type', holidayType: null, class: null });
      } else {
        setShowMainCategory(true);
        goToHome();
      }
      return;
    }
    if (screen === 'holiday-type') {
      setShowMainCategory(true);
      goToHome();
      return;
    }
    goToHome();
  }, [screen, updateParams, goToHome, setShowMainCategory, examType]);

  const renderScreen = () => {
    if (loading) {
      return (
        <div className="glass-card p-8 text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      );
    }

    if (!loading && !hasExams && screen !== 'result') {
      return (
        <div className="glass-card p-8 text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading exam data...</p>
        </div>
      );
    }

    switch (screen) {
      case 'home':
        return <ExamTypeScreen examTypes={examTypes} onSelect={handleSelectExamType} showMainCategory={showMainCategory} setShowMainCategory={setShowMainCategory} />;

      case 'holiday-type':
        return (
          <HolidayTypeScreen
            holidayTypes={holidayTypes}
            onSelect={handleSelectHolidayType}
            onBack={goToHome}
          />
        );

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
            isLoading={subjectsLoading}
            onSelect={handleSelectSubject}
            onBack={goBack}
          />
        );

      case 'intro':
        return configLoading ? (
          <div className="glass-card p-8 text-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading assessment...</p>
          </div>
        ) : examConfig ? (
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
        ) : (
          <div className="glass-card p-8 text-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading assessment...</p>
          </div>
        );

      case 'student':
        return examConfig ? (
          <RollNumberScreen
            onStartQuiz={handleStartWithStudentInfo}
            questionsCount={examConfig.totalQuestions || 0}
            onBack={goBack}
          />
        ) : (
          <div className="glass-card p-8 text-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        );

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

      case 'content':
        return examConfig && examConfig.isHolidayHomework ? (
          <HolidayHomeworkScreen config={examConfig} onBack={goBack} />
        ) : <EmptyState />;

      default:
        return <ExamTypeScreen examTypes={examTypes} onSelect={handleSelectExamType} showMainCategory={showMainCategory} setShowMainCategory={setShowMainCategory} />;
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
                onClick={handleLazyMigration}
                disabled={migrating}
                className="block w-full px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium disabled:opacity-50 text-left"
              >
                {migrating ? 'Migrating...' : 'Migrate Exams (recommended)'}
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
      
      <Header />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-96 h-96 rounded-full bg-purple-500 opacity-20 -top-48 -left-48 animate-float" />
        <div className="absolute w-80 h-80 rounded-full bg-blue-500 opacity-20 top-1/2 -right-40 animate-float" style={{ animationDelay: '-5s' }} />
        <div className="absolute w-64 h-64 rounded-full bg-pink-500 opacity-20 bottom-0 left-1/3 animate-float" style={{ animationDelay: '-10s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pb-12 pt-24">
        {renderScreen()}
      </div>

      <Footer pageViewCount={pageViewCount} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter basename="/quiz-app">
      <BetaBanner />
      <Routes>
        <Route path="/*" element={<AppContent />} />
        <Route path="/people" element={
          <>
            <Header />
            <StaffDirectoryScreen />
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;