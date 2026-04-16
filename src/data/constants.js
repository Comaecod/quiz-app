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

  // Calculate total questions and marks from sections
  const sections = data.sections || [];
  let totalQuestions = 0;
  let totalMarks = 0;
  
  sections.forEach(section => {
    totalQuestions += section.count;
    totalMarks += section.count * section.marks;
  });

  // Build marks per question map for scoring
  const marksPerQuestion = [];
  sections.forEach(section => {
    marksPerQuestion.push({
      range: section.range,
      marks: section.marks
    });
  });

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
    sections: sections,
    totalQuestions,
    totalMarks,
    marksPerQuestion,
    wrongAnswerPenaltyFraction: data.exam.wrongAnswerPenaltyFraction ?? 0.25,
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
  sections: [],
  totalQuestions: 0,
  totalMarks: 0,
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
 * Get total marks for display
 * @returns {number} Total marks for the paper
 */
export const getTotalMarks = () => QUIZ_CONFIG.totalMarks;

/**
 * Get total questions for display
 * @returns {number} Total questions in the paper
 */
export const getTotalQuestions = () => QUIZ_CONFIG.totalQuestions;

/**
 * Get marks for a specific question number
 * @param {number} questionNumber - Question number (1-based)
 * @returns {number} Marks for that question
 */
export const getMarksForQuestion = (questionNumber) => {
  const { marksPerQuestion } = QUIZ_CONFIG;
  
  for (const config of marksPerQuestion) {
    if (questionNumber >= config.range[0] && questionNumber <= config.range[1]) {
      return config.marks;
    }
  }
  
  return 1;
};
