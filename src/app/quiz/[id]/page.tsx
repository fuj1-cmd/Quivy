"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  difficulty: string;
  questionType: string;
  createdAt: string;
  highestScore: number | null;
  attemptCount: number;
  questions: QuizQuestion[];
}

export default function QuizOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quiz/${quizId}`);
      const data = await response.json();

      if (data.success) {
        setQuiz(data.quiz);
      } else {
        setError(data.error || "Failed to load quiz");
      }
    } catch (err) {
      setError("Failed to load quiz");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <main className="relative min-h-screen pt-4 overflow-x-hidden">
        <div className="relative mx-auto w-full max-w-5xl px-6 pb-10">
          <div className="flex flex-col items-center py-12 text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-white/60"></div>
            <p className="text-white/60 text-sm">Loading quiz...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !quiz) {
    return (
      <main className="relative min-h-screen pt-4 overflow-x-hidden">
        <div className="relative mx-auto w-full max-w-5xl px-6 pb-10">
          <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-xl p-6">
            <div className="flex flex-col items-center py-12 text-center">
              <p className="text-red-400 mb-4">{error || "Quiz not found"}</p>
              <Button variant="primary" size="md" onClick={() => router.push("/quizzes")}>
                Back to Quizzes
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen pt-4 overflow-x-hidden">
      <div className="relative mx-auto w-full max-w-5xl px-6 pb-10">
        <div className="space-y-4">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <h1 className="font-[family-name:var(--font-display)] text-white text-4xl sm:text-5xl font-bold tracking-[0.08em] antialiased bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent leading-none">
              {quiz.title}
            </h1>
            <p className="text-white/60 text-sm">Created {formatDate(quiz.createdAt)}</p>
          </div>

          {/* Quiz Stats Card */}
          <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              {/* Questions */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-3xl font-bold text-white mb-1">{quiz.questions.length}</p>
                <p className="text-xs text-white/60">Questions</p>
              </div>

              {/* Difficulty */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-3xl font-bold text-white mb-1 capitalize">{quiz.difficulty}</p>
                <p className="text-xs text-white/60">Difficulty</p>
              </div>

              {/* Attempts */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-3xl font-bold text-white mb-1">{quiz.attemptCount}</p>
                <p className="text-xs text-white/60">Attempts</p>
              </div>

              {/* Highest Score */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-3xl font-bold text-white mb-1">
                  {quiz.highestScore !== null ? `${quiz.highestScore}%` : "—"}
                </p>
                <p className="text-xs text-white/60">Highest Score</p>
              </div>
            </div>

            {/* Take Quiz Button */}
            <Link href={`/quiz/${quiz.id}/take`}>
              <Button variant="primary" size="lg" fullWidth>
                {quiz.attemptCount > 0 ? "Retake Quiz" : "Start Quiz"}
              </Button>
            </Link>
          </div>

          {/* Answer Key */}
          <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Answer Key</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/60">
                  {quiz.questionType === "mcq" ? "Multiple Choice" : "True/False"}
                </span>
                <Button
                  variant={showAnswerKey ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setShowAnswerKey(!showAnswerKey)}
                >
                  {showAnswerKey ? "Hide Answers" : "Show Answers"}
                </Button>
              </div>
            </div>

            {showAnswerKey && (
              <div className="space-y-4">
                {quiz.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3"
                  >
                    <p className="text-sm font-medium text-white">
                      {index + 1}. {question.question}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`rounded-lg px-3 py-2 text-sm ${
                            optIndex === question.correctAnswer
                              ? "bg-green-500/10 text-green-400 border border-green-500/20 font-medium"
                              : "bg-white/5 text-white/50"
                          }`}
                        >
                          {option}
                          {optIndex === question.correctAnswer && " ✓"}
                        </div>
                      ))}
                    </div>
                    {question.explanation && (
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-xs text-white/70">
                          <span className="font-semibold">Explanation: </span>
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Back Button */}
          <div className="flex justify-center">
            <Button variant="ghost" size="md" onClick={() => router.push("/quizzes")}>
              ← Back to All Quizzes
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
