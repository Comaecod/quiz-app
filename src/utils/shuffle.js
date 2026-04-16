/**
 * Shuffle Utilities
 * Randomization for questions and options
 */

export const shuffleArray = (array) => {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

export const selectFromRange = (questions, start, end, count) => {
  const inRange = questions.filter(q => q.id >= start && q.id <= end);
  const shuffled = shuffleArray(inRange);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const selectQuestionsBySections = (questions, sections) => {
  const selected = [];
  
  sections.forEach(section => {
    const [start, end] = section.range;
    const fromSection = selectFromRange(questions, start, end, section.count);
    const markedQuestions = fromSection.map(q => ({
      ...q,
      marks: section.marks
    }));
    selected.push(...markedQuestions);
  });
  
  return selected;
};

export const prepareQuestions = (questions) => {
  return questions.map((question, index) => {
    const optionsWithIndices = question.options.map((option, optIndex) => ({
      ...option,
      originalIndex: optIndex,
    }));
    
    const shuffledOptions = shuffleArray(optionsWithIndices);
    
    let correctIndex;
    if (question.type === 'multiple') {
      const correctIndices = Array.isArray(question.isCorrect) 
        ? question.isCorrect 
        : [question.isCorrect];
      
      correctIndex = correctIndices.map(oldIdx => {
        const option = optionsWithIndices.find(opt => opt.originalIndex === oldIdx);
        return shuffledOptions.indexOf(option);
      });
    } else {
      const option = optionsWithIndices.find(opt => opt.originalIndex === question.isCorrect);
      correctIndex = shuffledOptions.indexOf(option);
    }

    return {
      ...question,
      questionNumber: index + 1,
      originalId: question.id,
      options: shuffledOptions,
      isCorrect: correctIndex,
      marks: question.marks || 1,
    };
  });
};

export const getQuizQuestions = (questions, sections = []) => {
  if (!sections || sections.length === 0) {
    const shuffled = shuffleArray(questions);
    return prepareQuestions(shuffled);
  }
  
  const selected = selectQuestionsBySections(questions, sections);
  return prepareQuestions(selected);
};
