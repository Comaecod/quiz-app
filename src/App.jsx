import { useState, useCallback, useMemo } from 'react';
import { QUIZ_CONFIG, questions, isExamAvailable, getTotalQuestions } from './data/constants';
import { getQuizQuestions } from './utils/shuffle';
import IntroScreen from './components/IntroScreen';
import RollNumberScreen from './components/RollNumberScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import ReportsScreen from './components/ReportsScreen';
import EmptyState from './components/EmptyState';
import Footer from './components/Footer';
import './index.css';

const SCREENS = {
  INTRO: 'intro',
  ROLL_NUMBER: 'rollNumber',
  QUIZ: 'quiz',
  RESULT: 'result',
  REPORTS: 'reports'
};

function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.INTRO);
  const [studentInfo, setStudentInfo] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  const hasQuestions = useMemo(() => questions?.length > 0, []);

  const questionsCount = useMemo(() => {
    if (!hasQuestions) return 0;
    return getTotalQuestions();
  }, [hasQuestions]);

  const handleStartQuiz = useCallback(() => {
    setCurrentScreen(SCREENS.ROLL_NUMBER);
  }, []);

  const handleOpenReports = useCallback(() => {
    setCurrentScreen(SCREENS.REPORTS);
  }, []);

  const handleStartWithStudentInfo = useCallback((info) => {
    const preparedQuestions = getQuizQuestions(questions);
    setStudentInfo(info);
    setQuizQuestions(preparedQuestions);
    setAnswers({});
    setCurrentScreen(SCREENS.QUIZ);
  }, []);

  const handleQuizComplete = useCallback((finalAnswers) => {
    setAnswers(finalAnswers);
    setCurrentScreen(SCREENS.RESULT);
  }, []);

  const handleRestart = useCallback(() => {
    setStudentInfo(null);
    setQuizQuestions([]);
    setAnswers({});
    setCurrentScreen(SCREENS.INTRO);
  }, []);

  const handleBackToIntro = useCallback(() => {
    setCurrentScreen(SCREENS.INTRO);
  }, []);

  const renderScreen = () => {
    if (!isExamAvailable && currentScreen !== SCREENS.RESULT) {
      return <EmptyState />;
    }

    if (!hasQuestions && currentScreen !== SCREENS.RESULT) {
      return <EmptyState />;
    }

    switch (currentScreen) {
      case SCREENS.INTRO:
        return <IntroScreen config={QUIZ_CONFIG} onStart={handleStartQuiz} onReports={handleOpenReports} />;

      case SCREENS.ROLL_NUMBER:
        return <RollNumberScreen onStartQuiz={handleStartWithStudentInfo} questionsCount={questionsCount} onBack={handleBackToIntro} />;

      case SCREENS.QUIZ:
        return (
          <QuizScreen
            questions={quizQuestions}
            studentInfo={studentInfo}
            timeLimitMinutes={QUIZ_CONFIG.timeLimitMinutes}
            wrongAnswerPenaltyFraction={QUIZ_CONFIG.wrongAnswerPenaltyFraction}
            onQuizComplete={handleQuizComplete}
          />
        );

      case SCREENS.RESULT:
        return (
          <ResultScreen
            questions={quizQuestions}
            answers={answers}
            studentInfo={studentInfo}
            config={QUIZ_CONFIG}
            onRestart={handleRestart}
          />
        );

      case SCREENS.REPORTS:
        return <ReportsScreen onBack={handleBackToIntro} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div aria-hidden="true" className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-96 h-96 rounded-full bg-purple-500 opacity-20 -top-48 -left-48 animate-float" />
        <div className="absolute w-80 h-80 rounded-full bg-blue-500 opacity-20 top-1/2 -right-40 animate-float" style={{ animationDelay: '-5s' }} />
        <div className="absolute w-64 h-64 rounded-full bg-pink-500 opacity-20 bottom-0 left-1/3 animate-float" style={{ animationDelay: '-10s' }} />
      </div>

      <main id="main-content" className="relative z-10 flex-1 flex items-center justify-center p-4 pb-16 sm:pb-12" role="main">
        {renderScreen()}
      </main>

      <Footer />
    </div>
  );
}

export default App;
