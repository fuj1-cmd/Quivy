import { NextRequest, NextResponse } from "next/server";
import { generateQuizWithAI } from "@/lib/openai";
import type {
  QuizGenerationRequest,
  QuizGenerationResponse,
} from "@/types/quiz";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate required fields
    const { text, numQuestions, difficulty, questionType } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or missing 'text' field. Must be a non-empty string.",
        } as QuizGenerationResponse,
        { status: 400 }
      );
    }

    if (!numQuestions || typeof numQuestions !== "number") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or missing 'numQuestions' field. Must be a number.",
        } as QuizGenerationResponse,
        { status: 400 }
      );
    }

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid or missing 'difficulty' field. Must be 'easy', 'medium', or 'hard'.",
        } as QuizGenerationResponse,
        { status: 400 }
      );
    }

    if (!["mcq", "true_false"].includes(questionType)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid or missing 'questionType' field. Must be 'mcq' or 'true_false'.",
        } as QuizGenerationResponse,
        { status: 400 }
      );
    }

    // Create quiz generation request
    const quizRequest: QuizGenerationRequest = {
      text: text.trim(),
      numQuestions,
      difficulty,
      questionType,
    };

    // Generate quiz using OpenAI
    const questions = await generateQuizWithAI(quizRequest);

    // Return successful response
    const response: QuizGenerationResponse = {
      success: true,
      quiz: {
        questions,
        metadata: {
          difficulty,
          questionType,
          totalQuestions: questions.length,
          generatedAt: new Date().toISOString(),
        },
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error generating quiz:", error);

    // Handle specific error types
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        } as QuizGenerationResponse,
        { status: 500 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while generating the quiz.",
      } as QuizGenerationResponse,
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed. Use POST to generate a quiz.",
    } as QuizGenerationResponse,
    { status: 405 }
  );
}
