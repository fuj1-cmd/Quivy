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
  return `IMPORTANT: You MUST generate EXACTLY ${numQuestions} question(s). No more, no less.

Based on the following study material, create exactly ${numQuestions} quiz question(s):

${text}

CRITICAL: The JSON response must contain EXACTLY ${numQuestions} question(s) in the questions array.
Return ONLY valid JSON matching the specified format.`;
}

// Generate a concise quiz title from the content
export async function generateQuizTitle(text: string): Promise<string> {
  const client = getOpenAIClient();

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates simple, clear quiz titles. Extract the main topic and format it as '[Topic] Quiz'. Examples: 'American Government Quiz', 'Photosynthesis Quiz', 'World War II Quiz'. Keep it under 50 characters. Return ONLY the title, nothing else."
        },
        {
          role: "user",
          content: `Create a simple quiz title for this content:\n\n${text.slice(0, 500)}`
        }
      ],
      temperature: 0.3,
      max_tokens: 20,
    });

    const title = completion.choices[0]?.message?.content?.trim();

    if (!title) {
      // Fallback to text-based title
      return text.trim().slice(0, 40) + " Quiz";
    }

    // Ensure it ends with "Quiz" if it doesn't already
    const cleanTitle = title.slice(0, 50);
    return cleanTitle.endsWith("Quiz") ? cleanTitle : cleanTitle + " Quiz";
  } catch {
    // Fallback to text-based title on error
    return text.trim().slice(0, 40) + " Quiz";
  }
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

  if (numQuestions < 1 || numQuestions > 100) {
    throw new Error("Number of questions must be between 1 and 100");
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
    const parsedResponse = JSON.parse(responseContent) as unknown;
    if (
      !parsedResponse ||
      typeof parsedResponse !== "object" ||
      !("questions" in parsedResponse) ||
      !Array.isArray((parsedResponse as { questions: unknown }).questions)
    ) {
      throw new Error("Invalid response format from OpenAI");
    }

    type RawQuestion = {
      question: unknown;
      options: unknown;
      correctAnswer: unknown;
      explanation?: unknown;
    };

    const rawQuestions = (parsedResponse as { questions: RawQuestion[] }).questions;

    // Add IDs to questions and validate structure
    const questions: QuizQuestion[] = rawQuestions.map((q, index: number) => {
      if (
        !q ||
        typeof q.question !== "string" ||
        !Array.isArray(q.options) ||
        typeof q.correctAnswer !== "number"
      ) {
          throw new Error(`Invalid question format at index ${index}`);
        }

        return {
          id: `q-${Date.now()}-${index}`,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: typeof q.explanation === "string" ? q.explanation : undefined,
        };
    });

    return questions;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
    throw error;
  }
}
