import React, { useState, useCallback, useMemo } from 'react';
import { QUIZ_CONFIG, questions, isExamAvailable, getTotalQuestions, getTotalMarks } from './data/constants';
import { getQuizQuestions } from './utils/shuffle';
import IntroScreen from './components/IntroScreen';
import RollNumberScreen from './components/RollNumberScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import EmptyState from './components/EmptyState';
import './styles/global.css';

/**
 * Screen navigation constants
 */
const SCREENS = {
  INTRO: 'intro',
  ROLL_NUMBER: 'rollNumber',
  QUIZ: 'quiz',
  RESULT: 'result'
};

/**
 * Main App Component
 * Manages quiz flow: Intro -> Student Details -> Quiz -> Results
 */
function App() {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState(SCREENS.INTRO);
  
  // Quiz state
  const [studentInfo, setStudentInfo] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  // Check if questions are available
  const hasQuestions = useMemo(() => questions?.length > 0, []);

  // Calculate questions to display (from sections)
  const questionsCount = useMemo(() => {
    if (!hasQuestions) return 0;
    return getTotalQuestions();
  }, [hasQuestions]);

  // Navigate to student details form
  const handleStartQuiz = useCallback(() => {
    setCurrentScreen(SCREENS.ROLL_NUMBER);
  }, []);

  // Start quiz with student info - prepare & shuffle questions
  const handleStartWithStudentInfo = useCallback((info) => {
    const preparedQuestions = getQuizQuestions(questions);
    setStudentInfo(info);
    setQuizQuestions(preparedQuestions);
    setAnswers({});
    setCurrentScreen(SCREENS.QUIZ);
  }, []);

  // Complete quiz - save answers & show results
  const handleQuizComplete = useCallback((finalAnswers) => {
    setAnswers(finalAnswers);
    setCurrentScreen(SCREENS.RESULT);
  }, []);

  // Restart quiz - reset all state
  const handleRestart = useCallback(() => {
    setStudentInfo(null);
    setQuizQuestions([]);
    setAnswers({});
    setCurrentScreen(SCREENS.INTRO);
  }, []);

  // Render current screen based on state
  const renderScreen = () => {
    // Show no exam available screen if exam is fallback/disabled
    if (!isExamAvailable && currentScreen !== SCREENS.RESULT) {
      return <EmptyState />;
    }

    // Show empty state if no questions (but exam exists)
    if (!hasQuestions && currentScreen !== SCREENS.RESULT) {
      return <EmptyState />;
    }

    switch (currentScreen) {
      case SCREENS.INTRO:
        return <IntroScreen config={QUIZ_CONFIG} onStart={handleStartQuiz} />;

      case SCREENS.ROLL_NUMBER:
        return <RollNumberScreen onStartQuiz={handleStartWithStudentInfo} questionsCount={questionsCount} />;

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

      default:
        return null;
    }
  };

  return (
    <>
      {/* Animated background shapes */}
      <div className="background-animation">
        <div className="bg-shape" />
        <div className="bg-shape" />
        <div className="bg-shape" />
      </div>

      {/* Main app container */}
      <div className="app-container">
        {renderScreen()}
      </div>
    </>
  );
}

export default App;
