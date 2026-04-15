import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Main Entry Point
 * Renders the React application into the DOM
 * 
 * npm run deploy -> for Github Pages
 * Keys are on local -> firebase.js & serviceAccountKey.json
 * To get results -> python fetch_firestore_data.py
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
