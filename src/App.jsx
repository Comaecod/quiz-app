import { useState, useCallback, useMemo } from 'react';
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

const SCREENS = {
  EXAM_TYPE: 'examType',
  CLASS_SELECTION: 'classSelection',
  SUBJECT_SELECTION: 'subjectSelection',
  INTRO: 'intro',
  PRE_ASSESSMENT: 'preAssessment',
  ROLL_NUMBER: 'rollNumber',
  QUIZ: 'quiz',
  RESULT: 'result',
  REPORTS: 'reports'
};

function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.EXAM_TYPE);
  const [examType, setExamType] = useState(null);
  const [classNum, setClassNum] = useState(null);
  const [subject, setSubject] = useState(null);
  const [examConfig, setExamConfig] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  const examTypes = useMemo(() => getExamTypes(), []);
  const classes = useMemo(() => examType ? getClassesForType(examType) : [], [examType]);
  const subjects = useMemo(() => examType && classNum ? getSubjectsForClass(examType, classNum) : [], [examType, classNum]);

  const hasExams = examTypes.length > 0;

  const handleSelectExamType = useCallback((type) => {
    setExamType(type);
    setCurrentScreen(SCREENS.CLASS_SELECTION);
  }, []);

  const handleSelectClass = useCallback((num) => {
    setClassNum(num);
    setCurrentScreen(SCREENS.SUBJECT_SELECTION);
  }, []);

  const handleSelectSubject = useCallback((subj) => {
    setSubject(subj);
    const config = getExamConfig(examType, classNum, subj);
    setExamConfig(config);
    setCurrentScreen(SCREENS.INTRO);
  }, [examType, classNum]);

  const handleIntroStart = useCallback(() => {
    setCurrentScreen(SCREENS.PRE_ASSESSMENT);
  }, []);

  const handlePreAssessmentSuccess = useCallback(() => {
    setCurrentScreen(SCREENS.ROLL_NUMBER);
  }, []);

  const handleOpenReports = useCallback(() => {
    setCurrentScreen(SCREENS.REPORTS);
  }, []);

  const handleStartWithStudentInfo = useCallback((info) => {
    const preparedQuestions = getQuizQuestions(examConfig.questions, examConfig.sections);
    setStudentInfo(info);
    setQuizQuestions(preparedQuestions);
    setAnswers({});
    setCurrentScreen(SCREENS.QUIZ);
  }, [examConfig]);

  const handleQuizComplete = useCallback((finalAnswers) => {
    setAnswers(finalAnswers);
    setCurrentScreen(SCREENS.RESULT);
  }, []);

  const handleBackToExamType = useCallback(() => {
    setExamType(null);
    setClassNum(null);
    setSubject(null);
    setExamConfig(null);
    setStudentInfo(null);
    setQuizQuestions([]);
    setAnswers({});
    setCurrentScreen(SCREENS.EXAM_TYPE);
  }, []);

  const handleBackToClass = useCallback(() => {
    setClassNum(null);
    setSubject(null);
    setExamConfig(null);
    setStudentInfo(null);
    setQuizQuestions([]);
    setAnswers({});
    setCurrentScreen(SCREENS.CLASS_SELECTION);
  }, []);

  const handleBackToSubject = useCallback(() => {
    setSubject(null);
    setExamConfig(null);
    setStudentInfo(null);
    setQuizQuestions([]);
    setAnswers({});
    setCurrentScreen(SCREENS.SUBJECT_SELECTION);
  }, []);

  const renderScreen = () => {
    if (!hasExams && currentScreen !== SCREENS.RESULT) {
      return <EmptyState />;
    }

    switch (currentScreen) {
      case SCREENS.EXAM_TYPE:
        return <ExamTypeScreen examTypes={examTypes} onSelect={handleSelectExamType} />;

      case SCREENS.CLASS_SELECTION:
        return (
          <ClassSelectionScreen
            examType={examType}
            classes={classes}
            onSelect={handleSelectClass}
            onBack={handleBackToExamType}
          />
        );

      case SCREENS.SUBJECT_SELECTION:
        return (
          <SubjectSelectionScreen
            examType={examType}
            classNum={classNum}
            subjects={subjects}
            onSelect={handleSelectSubject}
            onBack={handleBackToClass}
          />
        );

      case SCREENS.INTRO:
        return examConfig ? (
          <IntroScreen
            config={examConfig}
            onStart={handleIntroStart}
            onReports={handleOpenReports}
            onBack={handleBackToSubject}
          />
        ) : <EmptyState />;

      case SCREENS.PRE_ASSESSMENT:
        return examConfig ? (
          <PreAssessmentScreen
            config={examConfig}
            onSuccess={handlePreAssessmentSuccess}
            onBack={handleBackToSubject}
          />
        ) : <EmptyState />;

      case SCREENS.ROLL_NUMBER:
        return (
          <RollNumberScreen
            onStartQuiz={handleStartWithStudentInfo}
            questionsCount={examConfig?.totalQuestions || 0}
            onBack={handleBackToSubject}
          />
        );

      case SCREENS.QUIZ:
        return (
          <QuizScreen
            questions={quizQuestions}
            studentInfo={studentInfo}
            timeLimitMinutes={examConfig?.timeLimitMinutes || 0}
            wrongAnswerPenaltyFraction={examConfig?.wrongAnswerPenaltyFraction || 0}
            onQuizComplete={handleQuizComplete}
          />
        );

      case SCREENS.RESULT:
        return (
          <ResultScreen
            questions={quizQuestions}
            answers={answers}
            studentInfo={studentInfo}
            config={examConfig}
            onRestart={handleBackToExamType}
          />
        );

      case SCREENS.REPORTS:
        return <ReportsScreen config={examConfig} onBack={handleBackToSubject} />;

      default:
        return null;
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

export default App;
