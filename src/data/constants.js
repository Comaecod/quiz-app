/**
 * Quiz Configuration
 * 
 * Single exam configuration file: src/data/exam.json
 * 
 * To enable an exam:
 *   - Set "enabled": true
 *   - Add your questions
 * 
 * To disable exam (show "No Exam Available"):
 *   - Set "enabled": false
 *   - Or use the fallback.json file
 */

import examData from './exam.json';
import fallbackData from './fallback.json';

/**
 * Get exam configuration
 * @returns {Object} Exam configuration with metadata and questions
 */
export const getExamConfig = () => {
  const data = examData;
  
  if (!data || !data.exam || data.exam.enabled === false) {
    return getFallbackConfig();
  }

  return {
    // Exam metadata
    examTitle: data.exam.title,
    className: data.exam.class,
    subject: data.exam.subject,
    teacher: data.exam.teacher || '',
    invigilator: data.exam.invigilator || '',
    secretKey: data.exam.secretKey || '',
    schoolName: 'Sri Kanchi Kamakoti Sankara Vidyalaya',
    
    // Quiz settings
    questionsPerPaper: data.exam.questionsPerPaper || 0,
    marksPerQuestion: data.exam.marksPerQuestion || [],
    wrongAnswerPenaltyFraction: data.exam.wrongAnswerPenaltyFraction || 0.25,
    timeLimitMinutes: data.exam.timeLimitMinutes || 0,
    
    // Questions array
    questions: data.questions || [],
    
    // Flag for no-exam state
    isEnabled: data.exam.enabled !== false
  };
};

/**
 * Fallback config for when no exam is available
 * @returns {Object} Fallback configuration
 */
const getFallbackConfig = () => ({
  examTitle: fallbackData.exam.title,
  className: 0,
  subject: 'General',
  teacher: '',
  invigilator: '',
  secretKey: '',
  schoolName: 'Sri Kanchi Kamakoti Sankara Vidyalaya',
  questionsPerPaper: 0,
  marksPerQuestion: [],
  wrongAnswerPenaltyFraction: 0.25,
  timeLimitMinutes: 0,
  questions: [],
  isEnabled: false
});

/**
 * Active quiz configuration
 */
export const QUIZ_CONFIG = getExamConfig();

/**
 * Questions array for the quiz
 */
export const questions = QUIZ_CONFIG.questions || [];

/**
 * Check if exam is available
 */
export const isExamAvailable = QUIZ_CONFIG.isEnabled && questions.length > 0;

/**
 * Calculate total marks for given number of questions
 * @param {number} numQuestions - Number of questions to calculate marks for
 * @returns {number} Total marks possible
 */
export const calculateTotalMarks = (numQuestions) => {
  let total = 0;
  
  for (let i = 1; i <= numQuestions; i++) {
    const markConfig = QUIZ_CONFIG.marksPerQuestion.find(
      ([start, end]) => i >= start && i <= end
    );
    if (markConfig) {
      total += markConfig[2];
    }
  }
  
  return total;
};

/**
 * Get marks for a specific question number
 * @param {number} questionNumber - Question number (1-based)
 * @returns {number} Marks for that question
 */
export const getMarksForQuestion = (questionNumber) => {
  const markConfig = QUIZ_CONFIG.marksPerQuestion.find(
    ([start, end]) => questionNumber >= start && questionNumber <= end
  );
  return markConfig ? markConfig[2] : 1;
};
