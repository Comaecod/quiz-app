/**
 * New Migration for Lazy Loading Structure
 * Creates 3 collections:
 * 1. examTypes - just exam types
 * 2. examIndex - lightweight index (examType, classNum, subject)
 * 3. examConfigs - full config with questions
 */

import { db } from '../firebase';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';

const migrateToLazyStructure = async () => {
  console.log('Starting new migration...');
  
  let examTypesCreated = 0;
  let examIndexCreated = 0;
  let examConfigsCreated = 0;
  let skipped = 0;
  
  try {
    // Get all exams from old collection
    const existingQuery = query(collection(db, 'exams'), where('enabled', '==', true));
    const existingSnapshot = await getDocs(existingQuery);
    console.log(`Found ${existingSnapshot.size} exams in Firestore`);
    
    const examTypesSet = new Set();
    const examsList = [];
    
    // Gather all data first
    existingSnapshot.forEach(d => {
      const data = d.data();
      examTypesSet.add(data.examType);
      examsList.push(data);
    });
    
    console.log(`Exam types found: ${[...examTypesSet]}`);
    
    // Step 1: Create examTypes collection
    for (const examType of examTypesSet) {
      await setDoc(doc(db, 'examTypes', examType), {
        examType,
        enabled: true,
        order: 0
      });
      console.log(`Created examType: ${examType}`);
      examTypesCreated++;
    }
    
    // Step 2: Create examIndex
    for (const data of examsList) {
      const docId = `${data.examType}_${data.classNum}_${data.subject}`;
      
      await setDoc(doc(db, 'examIndex', docId), {
        examType: data.examType,
        classNum: String(data.classNum),
        className: data.className,
        subject: data.subject,
        title: data.title,
        teacher: data.teacher,
        enabled: true
      });
      
      console.log(`Indexed: ${docId}`);
      examIndexCreated++;
    }
    
    // Step 3: Create examConfigs with questions
    for (const data of examsList) {
      const docId = `${data.examType}_${data.classNum}_${data.subject}`;
      
      if (data.questions && data.questions.length > 0) {
        await setDoc(doc(db, 'examConfigs', docId), {
          examType: data.examType,
          classNum: String(data.classNum),
          className: data.className,
          title: data.title,
          subject: data.subject,
          teacher: data.teacher,
          invigilator: data.invigilator,
          preassessmentsecretkey: data.preassessmentsecretkey,
          secretKey: data.secretKey,
          teacherSecretKey: data.teacherSecretKey,
          wrongAnswerPenaltyFraction: data.wrongAnswerPenaltyFraction,
          timeLimitMinutes: data.timeLimitMinutes,
          enabled: data.enabled,
          sections: data.sections || [],
          questions: data.questions || [],
          totalQuestions: data.totalQuestions,
          totalMarks: data.totalMarks
        });
        
        console.log(`Config: ${docId} (${data.questions?.length || 0} questions)`);
        examConfigsCreated++;
      } else {
        skipped++;
      }
    }
    
    console.log('\n=== Migration Complete ===');
    console.log(`examTypes: ${examTypesCreated}`);
    console.log(`examIndex: ${examIndexCreated}`);
    console.log(`examConfigs: ${examConfigsCreated}`);
    console.log(`Skipped (no questions): ${skipped}`);
    
    return { examTypesCreated, examIndexCreated, examConfigsCreated, skipped };
  } catch (err) {
    console.error('Migration failed:', err.message);
    return { error: err.message };
  }
};

export default migrateToLazyStructure;