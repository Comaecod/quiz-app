import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * FIREBASE CONFIGURATION
 * 
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project or select existing one
 * 3. Go to Project Settings > Your apps > Add app (Web)
 * 4. Copy your firebaseConfig object below
 * 5. RENAME this file to firebase.js (remove .example)
 * 
 * IMPORTANT: Never commit firebase.js with real API keys to version control!
 * The firebase.js file is already in .gitignore
 */

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
