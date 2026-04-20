import { useState, useCallback, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { getExamTypes, getClassesForType, getSubjectsForClass, getExamConfig } from './utils/examLoader';
import { getQuizQuestions } from './utils/shuffle';
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

  const examType = searchParams.get('exam') || null;
  const classNum = searchParams.get('class') || null;
  const subject = searchParams.get('subject') || null;
  const screen = searchParams.get('screen') || 'home';

  const examTypes = useMemo(() => getExamTypes(), []);
  const classes = useMemo(() => examType ? getClassesForType(examType) : [], [examType]);
  const subjects = useMemo(() => examType && classNum ? getSubjectsForClass(examType, classNum) : [], [examType, classNum]);

  const hasExams = examTypes.length > 0;

  useEffect(() => {
    if (examType && classNum && subject && !examConfig) {
      const config = getExamConfig(examType, classNum, subject);
      setExamConfig(config);
    }
  }, [examType, classNum, subject, examConfig]);

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
    updateParams({ exam: type, screen: 'class' });
  }, [updateParams]);

  const handleSelectClass = useCallback((num) => {
    updateParams({ class: num, screen: 'subject' });
  }, [updateParams]);

  const handleSelectSubject = useCallback((subj) => {
    const config = getExamConfig(examType, classNum, subj);
    setExamConfig(config);
    updateParams({ subject: subj, screen: 'intro' });
  }, [examType, classNum, updateParams]);

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
    const steps = ['home', 'class', 'subject', 'intro', 'preassessment', 'student', 'quiz', 'result'];
    const currentIndex = steps.indexOf(screen);
    if (currentIndex > 0) {
      const prevScreen = steps[currentIndex - 1];
      if (prevScreen === 'home') {
        goToHome();
      } else if (prevScreen === 'class') {
        updateParams({ class: null, subject: null, screen: 'class' });
      } else if (prevScreen === 'subject') {
        updateParams({ subject: null, screen: 'subject' });
      } else if (prevScreen === 'intro') {
        updateParams({ screen: 'intro' });
      } else if (prevScreen === 'preassessment') {
        updateParams({ screen: 'preassessment' });
      } else if (prevScreen === 'student') {
        updateParams({ screen: 'student' });
      }
    }
  }, [screen, updateParams, goToHome]);

  const renderScreen = () => {
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
        return (
          <RollNumberScreen
            onStartQuiz={handleStartWithStudentInfo}
            questionsCount={examConfig?.totalQuestions || 0}
            onBack={goBack}
          />
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

      default:
        return <ExamTypeScreen examTypes={examTypes} onSelect={handleSelectExamType} />;
    }
  };

  return (
    <>
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
