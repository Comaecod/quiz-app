# 🎓 Quiz Web Application

> A modern, responsive online examination system with hierarchical exam organization, real-time assessments, teacher reports, and Firebase integration. Built with React, Vite, and Tailwind CSS.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-10.x-FFCA28?logo=firebase&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### For Students
- 📚 **Hierarchical Navigation** - Browse by Exam Type → Class → Subject
- 🔐 **Pre-Assessment Key** - Teachers provide secret key to start exam
- ⏱️ **Timed Assessments** - Countdown timer with visual warnings
- ✅ **Single & Multiple Choice** - Radio buttons and checkboxes
- 🔀 **Randomized Questions** - Questions and options shuffled per student
- 🎯 **Negative Marking** - Configurable penalty (set to 0 to disable)
- ⏭️ **Skip Questions** - Navigate freely, no penalty for skipping
- 📊 **Instant Results** - Detailed score analysis with grades

### For Teachers
- 📋 **Reports Dashboard** - View all student submissions
- 📊 **Sortable Tables** - Sort by name, marks, percentage, etc.
- 🔄 **Real-time Data** - Refresh to see latest submissions
- 🔒 **Secure Access** - Protected by teacher secret key
- 📱 **Responsive** - Works on desktop and mobile

### Exam Types Supported
- Slip Test
- Bridge Course
- Unit Test 1 / Unit Test 2
- Term 1 / Term 2

---

## 📁 Project Structure

```
quiz-app/
├── index.html                 # Entry HTML with meta tags
├── package.json              # Dependencies & scripts
├── vite.config.js            # Build configuration
├── tailwind.config.js        # Tailwind theme
├── postcss.config.js         # PostCSS configuration
├── .env                      # Firebase config
├── .env.example              # Environment template
│
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # Root component & routing
    ├── index.css             # Tailwind & custom styles
    ├── firebase.js           # Firebase initialization
    │
    ├── components/           # UI Components
    │   ├── ExamTypeScreen.jsx     # Shows exam types
    │   ├── ClassSelectionScreen.jsx # Shows classes
    │   ├── SubjectSelectionScreen.jsx # Shows subjects
    │   ├── IntroScreen.jsx    # Exam intro with details
    │   ├── PreAssessmentScreen.jsx # Pre-exam key entry
    │   ├── RollNumberScreen.jsx # Student details form
    │   ├── QuizScreen.jsx    # Main quiz interface
    │   ├── QuestionCard.jsx   # Question display
    │   ├── Timer.jsx         # Countdown timer
    │   ├── ResultScreen.jsx  # Results screen
    │   ├── ReportsScreen.jsx # Teacher reports
    │   ├── EmptyState.jsx    # No exams available
    │   └── Footer.jsx        # App footer
    │
    ├── data/
    │   └── Exams/            # Hierarchical exam JSON files
    │       ├── Bridge Course/
    │       │   └── Class 7/
    │       │       └── Computers.json
    │       └── Slip Test/
    │           └── Class 10/
    │               └── Mathematics.json
    │
    ├── services/
    │   └── firebaseService.js # Firestore operations
    │
    └── utils/
        ├── examLoader.js      # Loads exams from folder structure
        ├── format.js         # Name formatting
        ├── scoring.js        # Score calculation
        └── shuffle.js         # Question randomization
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Firebase project (optional)

### Installation

```bash
npm install
npm run dev
```

### Adding New Exams

1. Create folder structure: `src/data/Exams/{ExamType}/Class {number}/`
2. Add exam JSON file: `{Subject}.json`
3. Configure exam settings including secret keys

---

## ⚙️ Exam JSON Structure

```json
{
  "exam": {
    "title": "Bridge Course - AI & Python",
    "class": 7,
    "subject": "Computers",
    "teacher": "Mr. Teacher Name",
    "invigilator": "Mr. Teacher Name",
    "preassessmentsecretkey": "StartKey123",
    "secretKey": "AnswerKey456",
    "teacherSecretKey": "TeacherKey789",
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
        { "text": "Option B" }
      ],
      "isCorrect": 0
    }
  ]
}
```

### JSON Configuration Fields

| Field | Description | Example |
|-------|-------------|---------|
| `title` | Exam title | "Bridge Course - AI" |
| `class` | Class number | 7 |
| `subject` | Subject name | "Computers" |
| `teacher` | Teacher's name | "Mr. Smith" |
| `preassessmentsecretkey` | Key for students to start exam | "Key123" |
| `secretKey` | Key to unlock answer reveal | "AnswerKey" |
| `teacherSecretKey` | Key to access reports | "TeacherPass" |
| `wrongAnswerPenaltyFraction` | Negative marking (0 = disabled) | 0.25 |
| `timeLimitMinutes` | Exam duration | 15 |
| `enabled` | Show/hide exam | true/false |

---

## 🔥 Firebase Setup

1. Create Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Add a Web app
3. Enable Firestore Database
4. Copy `.env.example` to `.env` and add your Firebase values

```bash
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_PROJECT_ID=your-project
# ... other values
```

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

Set `wrongAnswerPenaltyFraction` to 0 to disable:
- Correct: +1.0 mark
- Wrong: -0.25 (with 0.25 penalty)
- Skipped: 0 marks

---

## 🌐 Deployment

```bash
npm run build
npm run deploy  # GitHub Pages
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Library |
| Vite 5 | Build Tool |
| Tailwind CSS 3 | Styling |
| Firebase | Database |

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Submit pull request

---

## 📄 License

MIT License

---

<div align="center">
  <strong>Built with ❤️ by <a href="https://github.com/Vishnukv">Vishnu</a></strong>
</div>
