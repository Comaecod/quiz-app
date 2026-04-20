# How to Add New Exams

## Quick Summary

1. **Create JSON** in `src/data/Exams/{ExamType}/Class {N}/`
2. **Run migration** (`?migrate=true`)
3. **Delete local file** (optional)
4. **Done!** - Exam available instantly

---

## Step 1: Create JSON File

Create a file in this location:
```
src/data/Exams/{ExamType}/Class {N}/{Subject}.json
```

**Examples:**
- `src/data/Exams/Bridge Course/Class 6/Computers.json`
- `src/data/Exams/Slip Test/Class 10/Mathematics.json`
- `src/data/Exams/Unit Test 1/Class 8/Science.json`

---

## Step 2: JSON Format

Copy this template and fill in:

```json
{
  "examType": "Bridge Course",
  "classNum": "6",
  "className": 6,
  "title": "Exam Title Here",
  "subject": "Subject Name",
  "teacher": "Teacher Name",
  "invigilator": "Teacher Name",
  "preassessmentsecretkey": "PreKey",
  "secretKey": "AnswerKey",
  "teacherSecretKey": "TeacherKey",
  "wrongAnswerPenaltyFraction": 0.25,
  "timeLimitMinutes": 20,
  "enabled": true,
  "sections": [
    {
      "range": [1, 20],
      "marks": 1,
      "count": 20
    }
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
      "isCorrect": 0,
      "explanation": "Optional explanation"
    }
  ],
  "totalQuestions": 20,
  "totalMarks": 20
}
```

**Field Meanings:**
| Field | Description |
|-------|-------------|
| examType | Bridge Course, Slip Test, Unit Test 1, Term 1, etc |
| classNum | Class number (as string, e.g., "6") |
| className | Class number (as number, e.g., 6) |
| title | Exam title shown to students |
| subject | Subject name |
| teacher | Teacher name |
| preassessmentsecretkey | Key to start pre-assessment |
| secretKey | Key to reveal answers after exam |
| teacherSecretKey | Key to view reports |
| wrongAnswerPenaltyFraction | Negative marking (0 for no penalty) |
| timeLimitMinutes | Time limit in minutes |
| isCorrect | Index of correct answer (0=A, 1=B, etc) |

---

## Step 3: Upload via Migration

1. **Go to:** `/?migrate=true`
2. **Click:** "NEW: Lazy Migration (recommended)"
3. Wait for confirmation

The migration automatically:
- Creates entry in `examTypes` collection
- Creates entry in `examIndex` collection  
- Creates entry in `examConfigs` collection (with questions)

---

## Step 4: Test & Release

1. Test the exam works
2. Delete the local JSON file:

```bash
# Delete specific file
rm src/data/Exams/Bridge Course/Class 6/Computers.json

# Or delete entire folder
rm -rf src/data/Exams/Bridge Course/
```

3. Commit changes:
```bash
git add .
git commit -m "Removed local JSONs - now using Firestore"
```

---

## Exam Type Folder Names

Create folders with these names:
- `Bridge Course`
- `Slip Test`
- `Unit Test 1`
- `Term 1`
- `Unit Test 2`
- `Term 2`
- `Learning`

---

## Tips

- **Negative marking**: Set `wrongAnswerPenaltyFraction` to `0.25` for 0.25 mark deduction per wrong answer
- **Questions**: Use `isCorrect` as index (0=A, 1=B, 2=C, 3=D)
- **Explanation**: Add optional `explanation` field to any question
- **Images**: Set `image` to image URL or `null`

---

## After Upload

The exam is immediately available - no app rebuild needed!

Users will see it on the home screen after selecting the exam type and class.