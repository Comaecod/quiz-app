/**
 * Exam Loader - Optimized for Lazy Loading
 * 1. Fetch exam types only (lightweight)
 * 2. Fetch classes/subjects per type on demand
 * 3. Fetch questions only when exam is selected
 */

import { db } from '../firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

// Lightweight cache - exam types only
const examTypesCache = { data: null, timestamp: 0 };
const CACHE_TTL = 60 * 1000; // 1 minute

// Cache for classes per exam type
const classCache = new Map();

// Cache for subjects per class
const subjectCache = new Map();

// Cache for exam config (full with questions)
const examConfigCache = new Map();

// Learning topics cache
let learningTopicsCache = null;

// STAGE 1: Get exam types only (very lightweight)
export const getExamTypes = async () => {
  const now = Date.now();
  
  if (examTypesCache.data && (now - examTypesCache.timestamp) < CACHE_TTL) {
    const types = Object.keys(examTypesCache.data);
    return [...types, 'Learning'].filter(Boolean);
  }
  
  try {
    const q = query(
      collection(db, 'examTypes'),
      where('enabled', '==', true)
    );
    
    const snapshot = await getDocs(q);
    const types = {};
    
    snapshot.forEach(d => {
      const data = d.data();
      types[data.examType] = {
        id: d.id,
        ...data
      };
    });
    
    examTypesCache.data = types;
    examTypesCache.timestamp = now;
    
    return Object.keys(types);
  } catch (error) {
    console.error('Error fetching exam types:', error.message);
    return examTypesCache.data ? Object.keys(examTypesCache.data) : [];
  }
};

// STAGE 2: Get classes for exam type
export const getClassesForType = async (examType) => {
  if (examType === 'Learning') return [];
  
  if (classCache.has(examType)) {
    return classCache.get(examType);
  }
  
  try {
    const q = query(
      collection(db, 'examIndex'),
      where('examType', '==', examType)
    );
    
    const snapshot = await getDocs(q);
    const classes = [];
    
    snapshot.forEach(d => {
      const data = d.data();
      if (data.classNum) {
        classes.push(data.classNum);
      }
    });
    
    const sorted = classes.sort((a, b) => Number(a) - Number(b));
    classCache.set(examType, sorted);
    return sorted;
  } catch (error) {
    console.error('Error fetching classes:', error.message);
    return [];
  }
};

// Get learning topics from Firestore
const getLearningTopicsFromFirestore = async () => {
  if (learningTopicsCache) return learningTopicsCache;
  
  try {
    const q = query(
      collection(db, 'examConfigs'),
      where('examType', '==', 'Learning')
    );
    const snapshot = await getDocs(q);
    const topics = [];
    snapshot.forEach(d => {
      const data = d.data();
      if (data.title) topics.push(data.title);
    });
    learningTopicsCache = topics;
    return topics;
  } catch (err) {
    console.error('Error fetching learning topics:', err.message);
    return [];
  }
};

// STAGE 3: Get subjects for class
export const getSubjectsForClass = async (examType, classNum) => {
  if (examType === 'Learning') {
    return getLearningTopicsFromFirestore();
  }
  
  const key = `${examType}_${classNum}`;
  
  if (subjectCache.has(key)) {
    return subjectCache.get(key);
  }
  
  try {
    const q = query(
      collection(db, 'examIndex'),
      where('examType', '==', examType),
      where('classNum', '==', classNum)
    );
    
    const snapshot = await getDocs(q);
    const subjects = [];
    
    snapshot.forEach(d => {
      const data = d.data();
      if (data.subject) {
        subjects.push(data.subject);
      }
    });
    
    subjectCache.set(key, subjects);
    return subjects;
  } catch (error) {
    return [];
  }
};

// STAGE 4: Get full exam config with questions
export const getExamConfig = async (examType, classNum, subject) => {
  if (examType === 'Learning') {
    return getLearningTopicConfig(subject);
  }
  
  const key = `${examType}_${classNum}_${subject}`;
  
  // Always fetch fresh to get latest keys - no caching for security
  try {
    const docRef = doc(db, 'examConfigs', key);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const exam = docSnap.data();
    
    const config = {
      examType: exam.examType,
      className: exam.className,
      examTitle: exam.title,
      classNum: exam.classNum,
      subject: exam.subject,
      teacher: exam.teacher || '',
      invigilator: exam.invigilator || '',
      preassessmentsecretkey: exam.preassessmentsecretkey || '',
      secretKey: exam.secretKey || '',
      teacherSecretKey: exam.teacherSecretKey || '',
      schoolName: 'Sri Kanchi Kamakoti Sankara Vidyalaya',
      sections: exam.sections || [],
      totalQuestions: exam.totalQuestions,
      totalMarks: exam.totalMarks,
      marksPerQuestion: (exam.sections || []).map(s => ({ range: s.range, marks: s.marks })),
      wrongAnswerPenaltyFraction: exam.wrongAnswerPenaltyFraction ?? 0,
      timeLimitMinutes: exam.timeLimitMinutes || 0,
      questions: exam.questions || [],
      isEnabled: exam.enabled !== false
    };
    
    return config;
  } catch (error) {
    console.error('Error fetching exam config:', error.message);
    return null;
  }
};

export const getLearningTopics = () => getLearningTopicsFromFirestore();

export const getLearningTopicConfig = async (topicName) => {
  try {
    const q = query(
      collection(db, 'examConfigs'),
      where('examType', '==', 'Learning'),
      where('title', '==', topicName)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const data = snapshot.docs[0].data();
    return {
      examType: 'Learning',
      className: data.className,
      examTitle: data.title,
      classNum: data.classNum,
      subject: data.subject,
      teacher: data.teacher,
      invigilator: data.invigilator,
      preassessmentsecretkey: data.preassessmentsecretkey,
      secretKey: data.secretKey,
      teacherSecretKey: data.teacherSecretKey,
      schoolName: 'Sri Kanchi Kamakoti Sankara Vidyalaya',
      sections: data.sections || [{ range: [1, 10], marks: 1, count: 10 }],
      totalQuestions: data.totalQuestions,
      totalMarks: data.totalMarks,
      marksPerQuestion: [{ range: [1, 10], marks: 1 }],
      wrongAnswerPenaltyFraction: data.wrongAnswerPenaltyFraction ?? 0,
      timeLimitMinutes: data.timeLimitMinutes || 30,
      questions: data.questions || [],
      topics: data.topics || [],
      isEnabled: true
    };
  } catch (err) {
    console.error('Error loading learning topic:', err.message);
    return null;
  }
};

export const getAllExams = async () => {
  // Legacy - not used now
  return {};
};