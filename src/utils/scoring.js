/**
 * Scoring Utilities
 * Handles all quiz scoring logic including negative marking
 */

import { getMarksForQuestion } from '../data/constants';

/**
 * Normalize selected answer to array format
 * @param {number|number[]} selected - Selected answer index or indices
 * @param {string} type - Question type ('single' or 'multiple')
 * @returns {number[]} Array of selected indices
 */
export const normalizeSelectedAnswer = (selected, type) => {
  if (selected === undefined || selected === null) return [];
  
  if (type === 'multiple') {
    return Array.isArray(selected) ? [...selected].sort() : [];
  }
  
  return [selected];
};

/**
 * Compare two arrays regardless of order
 * @param {number[]} arr1 - First array
 * @param {number[]} arr2 - Second array
 * @returns {boolean} True if arrays contain same elements
 */
export const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  
  const sorted1 = [...arr1].sort((a, b) => a - b);
  const sorted2 = [...arr2].sort((a, b) => a - b);
  
  return sorted1.every((val, idx) => val === sorted2[idx]);
};

/**
 * Calculate score for a single question
 * @param {Object} question - Question object
 * @param {*} selectedAnswer - Student's selected answer
 * @param {number} penaltyFraction - Negative marking fraction
 * @returns {Object} Question result with marks earned
 */
export const calculateQuestionScore = (question, selectedAnswer, penaltyFraction) => {
  const marks = getMarksForQuestion(question.questionNumber);
  
  // Normalize correct answers to array
  const correctAnswers = Array.isArray(question.isCorrect) 
    ? question.isCorrect 
    : [question.isCorrect];
  
  // Normalize student's answer to array
  const studentAnswers = normalizeSelectedAnswer(selectedAnswer, question.type);
  
  // Check if answer is correct
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

/**
 * Calculate total score for all questions
 * @param {Object[]} questions - Array of questions
 * @param {Object} answers - Object mapping question IDs to answers
 * @param {number} penaltyFraction - Negative marking fraction
 * @returns {Object} Complete scoring results
 */
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

/**
 * Get letter grade from percentage
 * @param {number} percentage - Score percentage
 * @returns {string} Letter grade
 */
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

/**
 * Get performance message and emoji
 * @param {number} percentage - Score percentage
 * @returns {{message: string, emoji: string}} Performance feedback
 */
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
