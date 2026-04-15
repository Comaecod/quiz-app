/**
 * Scoring utility functions
 * Handles all scoring logic including negative marking
 */

import { getMarksForQuestion } from '../data/constants';

/**
 * Normalize the selected answer to a consistent array format
 * @param {*} selected - The selected answer (can be number or array)
 * @param {string} type - Question type ('single' or 'multiple')
 * @returns {Array} - Array of selected indices
 */
export const normalizeSelectedAnswer = (selected, type) => {
  if (selected === undefined || selected === null) return [];
  
  if (type === 'multiple') {
    return Array.isArray(selected) ? [...selected].sort() : [];
  }
  
  return [selected];
};

/**
 * Check if two arrays contain the same elements (order independent)
 * @param {Array} arr1 - First array
 * @param {Array} arr2 - Second array
 * @returns {boolean} - True if arrays have same elements
 */
export const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  
  const sorted1 = [...arr1].sort((a, b) => a - b);
  const sorted2 = [...arr2].sort((a, b) => a - b);
  
  return sorted1.every((val, index) => val === sorted2[index]);
};

/**
 * Calculate score for a single question
 * @param {Object} question - The question object
 * @param {*} selectedAnswer - The student's answer
 * @param {number} penaltyFraction - Fraction of marks to deduct for wrong answer
 * @returns {Object} - Score object with marks earned and details
 */
export const calculateQuestionScore = (question, selectedAnswer, penaltyFraction) => {
  const marks = getMarksForQuestion(question.questionNumber);
  const normalizedCorrect = Array.isArray(question.isCorrect) 
    ? question.isCorrect 
    : [question.isCorrect];
  
  const normalizedSelected = normalizeSelectedAnswer(selectedAnswer, question.type);
  
  const isCorrect = arraysEqual(normalizedCorrect, normalizedSelected);
  
  let marksEarned = 0;
  let isSkipped = normalizedSelected.length === 0;
  
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
    correctAnswer: normalizedCorrect,
    studentAnswer: normalizedSelected,
  };
};

/**
 * Calculate total score for all questions
 * @param {Array} questions - Array of question objects
 * @param {Object} answers - Object mapping question IDs to selected answers
 * @param {number} penaltyFraction - Fraction of marks to deduct for wrong answer
 * @returns {Object} - Complete scoring results
 */
export const calculateTotalScore = (questions, answers, penaltyFraction) => {
  let totalMarks = 0;
  let totalEarned = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;
  
  const questionResults = questions.map(question => {
    const result = calculateQuestionScore(
      question,
      answers[question.id],
      penaltyFraction
    );
    
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
  
  const grade = getGrade(percentage);
  
  return {
    totalMarks,
    totalEarned: Math.round(totalEarned * 100) / 100,
    percentage,
    grade,
    correctCount,
    wrongCount,
    skippedCount,
    questionResults,
  };
};

/**
 * Determine grade based on percentage
 * @param {number} percentage - Score percentage
 * @returns {string} - Grade letter
 */
export const getGrade = (percentage) => {
  const pct = parseFloat(percentage);
  
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  if (pct >= 40) return 'E';
  return 'F';
};

/**
 * Get performance message based on score
 * @param {number} percentage - Score percentage
 * @returns {Object} - Message and emoji
 */
export const getPerformanceMessage = (percentage) => {
  const pct = parseFloat(percentage);
  
  if (pct >= 90) {
    return { message: 'Outstanding! You\'re a star!', emoji: '🌟' };
  }
  if (pct >= 80) {
    return { message: 'Excellent work! Keep it up!', emoji: '👏' };
  }
  if (pct >= 70) {
    return { message: 'Good job! Room for improvement!', emoji: '💪' };
  }
  if (pct >= 60) {
    return { message: 'Nice effort! Keep practicing!', emoji: '📚' };
  }
  if (pct >= 50) {
    return { message: 'You passed! Study more!', emoji: '📖' };
  }
  if (pct >= 40) {
    return { message: 'Just passed! Focus more!', emoji: '🎯' };
  }
  return { message: 'Keep trying! You can do better!', emoji: '💯' };
};

/**
 * Format the student's answers for display
 * @param {Array} options - Array of option objects
 * @param {Array} indices - Array of selected option indices
 * @returns {Array} - Array of selected option texts
 */
export const formatSelectedAnswers = (options, indices) => {
  return indices.map(index => {
    const option = options.find((opt, i) => i === index);
    return option ? option.text : '';
  }).filter(Boolean);
};
