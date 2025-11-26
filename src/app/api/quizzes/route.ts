import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all quizzes with their question count
    const quizzes = await prisma.quiz.findMany({
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the response
    const formattedQuizzes = quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      difficulty: quiz.difficulty,
      questionType: quiz.questionType,
      createdAt: quiz.createdAt.toISOString(),
      questionCount: quiz._count.questions,
    }));

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
