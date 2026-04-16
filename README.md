# 🎓 Quiz Web Application

> A modern, feature-rich online examination system built with React and Vite. Supports single/multiple choice questions, negative marking, timed assessments, and detailed result analysis.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![Platform](https://img.shields.io/badge/Platform-Web-brightgreen)

---

## ✨ Features

### Core Functionality
- 📝 **Dynamic Question Bank** - Auto-calculates total questions from array
- ⏱️ **Countdown Timer** - Visual warnings at 3min and 1min
- ✅ **Single & Multiple Choice** - Radio buttons and checkboxes
- 🎯 **Negative Marking** - Configurable penalty fraction
- 🔀 **Randomized Selection** - Random questions & shuffled options
- 📊 **Detailed Analytics** - Question-wise analysis, grades, statistics

### User Experience
- 🎨 **Glass Morphism UI** - Modern, responsive design
- 📱 **Fully Responsive** - Works on all screen sizes
- ⚡ **Smooth Animations** - CSS transitions and keyframes
- 🔒 **No Back Navigation** - One-way question flow
- ⏭️ **Skip Questions** - Optional answering with warning

### Scoring System
- Automatic score calculation
- Support for negative marking (e.g., -0.25 per wrong answer)
- Skip = 0 marks (no penalty)
- Percentage and letter grade calculation

---

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Library | 18.2.0 |
| **Vite** | Build Tool | 5.0.0 |
| **CSS Variables** | Styling | Native |
| **Fisher-Yates** | Shuffle Algorithm | Custom |

### Dependencies
```json
"react": "^18.2.0",
"react-dom": "^18.2.0"
```

### Dev Dependencies
```json
"@vitejs/plugin-react": "^4.2.0",
"vite": "^5.0.0"
```

---

## 📁 Project Structure

```
quiz-app/
├── index.html                 # Entry HTML file
├── package.json               # Dependencies & scripts
├── vite.config.js             # Vite configuration
├── .env                       # Firebase config (not committed)
├── .env.example               # Environment template
│
└── src/
    ├── main.jsx               # React entry point
    ├── App.jsx                 # Root component & state management
    │
    ├── components/             # UI Components
    │   ├── IntroScreen.jsx    # Welcome screen with exam details
    │   ├── RollNumberScreen.jsx # Student details form
    │   ├── QuizScreen.jsx     # Main quiz interface
    │   ├── QuestionCard.jsx    # Question display & options
    │   ├── Timer.jsx          # Countdown timer
    │   ├── ResultScreen.jsx   # Results & analysis
    │   └── EmptyState.jsx    # "No exam available" screen
    │
    ├── data/
    │   ├── constants.js       # Configuration loader
    │   ├── exam.json          # Active exam (edit this!)
    │   └── fallback.json     # Fallback when no exam
    │
    ├── services/
    │   └── firebaseService.js # Firestore integration
    │
    ├── utils/
    │   ├── scoring.js          # Score calculation
    │   └── shuffle.js          # Question randomization
    │
    └── styles/
        └── global.css         # All styles & CSS variables
```

---

## 🔄 Application Flow

```
┌─────────────────┐
│   IntroScreen   │  ← Welcome screen with exam details
│   (SCREENS.INTRO)
└────────┬────────┘
         │ onStart
         ▼
┌─────────────────┐
│ RollNumberScreen │  ← Collect student info (name, roll no.)
│(SCREENS.ROLL_NUMBER)
└────────┬────────┘
         │ onStartQuiz
         ▼
┌─────────────────┐
│    QuizScreen    │  ← Main quiz with timer & navigation
│    (SCREENS.QUIZ)
│                   │  • Timer counts down
│                   │  • One question at a time
│                   │  • Next/Submit buttons
└────────┬────────┘
         │ onQuizComplete
         ▼
┌─────────────────┐
│  ResultScreen   │  ← Detailed results & analysis
│  (SCREENS.RESULT)
│                   │  • Score, grade, percentage
│                   │  • Question-wise breakdown
│                   │  • Correct/Wrong/Skipped stats
└─────────────────┘
```

---

## 🧩 Component Architecture

### 1. `App.jsx` - Root Component
**State Management:**
```javascript
const [currentScreen, setCurrentScreen] = useState(SCREENS.INTRO);
const [studentInfo, setStudentInfo] = useState(null);
const [quizQuestions, setQuizQuestions] = useState([]);
const [answers, setAnswers] = useState({});
```

**Key Functions:**
- `handleStartQuiz()` - Navigate to roll number screen
- `handleStartWithStudentInfo(info)` - Prepare & start quiz
- `handleQuizComplete(answers)` - Calculate results
- `handleRestart()` - Reset all state

### 2. `IntroScreen.jsx`
Displays:
- School name & exam title
- Question count, time limit, total marks
- Instructions for students
- Start button

### 3. `RollNumberScreen.jsx`
Features:
- Form validation (name, roll number required)
- Numeric roll number check
- Shows random question selection info

### 4. `QuizScreen.jsx`
State:
```javascript
const [currentIndex, setCurrentIndex] = useState(0);
const [answers, setAnswers] = useState({});
const [isTimeUp, setIsTimeUp] = useState(false);
```

Features:
- Real-time answer tracking
- Progress bar
- Question navigator dots
- Timer integration
- Skip question warning

### 5. `QuestionCard.jsx`
Renders:
- Question number & marks
- Question text (supports HTML)
- Optional image
- Radio/Checkbox options
- Multiple-answer hint

### 6. `Timer.jsx`
- Uses `useRef` for stable callback reference
- Visual states: normal → warning (3min) → danger (1min)
- Auto-submits when time reaches 0

### 7. `ResultScreen.jsx`
Displays:
- Total score with grade
- Percentage & performance message
- Stats: Correct, Wrong, Skipped
- Detailed question analysis table

---

## ⚙️ Configuration (constants.js)

### QUIZ_CONFIG
```javascript
export const QUIZ_CONFIG = {
  examTitle: 'Bridge Course - AI & Python',
  className: 7,
  schoolName: 'Sri Kanchi Kamakoti Sankara Vidyalaya',
  
  questionsPerPaper: 20,      // Questions per exam
  
  marksPerQuestion: [
    [1, 20, 1],               // Questions 1-20: 1 mark each
    // [21, 30, 2],            // Add more ranges as needed
  ],
  
  wrongAnswerPenaltyFraction: 0.25,  // 25% negative marking
  
  timeLimitMinutes: 15,       // Exam duration
};
```

### Question Structure
```javascript
{
  id: 1,
  text: "Your question here?",
  image: null,                 // or "https://example.com/image.jpg"
  type: "single",              // or "multiple"
  options: [
    { text: "Option A" },
    { text: "Option B" },
    { text: "Option C" },
    { text: "Option D" },
  ],
  isCorrect: 0,                // Index of correct answer
  explanation: "Why this is correct."
}
```

### Multiple Choice Questions
```javascript
{
  id: 2,
  text: "Which are true? (Select all that apply)",
  type: "multiple",
  isCorrect: [0, 2],           // Array of correct indices
}
```

---

## 🔢 Scoring System

### Formula
```
Score = (Correct × 1) - (Wrong × 0.25)
```

### Example
| Scenario | Calculation | Result |
|----------|-------------|--------|
| 7 correct, 13 wrong | (7×1) - (13×0.25) | 3.75 |
| 10 correct, 10 skipped | (10×1) - 0 | 10.0 |
| 5 correct, 5 wrong | (5×1) - (5×0.25) | 3.75 |

### Grade Thresholds
| Percentage | Grade |
|------------|-------|
| ≥ 90% | A1 |
| ≥ 80% | A2 |
| ≥ 70% | B1 |
| ≥ 60% | B2 |
| ≥ 50% | C1 |
| ≥ 40% | C2 |
| ≥ 33% | D  |
| < 33% | E  |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd quiz-app

# Install dependencies
npm install
```

### Firebase Setup (Required for saving results)

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Firebase credentials
# Get values from: Firebase Console > Project Settings > Your Apps > Web App
```

### Development

```bash
# Start development server
npm run dev

# Server runs at http://localhost:3000
```

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

---

## 🎨 Customization

### 1. Configure Exam
Edit `src/data/exam.json`:
```json
{
  "exam": {
    "title": "Your Exam Title",
    "class": 7,
    "subject": "Subject Name",
    "teacher": "Teacher Name",
    "invigilator": "Invigilator Name",
    "secretKey": "UnlockKey",
    "marksPerQuestion": [[1, 50, 1]],
    "wrongAnswerPenaltyFraction": 0.25,
    "timeLimitMinutes": 15,
    "questionsPerPaper": 20,
    "enabled": true
  },
  "questions": [
    {
      "id": 1,
      "text": "Your question here?",
      "type": "single",
      "options": [{"text": "A"}, {"text": "B"}],
      "isCorrect": 0
    }
  ]
}
```

### 2. Disable Exam
To show "No Exam Available":
- Set `"enabled": false` in exam.json

### 3. Update Styling
Edit CSS variables in `src/styles/global.css`:
```css
:root {
  --primary-color: #667eea;    /* Main accent color */
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --success-color: #10b981;    /* Correct answer color */
  --error-color: #ef4444;      /* Wrong answer color */
  --font-primary: 'Poppins';   /* Main font */
}
```

---

## 🌐 Deployment

### GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

### Netlify / Vercel
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

### Docker
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🔥 Firebase Integration

Results are automatically saved to Firebase Firestore when a quiz is completed.

### Data Stored
| Field | Description |
|-------|-------------|
| `timestamp` | Server timestamp of submission |
| `rollNumber` | Student's roll number |
| `fullName` | Student's full name |
| `class` | Class/Grade |
| `examName` | Examination title |
| `totalMarks` | Total possible marks |
| `percentage` | Score percentage |
| `score` | Actual score earned |
| `grade` | Letter grade |
| `correctCount` | Correct answers |
| `wrongCount` | Wrong answers |
| `skippedCount` | Skipped questions |

### Setup Steps

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database** (test mode for dev)
3. Go to **Project Settings** → **Your apps** → Add Web app
4. Copy your config values

```bash
# Create .env file from example
cp .env.example .env

# Edit .env and paste your Firebase values:
# VITE_FIREBASE_API_KEY=...
# VITE_FIREBASE_AUTH_DOMAIN=...
# VITE_FIREBASE_PROJECT_ID=...
# VITE_FIREBASE_STORAGE_BUCKET=...
# VITE_FIREBASE_MESSAGING_SENDER_ID=...
# VITE_FIREBASE_APP_ID=...

# Run development server
npm run dev
```

### Security Note
- Never commit `.env` file (it's in `.gitignore`)
- Use `.env.example` as a template for others
- API keys are prefixed with `VITE_` to be exposed to client code

---

## 📊 Excel Export Tool

Export quiz results from Firestore to Excel for record-keeping.

### Setup

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save the JSON file as `serviceAccountKey.json`

### Installation & Usage

```bash
# Install dependencies
pip install -r requirements.txt

# Get service account key from Firebase Console
# (Project Settings > Service Accounts > Generate new private key)

# Run the exporter
python fetch_firestore_data.py
```

### Features
- Automatically fetches all quiz results from Firestore
- Exports to formatted Excel file with headers
- Color-coded grades (A1=green, E=red)
- Summary statistics (average, highest, lowest scores)
- Grade distribution breakdown
- Files saved to `exports/` folder

### Output Files
- Timestamped Excel files (e.g., `quiz_results_20250415_143052.xlsx`)
- Styled headers with purple gradient
- Frozen header row
- Centered columns
- Grade highlighting

---

## 🔧 Key Utilities

### `shuffle.js`
| Function | Purpose |
|----------|---------|
| `shuffleArray(array)` | Fisher-Yates shuffle |
| `selectRandomQuestions(questions, count)` | Random selection |
| `prepareQuestions(questions)` | Shuffle options, normalize answers |
| `getQuizQuestions(questions, count)` | Full preparation pipeline |

### `scoring.js`
| Function | Purpose |
|----------|---------|
| `normalizeSelectedAnswer(selected, type)` | Convert to array format |
| `arraysEqual(arr1, arr2)` | Compare arrays (order-independent) |
| `calculateQuestionScore(question, answer, penalty)` | Single question scoring |
| `calculateTotalScore(questions, answers, penalty)` | Full quiz scoring |
| `getGrade(percentage)` | Letter grade |
| `getPerformanceMessage(percentage)` | Encouraging message |

---

## 📋 Important Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `QUIZ_CONFIG` | constants.js | Global exam settings |
| `questions` | constants.js | Question bank array |
| `SCREENS` | App.jsx | Screen navigation enum |
| `currentScreen` | App.jsx | Active screen state |
| `quizQuestions` | App.jsx | Selected & prepared questions |
| `answers` | App.jsx/QuizScreen | Student answers object |
| `currentIndex` | QuizScreen | Current question index |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **React** - For the amazing UI library
- **Vite** - For lightning-fast development
- **Google Fonts** - For Poppins & Nunito typography
- **Wikimedia Commons** - For question images

---

<div align="center">
  <strong>Built with ❤️ using React + Vite</strong>
  <br>
  <sub>Perfect for schools, online courses, and assessments</sub>
</div>
