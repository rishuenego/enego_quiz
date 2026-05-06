# Bulk Insert Exam Script

This script allows you to bulk insert an exam with 30 questions into your quiz application database.

## Prerequisites

1. **Database Connection**: The script currently uses a hardcoded MongoDB connection string (same as your existing bulkInsert.js). If you want to use environment variables instead:
   - Create a `.env` file in the server directory with:
     ```
     MONGO_URL=mongodb+srv://your-connection-string
     ```
   - Update the script to use `require("dotenv").config()` and `process.env.MONGO_URL`

2. Ensure your MongoDB database is running and accessible.

3. Install dependencies: `npm install`

## Running the Script

### Option 1: Using npm script (Recommended)
```bash
npm run bulk-insert-exam
```

### Option 2: Direct node execution
```bash
cd server
node bulkInsertExam.js
```

## What the Script Does

1. **Creates an Exam**: Inserts a new exam with the following configuration:
   - Name: "General Knowledge Quiz 2024"
   - Duration: 60 minutes
   - Category: "General Knowledge"
   - Total Marks: 30
   - Passing Marks: 15

2. **Creates 30 Questions**: Adds 30 multiple-choice questions with 4 options each (A, B, C, D).

3. **Links Questions to Exam**: Associates all questions with the created exam.

## Customization

To modify the exam or questions, edit the `server/bulkInsertExam.js` file:

### Change Exam Details
Modify the `examData` object at the top of the file:

```javascript
const examData = {
  name: "Your Custom Exam Name",
  duration: 45, // minutes
  category: "Your Category",
  totalMarks: 30,
  passingMarks: 15,
};
```

### Change Questions
Modify the `questionsData` array. Each question object should have:
- `name`: The question text
- `correctOption`: The correct answer text
- `options`: An object with A, B, C, D options

Example:
```javascript
{
  name: "What is the capital of Spain?",
  correctOption: "Madrid",
  options: {
    A: "Barcelona",
    B: "Madrid",
    C: "Seville",
    D: "Valencia"
  }
}
```

## Safety Features

- The script checks if an exam with the same name already exists and skips creation if it does.
- Comprehensive error handling with detailed logging.
- The script exits cleanly after completion.

## Important Notes

- **Duplicate Prevention**: If you run the script multiple times with the same exam name, it will skip creating a duplicate exam.
- **Database Connection**: Currently uses the same MongoDB connection as your existing `bulkInsert.js` script.
- **Data Integrity**: All questions are properly linked to the exam through MongoDB references.

## Output

When successful, you'll see output like:
```
MongoDB Connection Successful
Starting bulk insert process...
Creating exam...
Exam "General Knowledge Quiz 2024" created successfully with ID: [exam-id]
Creating questions...
Question 1/30 created: "What is the capital of France?"
...
Question 30/30 created: "[Last question]"
Updating exam with questions...

✅ Bulk insert completed successfully!
📚 Exam: General Knowledge Quiz 2024
❓ Questions added: 30
⏱️  Duration: 60 minutes
🎯 Total Marks: 30
📈 Passing Marks: 15
```

## Troubleshooting

1. **Connection Issues**: Verify your `MONGO_URL` in the `.env` file.
2. **Duplicate Exam**: If you want to create multiple exams, change the exam name in the script.
3. **Permission Issues**: Ensure your database user has write permissions.

## Notes

- This script is designed for one-time use or bulk data insertion.
- All questions are created with equal weight (1 mark each by default).
- The exam will be immediately available in your quiz application.