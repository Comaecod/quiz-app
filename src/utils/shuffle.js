/**
 * Shuffle Utilities
 * Randomization for questions and options
 */

import { QUIZ_CONFIG } from '../data/constants';

/**
 * Fisher-Yates shuffle algorithm
 * Creates new shuffled array without mutating original
 * @param {T[]} array - Array to shuffle
 * @returns {T[]} New shuffled array
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

/**
 * Select random questions from a specific range
 * @param {Object[]} questions - All available questions
 * @param {number} start - Range start (inclusive)
 * @param {number} end - Range end (inclusive)
 * @param {number} count - Number to select
 * @returns {Object[]} Selected questions from range
 */
export const selectFromRange = (questions, start, end, count) => {
  const inRange = questions.filter(q => q.id >= start && q.id <= end);
  const shuffled = shuffleArray(inRange);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

/**
 * Select questions based on sections configuration
 * Each section has: { range: [start, end], marks: n, count: m }
 * Selects m questions from the range [start, end]
 * @param {Object[]} questions - All available questions
 * @param {Object[]} sections - Section configurations
 * @returns {Object[]} Selected questions grouped by section
 */
export const selectQuestionsBySections = (questions, sections) => {
  const selected = [];
  
  sections.forEach(section => {
    const [start, end] = section.range;
    const fromSection = selectFromRange(questions, start, end, section.count);
    selected.push(...fromSection);
  });
  
  return selected;
};

/**
 * Prepare questions for quiz:
 * - Shuffle options within each question
 * - Track correct answer indices after shuffle
 * @param {Object[]} questions - Questions to prepare
 * @returns {Object[]} Prepared questions
 */
export const prepareQuestions = (questions) => {
  return questions.map((question, index) => {
    // Add original index to each option for tracking
    const optionsWithIndices = question.options.map((option, optIndex) => ({
      ...option,
      originalIndex: optIndex,
    }));
    
    // Shuffle options
    const shuffledOptions = shuffleArray(optionsWithIndices);
    
    // Map correct answer index to new shuffled position
    let correctIndex;
    if (question.type === 'multiple') {
      // Multiple correct: map all indices
      const correctIndices = Array.isArray(question.isCorrect) 
        ? question.isCorrect 
        : [question.isCorrect];
      
      correctIndex = correctIndices.map(oldIdx => {
        const option = optionsWithIndices.find(opt => opt.originalIndex === oldIdx);
        return shuffledOptions.indexOf(option);
      });
    } else {
      // Single correct: map single index
      const option = optionsWithIndices.find(opt => opt.originalIndex === question.isCorrect);
      correctIndex = shuffledOptions.indexOf(option);
    }

    return {
      ...question,
      questionNumber: index + 1,
      originalId: question.id,
      options: shuffledOptions,
      isCorrect: correctIndex,
    };
  });
};

/**
 * Main function: get questions based on sections with shuffled options
 * @param {Object[]} questions - All available questions
 * @returns {Object[]} Prepared quiz questions
 */
export const getQuizQuestions = (questions) => {
  const { sections } = QUIZ_CONFIG;
  
  if (!sections || sections.length === 0) {
    // Fallback: select all questions if no sections defined
    const shuffled = shuffleArray(questions);
    return prepareQuestions(shuffled);
  }
  
  const selected = selectQuestionsBySections(questions, sections);
  return prepareQuestions(selected);
};
