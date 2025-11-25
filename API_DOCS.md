# Quivy API Documentation

## Setup

### Environment Variables

Add the following to your `.env.local` file:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys).

---

## POST `/api/generate-quiz`

Generate a quiz from study material using GPT-4.1-mini.

### Request Body

```typescript
{
  text: string;           // Study material (required)
  numQuestions: number;   // Number of questions 1-50 (required)
  difficulty: "easy" | "medium" | "hard";  // (required)
  questionType: "mcq" | "true_false";      // (required)
}
```

### Example Request

```bash
curl -X POST http://localhost:3000/api/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Photosynthesis is the process by which plants convert light energy into chemical energy. It occurs in chloroplasts and requires sunlight, water, and carbon dioxide.",
    "numQuestions": 3,
    "difficulty": "medium",
    "questionType": "mcq"
  }'
```

### Success Response (200)

```json
{
  "success": true,
  "quiz": {
    "questions": [
      {
        "id": "q-1234567890-0",
        "question": "Where does photosynthesis occur in plants?",
        "options": [
          "Chloroplasts",
          "Mitochondria",
          "Nucleus",
          "Cell wall"
        ],
        "correctAnswer": 0,
        "explanation": "Photosynthesis occurs in chloroplasts, which contain chlorophyll."
      }
    ],
    "metadata": {
      "difficulty": "medium",
      "questionType": "mcq",
      "totalQuestions": 3,
      "generatedAt": "2025-01-24T12:00:00.000Z"
    }
  }
}
```

### Error Responses

#### 400 Bad Request - Invalid Input

```json
{
  "success": false,
  "error": "Invalid or missing 'text' field. Must be a non-empty string."
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "error": "OpenAI API Error: Rate limit exceeded"
}
```

#### 405 Method Not Allowed

```json
{
  "success": false,
  "error": "Method not allowed. Use POST to generate a quiz."
}
```

---

## TypeScript Types

```typescript
// Available in src/types/quiz.ts

export type QuestionType = "mcq" | "true_false";
export type Difficulty = "easy" | "medium" | "hard";

export interface QuizGenerationRequest {
  text: string;
  numQuestions: number;
  difficulty: Difficulty;
  questionType: QuestionType;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-based)
  explanation?: string;
}

export interface QuizGenerationResponse {
  success: boolean;
  quiz?: {
    questions: QuizQuestion[];
    metadata: {
      difficulty: Difficulty;
      questionType: QuestionType;
      totalQuestions: number;
      generatedAt: string;
    };
  };
  error?: string;
}
```

---

## Usage Example (Frontend)

```typescript
async function generateQuiz(studyMaterial: string) {
  try {
    const response = await fetch("/api/generate-quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: studyMaterial,
        numQuestions: 10,
        difficulty: "medium",
        questionType: "mcq",
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log("Quiz generated:", data.quiz);
      return data.quiz;
    } else {
      console.error("Error:", data.error);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error("Failed to generate quiz:", error);
    throw error;
  }
}
```

---

## Notes

- **Model**: Uses OpenAI's `gpt-4.1-mini` model
- **Rate Limits**: Subject to your OpenAI API tier limits
- **Max Questions**: Limited to 50 questions per request
- **Response Format**: JSON-only responses
- **Security**: API key is kept server-side only (never exposed to client)

---

## Error Handling

The API includes comprehensive error handling for:

- Missing or invalid parameters
- Empty study material
- OpenAI API errors (rate limits, invalid API key, etc.)
- JSON parsing errors
- Unexpected server errors

All errors return a consistent format:

```json
{
  "success": false,
  "error": "Error message here"
}
```
