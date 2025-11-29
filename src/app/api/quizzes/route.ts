import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all quizzes with their question count and attempts
    const quizzes = await prisma.quiz.findMany({
      include: {
        _count: {
          select: { questions: true, attempts: true },
        },
        attempts: {
          select: {
            score: true,
            totalScore: true,
            completedAt: true,
          },
          orderBy: {
            completedAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the response with calculated stats
    const formattedQuizzes = quizzes.map((quiz) => {
      // Calculate highest score percentage
      let highestScore: number | null = null;
      let lastAttemptDate: string | null = null;

      if (quiz.attempts.length > 0) {
        // Get the highest score percentage from all attempts
        const scores = quiz.attempts.map((attempt) =>
          Math.round((attempt.score / attempt.totalScore) * 100)
        );
        highestScore = Math.max(...scores);

        // Get the most recent attempt date
        lastAttemptDate = quiz.attempts[0].completedAt.toISOString();
      }

      return {
        id: quiz.id,
        title: quiz.title,
        difficulty: quiz.difficulty,
        questionType: quiz.questionType,
        createdAt: quiz.createdAt.toISOString(),
        lastAttemptDate,
        questionCount: quiz._count.questions,
        attemptCount: quiz._count.attempts,
        highestScore,
      };
    });

    return NextResponse.json(
      {
        success: true,
        quizzes: formattedQuizzes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch quizzes",
      },
      { status: 500 }
    );
  }
}
