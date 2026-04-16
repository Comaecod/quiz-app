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
    const docRef = await addDoc(collection(db, 'quizResults'), {
      timestamp: serverTimestamp(),
      
      studentInfo: {
        firstName: studentInfo.firstName,
        lastName: studentInfo.lastName,
        rollNumber: Number(studentInfo.rollNumber) || studentInfo.rollNumber
      },
      
      className: config.className,
      subject: config.subject,
      examTitle: config.examTitle,
      teacher: config.teacher || '',
      invigilator: config.invigilator || '',
      
      results: {
        totalMarks: results.totalMarks,
        totalEarned: results.totalEarned,
        percentage: parseFloat(results.percentage),
        grade: results.grade,
        correctCount: results.correctCount,
        wrongCount: results.wrongCount,
        skippedCount: results.skippedCount
      },
      
      timeLimit: config.timeLimitMinutes,
    });
    
    console.log('Result saved:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving result:', error);
    throw error;
  }
};
