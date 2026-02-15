# Bulk Question Import Guide

This guide explains how to add large numbers of questions to the database using the bulk import script.

## 1. Prepare Your Data
Open the file `bulk_data.json` in the root of your project. Matches the following format:

```json
{
    "testTitle": "My New Question Bank",  // Title of the test to create or update
    "subject": "General Knowledge",       // Subject (e.g., Math, Reasoning, etc.)
    "timeLimit": 30,                      // Time in minutes
    "negativeMarking": 0.25,              // Negative marking per wrong answer
    "questions": [
        {
            "question": "Which planet is known as the Red Planet?",
            "options": ["Earth", "Mars", "Jupiter", "Venus"],
            "correct": 1, 
            "explanation": "Mars is reddish due to iron oxide on its surface."
        }
        // Add more questions here...
    ]
}
```

**Note:** `correct` is the index of the correct option (0 = A, 1 = B, 2 = C, 3 = D).

## 2. Run the Script
Open your terminal and run the following command:

```bash
npx tsx src/scripts/bulk-import.ts
```

## 3. Verify
- The script will tell you if it successfully inserted the questions.
- Go to your specific link /admin/login to see the new test and questions.
