import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { createdAt: "asc" },
        },
        attempts: {
          orderBy: { completedAt: "desc" },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { success: false, error: "Quiz not found" },
        { status: 404 }
      );
    }

    // Calculate highest score
    const highestScore = quiz.attempts.length > 0
      ? Math.max(...quiz.attempts.map(a => Math.round((a.score / a.totalScore) * 100)))
      : null;

    const attemptCount = quiz.attempts.length;

    return NextResponse.json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        difficulty: quiz.difficulty,
        questionType: quiz.questionType,
        createdAt: quiz.createdAt,
        highestScore,
        attemptCount,
        questions: quiz.questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}
