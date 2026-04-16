/**
 * Scoring Utilities
 * Handles all quiz scoring logic including negative marking
 */

export const normalizeSelectedAnswer = (selected, type) => {
  if (selected === undefined || selected === null) return [];
  
  if (type === 'multiple') {
    return Array.isArray(selected) ? [...selected].sort() : [];
  }
  
  return [selected];
};

export const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  
  const sorted1 = [...arr1].sort((a, b) => a - b);
  const sorted2 = [...arr2].sort((a, b) => a - b);
  
  return sorted1.every((val, idx) => val === sorted2[idx]);
};

export const calculateQuestionScore = (question, selectedAnswer, penaltyFraction) => {
  const marks = question.marks || 1;
  
  const correctAnswers = Array.isArray(question.isCorrect) 
    ? question.isCorrect 
    : [question.isCorrect];
  
  const studentAnswers = normalizeSelectedAnswer(selectedAnswer, question.type);
  
  const isCorrect = arraysEqual(correctAnswers, studentAnswers);
  const isSkipped = studentAnswers.length === 0;

  let marksEarned = 0;
  
  if (isSkipped) {
    marksEarned = 0;
  } else if (isCorrect) {
    marksEarned = marks;
  } else {
    marksEarned = -marks * penaltyFraction;
  }

  return {
    questionId: question.id,
    questionNumber: question.questionNumber,
    marks,
    marksEarned,
    isCorrect,
    isSkipped,
    correctAnswer: correctAnswers,
    studentAnswer: studentAnswers,
  };
};

export const calculateTotalScore = (questions, answers, penaltyFraction) => {
  let totalMarks = 0;
  let totalEarned = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  const questionResults = questions.map(question => {
    const result = calculateQuestionScore(question, answers[question.id], penaltyFraction);
    
    totalMarks += result.marks;
    totalEarned += result.marksEarned;

    if (result.isSkipped) {
      skippedCount++;
    } else if (result.isCorrect) {
      correctCount++;
    } else {
      wrongCount++;
    }

    return result;
  });

  const percentage = totalMarks > 0 
    ? ((totalEarned / totalMarks) * 100).toFixed(2) 
    : 0;

  return {
    totalMarks,
    totalEarned: Math.round(totalEarned * 100) / 100,
    percentage,
    grade: getGrade(percentage),
    correctCount,
    wrongCount,
    skippedCount,
    questionResults,
  };
};

export const getGrade = (percentage) => {
  const pct = parseFloat(percentage);
  
  if (pct >= 90) return 'A1';
  if (pct >= 80) return 'A2';
  if (pct >= 70) return 'B1';
  if (pct >= 60) return 'B2';
  if (pct >= 50) return 'C1';
  if (pct >= 40) return 'C2';
  if (pct >= 33) return 'D';
  return 'E';
};

export const getPerformanceMessage = (percentage) => {
  const pct = parseFloat(percentage);
  
  if (pct >= 90) return { message: "Outstanding! You're a star!", emoji: '🌟' };
  if (pct >= 80) return { message: 'Excellent work! Keep it up!', emoji: '👏' };
  if (pct >= 70) return { message: 'Good job! Room for improvement!', emoji: '💪' };
  if (pct >= 60) return { message: 'Nice effort! Keep practicing!', emoji: '📚' };
  if (pct >= 50) return { message: 'You passed! Study more!', emoji: '📖' };
  if (pct >= 40) return { message: 'Just passed! Focus more!', emoji: '🎯' };
  return { message: 'Keep trying! You can do better!', emoji: '💯' };
};
