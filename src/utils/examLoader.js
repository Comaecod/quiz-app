/**
 * Exam Loader Utility
 * Loads and organizes exams from the Exams folder structure
 * Structure: Exams/{ExamType}/{Class}/{Subject}.json
 */

const EXAM_TYPE_ORDER = ['Slip Test', 'Bridge Course', 'Unit Test 1', 'Term 1', 'Unit Test 2', 'Term 2'];

const examModules = import.meta.glob('../data/Exams/**/*.json', { eager: true });

const parseExams = () => {
  const exams = {};

  Object.entries(examModules).forEach(([path, module]) => {
    const data = module.default || module;
    
    if (!data.exam || !data.exam.enabled) return;

    const examType = data.exam.examType || path.split('/Exams/')[1]?.split('/')[0] || 'Other';
    const classNum = String(data.exam.class || 'Unknown');
    const subject = data.exam.subject || 'Unknown';
    const fileName = path.split('/').pop().replace('.json', '');

    if (!exams[examType]) {
      exams[examType] = {};
    }
    if (!exams[examType][classNum]) {
      exams[examType][classNum] = {};
    }

    exams[examType][classNum][subject] = {
      fileName,
      path,
      ...data.exam,
      sections: data.sections || [],
      questions: data.questions || []
    };
  });

  const sortedExams = {};
  EXAM_TYPE_ORDER.forEach(type => {
    if (exams[type]) {
      sortedExams[type] = exams[type];
    }
  });
  
  Object.keys(exams).forEach(type => {
    if (!sortedExams[type]) {
      sortedExams[type] = exams[type];
    }
  });

  return sortedExams;
};

export const getAllExams = () => parseExams();

export const getExamTypes = () => {
  const exams = parseExams();
  return Object.keys(exams).filter(type => Object.keys(exams[type]).length > 0);
};

export const getClassesForType = (examType) => {
  const exams = parseExams();
  if (!exams[examType]) return [];
  return Object.keys(exams[examType]).sort((a, b) => Number(a) - Number(b));
};

export const getSubjectsForClass = (examType, classNum) => {
  const exams = parseExams();
  if (!exams[examType] || !exams[examType][classNum]) return [];
  return Object.keys(exams[examType][classNum]);
};

export const getExam = (examType, classNum, subject) => {
  const exams = parseExams();
  if (!exams[examType] || !exams[examType][classNum] || !exams[examType][classNum][subject]) {
    return null;
  }
  return exams[examType][classNum][subject];
};

export const getExamConfig = (examType, classNum, subject) => {
  const exam = getExam(examType, classNum, subject);
  if (!exam) return null;

  const sections = exam.sections || [];
  let totalQuestions = 0;
  let totalMarks = 0;
  
  sections.forEach(section => {
    totalQuestions += section.count;
    totalMarks += section.count * section.marks;
  });

  const marksPerQuestion = sections.map(section => ({
    range: section.range,
    marks: section.marks
  }));

  return {
    examType,
    className: Number(classNum),
    examTitle: exam.title,
    classNum,
    subject,
    teacher: exam.teacher || '',
    invigilator: exam.invigilator || '',
    preassessmentsecretkey: exam.preassessmentsecretkey || '',
    secretKey: exam.secretKey || '',
    teacherSecretKey: exam.teacherSecretKey || '',
    schoolName: 'Sri Kanchi Kamakoti Sankara Vidyalaya',
    sections,
    totalQuestions,
    totalMarks,
    marksPerQuestion,
    wrongAnswerPenaltyFraction: exam.wrongAnswerPenaltyFraction ?? 0,
    timeLimitMinutes: exam.timeLimitMinutes || 0,
    questions: exam.questions || [],
    isEnabled: exam.enabled !== false
  };
};
