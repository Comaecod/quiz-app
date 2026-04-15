/**
 * Shuffle utility functions
 * Provides randomization for questions and options
 */

/**
 * Fisher-Yates shuffle algorithm
 * Creates a new shuffled array without mutating the original
 * @param {Array} array - The array to shuffle
 * @returns {Array} - A new shuffled array
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
 * Select random questions from the question bank
 * @param {Array} questions - Array of all questions
 * @param {number} count - Number of questions to select
 * @returns {Array} - Array of randomly selected questions
 */
export const selectRandomQuestions = (questions, count) => {
  if (questions.length === 0) return [];
  
  const shuffled = shuffleArray(questions);
  return shuffled.slice(0, Math.min(count, questions.length));
};

/**
 * Prepare questions for the quiz
 * - Assigns IDs if not present
 * - Shuffles options within each question
 * - Normalizes the isCorrect field to a consistent format
 * @param {Array} questions - Array of questions to prepare
 * @returns {Array} - Prepared questions with shuffled options
 */
export const prepareQuestions = (questions) => {
  return questions.map((question, index) => {
    // Assign ID if not present
    const id = question.id || index + 1;
    
    // Shuffle options and track original indices
    const optionsWithIndices = question.options.map((option, optIndex) => ({
      ...option,
      originalIndex: optIndex,
    }));
    
    const shuffledOptions = shuffleArray(optionsWithIndices);
    
    // Normalize isCorrect field based on question type
    let normalizedCorrect;
    if (question.type === 'multiple') {
      // For multiple correct, map old indices to new shuffled indices
      const correctIndices = Array.isArray(question.isCorrect) 
        ? question.isCorrect 
        : [question.isCorrect];
      
      normalizedCorrect = correctIndices.map(oldIndex => {
        const found = optionsWithIndices.find(opt => opt.originalIndex === oldIndex);
        return shuffledOptions.indexOf(found);
      });
    } else {
      // For single correct, map old index to new shuffled index
      const found = optionsWithIndices.find(
        opt => opt.originalIndex === question.isCorrect
      );
      normalizedCorrect = shuffledOptions.indexOf(found);
    }
    
    return {
      ...question,
      id,
      questionNumber: index + 1,
      options: shuffledOptions,
      isCorrect: normalizedCorrect,
    };
  });
};

/**
 * Get a random subset of questions with prepared state
 * @param {Array} questions - All available questions
 * @param {number} count - Number of questions to select
 * @returns {Array} - Shuffled questions with shuffled options
 */
export const getQuizQuestions = (questions, count) => {
  const selected = selectRandomQuestions(questions, count);
  return prepareQuestions(selected);
};
