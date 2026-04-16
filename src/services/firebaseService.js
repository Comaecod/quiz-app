/**
 * Firebase Service
 * Saves quiz results to Firestore
 */

import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Save quiz result to Firestore
 * @param {Object} studentInfo - Student details
 * @param {Object} config - Quiz configuration
 * @param {Object} results - Calculated scores
 * @returns {string} Document ID
 */
export const saveQuizResult = async (studentInfo, config, results) => {
  try {
    const docRef = await addDoc(collection(db, 'quiz_results'), {
      // Timestamp
      timestamp: serverTimestamp(),
      
      // Student info
      rollNumber: studentInfo.rollNumber,
      fullName: `${studentInfo.firstName} ${studentInfo.lastName}`,
      
      // Exam info
      class: config.className,
      subject: config.subject,
      examName: config.examTitle,
      teacher: config.teacher || '',
      invigilator: config.invigilator || '',
      
      // Scores
      totalMarks: results.totalMarks,
      score: results.totalEarned,
      percentage: parseFloat(results.percentage),
      grade: results.grade,
      
      // Breakdown
      correctCount: results.correctCount,
      wrongCount: results.wrongCount,
      skippedCount: results.skippedCount,
      totalQuestions: results.questionResults.length,
      timeLimit: config.timeLimitMinutes,
    });
    
    console.log('Result saved:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving result:', error);
    throw error;
  }
};
