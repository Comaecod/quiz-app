/**
 * Exam Migration Utility
 * Run this once to upload all JSON exams to Firestore
 */

import { db } from '../firebase';
import { collection, doc, setDoc, getDocs, query } from 'firebase/firestore';

const EXAM_TYPE_ORDER = ['Slip Test', 'Bridge Course', 'Unit Test 1', 'Term 1', 'Unit Test 2', 'Term 2', 'Learning'];

const examModules = import.meta.glob('../data/Exams/**/*.json', { eager: true });

const migrateExams = async () => {
  console.log('Starting migration...');
  console.log('Found modules:', Object.keys(examModules).length);
  
  let uploaded = 0;
  let skipped = 0;
  const errors = [];
  
  try {
    // Log all JSON files found
    for (const path of Object.keys(examModules)) {
      console.log('Found JSON:', path);
    }
    
    // Get existing exams to check what's already uploaded
    const existingQuery = query(collection(db, 'exams'));
    const existingSnapshot = await getDocs(existingQuery);
    const existingKeys = new Set();
    existingSnapshot.forEach(d => {
      existingKeys.add(d.id);
    });
    console.log(`Found ${existingKeys.size} existing exams in Firestore`);
    
    for (const [path, module] of Object.entries(examModules)) {
      const data = module.default || module;
      
      console.log(`Processing: ${path}`);
      console.log(`  data.exam exists:`, !!data.exam);
      console.log(`  data.exam.enabled:`, data.exam?.enabled);
      
      if (!data.exam || !data.exam.enabled) {
        console.log(`Skipping disabled: ${path}`);
        skipped++;
        continue;
      }
      
      try {
        let examType;
        if (path.includes('/Learning/')) {
          examType = 'Learning';
        } else {
          examType = path.split('/Exams/')[1]?.split('/')[0] || 'Other';
        }
        
        console.log(`  examType: ${examType}`);
        
        if (examType === 'Learning') {
          const topicName = data.exam.title;
          const docId = `Learning_${topicName}`;
          
          await setDoc(doc(db, 'exams', docId), {
            examType: 'Learning',
            title: data.exam.title,
            subject: data.exam.subject,
            teacher: data.exam.teacher,
            invigilator: data.exam.invigilator,
            classNum: String(data.exam.class),
            preassessmentsecretkey: data.exam.preassessmentsecretkey,
            secretKey: data.exam.secretKey,
            teacherSecretKey: data.exam.teacherSecretKey,
            wrongAnswerPenaltyFraction: data.exam.wrongAnswerPenaltyFraction,
            timeLimitMinutes: data.exam.timeLimitMinutes,
            enabled: data.exam.enabled,
            topics: data.concepts || [],
            questions: data.questions || [],
            sections: data.sections || [],
            createdAt: new Date(),
            fromFile: path
          });
          
          console.log(`Uploaded: ${docId}`);
          uploaded++;
          continue;
        }
        
        const classNum = String(data.exam.class || 'Unknown');
        const subject = data.exam.subject || 'Unknown';
        const docId = `${examType}_${classNum}_${subject}`;
        
        if (existingKeys.has(docId)) {
          console.log(`Skipping existing: ${docId}`);
          skipped++;
          continue;
        }
        
        const sections = data.sections || [];
        let totalQuestions = 0;
        let totalMarks = 0;
        
        sections.forEach(section => {
          totalQuestions += section.count;
          totalMarks += section.count * section.marks;
        });
        
        await setDoc(doc(db, 'exams', docId), {
          examType,
          classNum,
          className: Number(classNum),
          title: data.exam.title,
          subject,
          teacher: data.exam.teacher,
          invigilator: data.exam.invigilator,
          preassessmentsecretkey: data.exam.preassessmentsecretkey,
          secretKey: data.exam.secretKey,
          teacherSecretKey: data.exam.teacherSecretKey,
          wrongAnswerPenaltyFraction: data.exam.wrongAnswerPenaltyFraction,
          timeLimitMinutes: data.exam.timeLimitMinutes,
          enabled: data.exam.enabled,
          sections,
          questions: data.questions || [],
          totalQuestions,
          totalMarks,
          order: EXAM_TYPE_ORDER.indexOf(examType),
          createdAt: new Date(),
          fromFile: path
        });
        
        console.log(`Uploaded: ${docId}`);
        uploaded++;
      } catch (err) {
        console.error(`Error processing ${path}:`, err.message);
        errors.push({ path, error: err.message });
      }
    }
    
    console.log('\n=== Migration Complete ===');
    console.log(`Uploaded: ${uploaded}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Errors: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('Errors:', errors);
    }
    
    return { uploaded, skipped, errors };
  } catch (err) {
    console.error('Migration failed:', err.message);
    return { uploaded, skipped, errors: [err.message] };
  }
};

export default migrateExams;