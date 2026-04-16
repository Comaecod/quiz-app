# 🎓 Quiz Web Application

> A modern, responsive online examination system with real-time assessments, teacher reports, and Firebase integration. Built with React, Vite, and Tailwind CSS.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-10.x-FFCA28?logo=firebase&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### For Students
- 📝 **Timed Assessments** - Countdown timer with visual warnings
- ✅ **Single & Multiple Choice** - Radio buttons and checkboxes
- 🔀 **Randomized Questions** - Questions and options shuffled per student
- 🎯 **Negative Marking** - Configurable penalty (set to 0 to disable)
- ⏭️ **Skip Questions** - Navigate freely, no penalty for skipping
- 📊 **Instant Results** - Detailed score analysis with grades

### For Teachers
- 🔐 **Reports Dashboard** - View all student submissions
- 📋 **Sortable Tables** - Sort by name, marks, percentage, etc.
- 🔄 **Real-time Data** - Refresh to see latest submissions
- 🔒 **Secure Access** - Protected by teacher secret key
- 📱 **Responsive** - Works on desktop and mobile

### Technical
- ⚡ **Lightning Fast** - Built with Vite for optimal performance
- 🎨 **Modern UI** - Glass morphism design with Tailwind CSS
- 📱 **Fully Responsive** - Mobile-first, works on all devices
- ♿ **Accessible** - ARIA labels, keyboard navigation, screen reader support
- 🔥 **Firebase Integration** - Real-time data storage

---

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Library | 18.2.0 |
| **Vite** | Build Tool | 5.4.21 |
| **Tailwind CSS** | Styling | 3.x |
| **Firebase** | Backend Database | 10.x |

---

## 📁 Project Structure

```
quiz-app/
├── index.html                 # Entry HTML with meta tags & PWA config
├── package.json              # Dependencies & scripts
├── vite.config.js            # Build configuration
├── tailwind.config.js        # Tailwind theme customization
├── postcss.config.js         # PostCSS configuration
├── .env                      # Firebase config (create from .env.example)
├── .env.example              # Environment template
├── .gitignore                # Git ignore patterns
│
├── public/
│   ├── favicon.svg           # App favicon
│   └── manifest.json         # PWA manifest
│
└── src/
    ├── main.jsx              # React entry point with lazy loading
    ├── App.jsx               # Root component & screen routing
    ├── index.css             # Tailwind directives & custom styles
    ├── firebase.js           # Firebase initialization
    │
    ├── components/           # UI Components
    │   ├── IntroScreen.jsx   # Welcome screen with Assessments/Reports
    │   ├── RollNumberScreen.jsx # Student details form
    │   ├── QuizScreen.jsx    # Main quiz with timer & navigator
    │   ├── QuestionCard.jsx   # Question display with smart grid
    │   ├── Timer.jsx         # Countdown with warnings
    │   ├── ResultScreen.jsx  # Results with secret key unlock
    │   ├── ReportsScreen.jsx # Teacher reports dashboard
    │   ├── EmptyState.jsx    # "No exam available" screen
    │   └── Footer.jsx        # App footer
    │
    ├── data/
    │   ├── constants.js       # Configuration loader & exports
    │   ├── exam.json         # Active exam configuration
    │   └── fallback.json     # Fallback when no exam enabled
    │
    ├── services/
    │   └── firebaseService.js # Firestore save operations
    │
    └── utils/
        ├── format.js         # Name formatting utilities
        ├── scoring.js        # Score calculation logic
        └── shuffle.js        # Question randomization
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Firebase project (optional, for saving results)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd quiz-app

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Server runs at http://localhost:3000/quiz-app/
```

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

---

## ⚙️ Configuration

### 1. Exam Setup (`src/data/exam.json`)

```json
{
  "exam": {
    "title": "Your Exam Title",
    "class": 7,
    "subject": "Subject Name",
    "teacher": "Teacher Name",
    "invigilator": "Invigilator Name",
    "secretKey": "studentUnlockKey",
    "teacherSecretKey": "teacherReportsKey",
    "wrongAnswerPenaltyFraction": 0.25,
    "timeLimitMinutes": 15,
    "enabled": true
  },
  "sections": [
    { "range": [1, 50], "marks": 1, "count": 20 }
  ],
  "questions": [
    {
      "id": 1,
      "text": "Your question here?",
      "image": null,
      "type": "single",
      "options": [
        { "text": "Option A" },
        { "text": "Option B" },
        { "text": "Option C" },
        { "text": "Option D" }
      ],
      "isCorrect": 0
    }
  ]
}
```

### Configuration Fields

| Field | Description | Example |
|-------|-------------|---------|
| `title` | Exam title displayed to students | "Unit Test 1" |
| `class` | Class/grade number | 7 |
| `subject` | Subject name | "Mathematics" |
| `teacher` | Teacher's name | "Mr. Smith" |
| `secretKey` | Key to unlock answer reveal | "secret123" |
| `teacherSecretKey` | Key to access reports | "teacherPass" |
| `wrongAnswerPenaltyFraction` | Negative marking (0 = disabled) | 0.25 |
| `timeLimitMinutes` | Exam duration | 15 |
| `enabled` | Show exam or fallback | true/false |

### Section Configuration

Sections define which questions to select and their marks:

```json
"sections": [
  { "range": [1, 12], "marks": 2, "count": 6 },
  { "range": [13, 20], "marks": 4, "count": 4 }
]
```

This selects 6 questions from Q1-12 (2 marks each) and 4 questions from Q13-20 (4 marks each) = 10 questions, 28 marks total.

### Question Structure

**Single Choice:**
```json
{
  "id": 1,
  "text": "What is 2+2?",
  "image": null,
  "type": "single",
  "options": [
    { "text": "3" },
    { "text": "4" },
    { "text": "5" }
  ],
  "isCorrect": 1
}
```

**Multiple Choice:**
```json
{
  "id": 2,
  "text": "Select all prime numbers:",
  "type": "multiple",
  "options": [
    { "text": "2" },
    { "text": "4" },
    { "text": "5" }
  ],
  "isCorrect": [0, 2]
}
```

**With Image:**
```json
{
  "id": 3,
  "text": "What is shown in the image?",
  "image": "/images/question1.png",
  "type": "single",
  "options": [...],
  "isCorrect": 0
}
```

### Disable Exam

To show "No Exam Available":
```json
"enabled": false
```

---

## 🔥 Firebase Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add a Web app to get configuration
4. Enable Firestore Database (start in test mode)

### Environment Setup

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your Firebase values:
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Firestore Rules (for testing)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### For Production

1. Enable authentication
2. Add proper security rules
3. Restrict access by domain

---

## 📊 Scoring System

### Grade Thresholds

| Percentage | Grade |
|------------|-------|
| ≥ 90% | A1 |
| ≥ 80% | A2 |
| ≥ 70% | B1 |
| ≥ 60% | B2 |
| ≥ 50% | C1 |
| ≥ 40% | C2 |
| ≥ 33% | D |
| < 33% | E |

### Negative Marking

When `wrongAnswerPenaltyFraction` is set:
- **Correct answer**: Full marks
- **Wrong answer**: Negative marks (marks × penalty)
- **Skipped**: 0 marks (no penalty)

Example: 0.25 penalty on a 1-mark question:
- Correct: +1.0
- Wrong: -0.25
- Skipped: 0

Set to `0` to disable negative marking.

---

## 🎨 Customization

### Colors (`tailwind.config.js`)

```javascript
theme: {
  extend: {
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
    },
  },
}
```

### Add More Exams

Create multiple exam JSON files and load them conditionally:

```javascript
// src/data/constants.js
import examData from './exam1.json';
// or
import examData from './exam2.json';
```

---

## 🌐 Deployment

### GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Deploy
npm run deploy
```

### Netlify / Vercel

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

### Self-Hosting

```bash
# Build
npm run build

# Serve with any static server
npx serve dist
```

---

## 🧩 Application Flow

```
┌─────────────────┐
│   IntroScreen   │  ← Assessments | Reports
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│Assess- │ │Reports │
│ments   │ │(Login) │
└───┬────┘ └───┬────┘
    ▼          ▼
┌────────┐ ┌────────┐
│ Roll # │ │ Table  │
│ Screen │ │ View   │
└───┬────┘ └────────┘
    ▼
┌────────┐
│  Quiz  │
│ Screen │
└───┬────┘
    ▼
┌────────┐
│Result  │
│Screen  │
└────────┘
```

---

## 🔧 Utility Functions

### `shuffle.js`
- `shuffleArray(array)` - Fisher-Yates shuffle
- `selectQuestionsBySections(questions, sections)` - Section-based selection
- `prepareQuestions(questions)` - Shuffle options, track correct answers
- `getQuizQuestions(questions)` - Full preparation pipeline

### `scoring.js`
- `calculateQuestionScore(question, answer, penalty)` - Single question
- `calculateTotalScore(questions, answers, penalty)` - Full quiz
- `getGrade(percentage)` - Letter grade
- `getPerformanceMessage(percentage)` - Encouraging message

### `format.js`
- `formatName(name)` - Capitalize first letter, lowercase rest

---

## 📱 Accessibility

- Keyboard navigation support
- ARIA labels throughout
- Screen reader friendly
- High contrast colors
- Responsive design for all devices
- Reduced motion support

---

## 🛠️ Development

### Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter (if configured)
```

### Code Style

- Use functional components with hooks
- Use Tailwind utility classes
- Keep components small and focused
- Use named exports for utilities

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

MIT License - feel free to use this for your school or organization.

---

## 🙏 Acknowledgments

- **React** - Amazing UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase** - Real-time database
- **Google Fonts** - Inter font family

---

<div align="center">
  <strong>Built with ❤️ by <a href="https://github.com/Vishnukv">Vishnu</a></strong>
  <br>
  <sub>Perfect for schools, online courses, and assessments</sub>
</div>
