import OpenAI from "openai";
import type {
  QuizGenerationRequest,
  QuizQuestion,
  Difficulty,
  QuestionType,
} from "@/types/quiz";

// Initialize OpenAI client
export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set in environment variables. Please add it to your .env.local file."
    );
  }

  return new OpenAI({
    apiKey,
  });
}

// Generate system prompt based on quiz parameters
function generateSystemPrompt(
  difficulty: Difficulty,
  questionType: QuestionType
): string {
  const difficultyDescriptions = {
    easy: "simple and straightforward, suitable for introductory learners",
    medium: "moderately challenging, requiring understanding of key concepts",
    hard: "advanced and complex, testing deep comprehension and analysis",
  };

  const typeDescriptions = {
    mcq: "multiple-choice questions with 4 options each",
    true_false: "true/false questions with 2 options (True and False)",
  };

  return `You are an expert quiz generator. Create ${difficultyDescriptions[difficulty]} ${typeDescriptions[questionType]} based on the provided study material.

CRITICAL INSTRUCTIONS:
1. Generate questions that are directly grounded in the provided text
2. Each question must be clear, unambiguous, and test understanding
3. For multiple-choice: provide exactly 4 options (A, B, C, D)
4. For true/false: provide exactly 2 options (True, False)
5. Indicate the correct answer by its index (0-based)
6. Optionally provide a brief explanation for the correct answer
7. Return ONLY valid JSON with no additional text

JSON FORMAT:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}`;
}

// Generate user prompt with study material
function generateUserPrompt(text: string, numQuestions: number): string {
  return `Generate exactly ${numQuestions} quiz question(s) based on the following study material:

${text}

Remember to return ONLY valid JSON matching the specified format.`;
}

// Main function to generate quiz using OpenAI
export async function generateQuizWithAI(
  request: QuizGenerationRequest
): Promise<QuizQuestion[]> {
  const client = getOpenAIClient();
  const { text, numQuestions, difficulty, questionType } = request;

  // Validate input
  if (!text || text.trim().length === 0) {
    throw new Error("Study material text cannot be empty");
  }

  if (numQuestions < 1 || numQuestions > 50) {
    throw new Error("Number of questions must be between 1 and 50");
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: generateSystemPrompt(difficulty, questionType),
        },
        {
          role: "user",
          content: generateUserPrompt(text, numQuestions),
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("No response received from OpenAI");
    }

    // Parse the JSON response
    const parsedResponse = JSON.parse(responseContent);

    if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
      throw new Error("Invalid response format from OpenAI");
    }

    // Add IDs to questions and validate structure
    const questions: QuizQuestion[] = parsedResponse.questions.map(
      (q: any, index: number) => {
        if (!q.question || !Array.isArray(q.options) || typeof q.correctAnswer !== "number") {
          throw new Error(`Invalid question format at index ${index}`);
        }

        return {
          id: `q-${Date.now()}-${index}`,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        };
      }
    );

    return questions;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
    throw error;
  }
}
