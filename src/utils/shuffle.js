/**
 * Shuffle Utilities
 * Randomization for questions and options
 */

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
 * Select random subset of questions
 * @param {Object[]} questions - All available questions
 * @param {number} count - Number to select
 * @returns {Object[]} Randomly selected questions
 */
export const selectRandomQuestions = (questions, count) => {
  if (questions.length === 0) return [];
  
  const shuffled = shuffleArray(questions);
  return shuffled.slice(0, Math.min(count, questions.length));
};

/**
 * Prepare questions for quiz:
 * - Assign sequential IDs if missing
 * - Shuffle options within each question
 * - Track correct answer indices after shuffle
 * @param {Object[]} questions - Questions to prepare
 * @returns {Object[]} Prepared questions
 */
export const prepareQuestions = (questions) => {
  return questions.map((question, index) => {
    // Assign ID if missing
    const id = question.id || index + 1;
    
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
      id,
      questionNumber: index + 1,
      options: shuffledOptions,
      isCorrect: correctIndex,
    };
  });
};

/**
 * Main function: get random questions with shuffled options
 * @param {Object[]} questions - All available questions
 * @param {number} count - Number of questions to select
 * @returns {Object[]} Prepared quiz questions
 */
export const getQuizQuestions = (questions, count) => {
  const selected = selectRandomQuestions(questions, count);
  return prepareQuestions(selected);
};
