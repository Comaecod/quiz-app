import React, { useState, useCallback, useMemo } from 'react';
import { QUIZ_CONFIG, questions } from './data/constants';
import { getQuizQuestions } from './utils/shuffle';
import IntroScreen from './components/IntroScreen';
import RollNumberScreen from './components/RollNumberScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import EmptyState from './components/EmptyState';
import './styles/global.css';

/**
 * SCREENS ENUM
 * Defines all possible screens in the application
 */
const SCREENS = {
  INTRO: 'intro',
  ROLL_NUMBER: 'rollNumber',
  QUIZ: 'quiz',
  RESULT: 'result'
};

/**
 * App Component
 * Main application component that manages screen navigation and quiz state
 */
function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.INTRO);
  const [studentInfo, setStudentInfo] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  // Check if question bank has questions
  const hasQuestions = useMemo(() => {
    return questions && questions.length > 0;
  }, []);

  // Number of questions to display
  const questionsCount = useMemo(() => {
    if (!hasQuestions) return 0;
    return Math.min(QUIZ_CONFIG.questionsPerPaper, questions.length);
  }, [hasQuestions]);

  // Handle starting the quiz from intro screen
  const handleStartQuiz = useCallback(() => {
    setCurrentScreen(SCREENS.ROLL_NUMBER);
  }, []);

  // Handle student info submission
  const handleStartWithStudentInfo = useCallback((info) => {
    // Prepare quiz questions
    const preparedQuestions = getQuizQuestions(
      questions,
      QUIZ_CONFIG.questionsPerPaper
    );
    
    setStudentInfo(info);
    setQuizQuestions(preparedQuestions);
    setAnswers({});
    setCurrentScreen(SCREENS.QUIZ);
  }, []);

  // Handle quiz completion
  const handleQuizComplete = useCallback((finalAnswers) => {
    setAnswers(finalAnswers);
    setCurrentScreen(SCREENS.RESULT);
  }, []);

  // Handle quiz restart
  const handleRestart = useCallback(() => {
    setStudentInfo(null);
    setQuizQuestions([]);
    setAnswers({});
    setCurrentScreen(SCREENS.INTRO);
  }, []);

  // Render current screen
  const renderScreen = () => {
    // Handle empty question bank
    if (!hasQuestions && currentScreen !== SCREENS.RESULT) {
      return (
        <EmptyState 
          message="Question bank is empty. Please add questions."
          icon="📭"
        />
      );
    }

    switch (currentScreen) {
      case SCREENS.INTRO:
        return (
          <IntroScreen 
            config={QUIZ_CONFIG}
            onStart={handleStartQuiz}
          />
        );

      case SCREENS.ROLL_NUMBER:
        return (
          <RollNumberScreen 
            onStartQuiz={handleStartWithStudentInfo}
            questionsCount={questionsCount}
          />
        );

      case SCREENS.QUIZ:
        return (
          <QuizScreen 
            questions={quizQuestions}
            studentInfo={studentInfo}
            timeLimitMinutes={QUIZ_CONFIG.timeLimitMinutes}
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
      {/* Animated Background */}
      <div className="background-animation">
        <div className="bg-shape" />
        <div className="bg-shape" />
        <div className="bg-shape" />
      </div>

      {/* Main App Container */}
      <div className="app-container">
        {renderScreen()}
      </div>
    </>
  );
}

export default App;
