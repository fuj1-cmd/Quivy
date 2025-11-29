"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { downloadQuizDocument, downloadAnswerKeyDocument } from "@/lib/quizDocGenerator";

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
  const [isDownloadingQuiz, setIsDownloadingQuiz] = useState(false);
  const [isDownloadingKey, setIsDownloadingKey] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quiz/${quizId}`);
        const data = await response.json();

        if (data.success) {
          if (!isCancelled) setQuiz(data.quiz);
        } else {
          if (!isCancelled) setError(data.error || "Failed to load quiz");
        }
      } catch (err) {
        if (!isCancelled) setError("Failed to load quiz");
        console.error(err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchQuiz();

    return () => {
      isCancelled = true;
    };
  }, [quizId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const downloadQuiz = async () => {
    if (!quiz) return;
    setIsDownloadingQuiz(true);
    try {
      await downloadQuizDocument(quiz);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download quiz. Please try again.");
    } finally {
      setIsDownloadingQuiz(false);
    }
  };

  const downloadAnswerKey = async () => {
    if (!quiz) return;
    setIsDownloadingKey(true);
    try {
      await downloadAnswerKeyDocument(quiz);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download answer key. Please try again.");
    } finally {
      setIsDownloadingKey(false);
    }
  };

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-x-hidden">
        <div className="relative mx-auto w-full max-w-5xl px-6 pb-20">
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
      <main className="relative min-h-screen overflow-x-hidden">
        <div className="relative mx-auto w-full max-w-5xl px-6 pb-20">
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
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="relative mx-auto w-full max-w-5xl px-6 pb-20">
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

          {/* Download Buttons */}
          <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-xl p-6">
            <div className="flex flex-wrap gap-3">
              {/* Download Quiz Button */}
              <button
                onClick={downloadQuiz}
                disabled={isDownloadingQuiz}
                className={`relative flex-1 min-w-[200px] rounded-xl px-6 py-3 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDownloadingQuiz
                    ? "bg-white/10 text-white border border-white/10"
                    : "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] active:translate-y-[1px]"
                }`}
              >
                <span className="relative z-10 inline-flex items-center justify-center gap-2">
                  {isDownloadingQuiz && (
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  )}
                  {isDownloadingQuiz ? "Downloading..." : "Download Quiz"}
                </span>
              </button>

              {/* Download Answer Key Button */}
              <button
                onClick={downloadAnswerKey}
                disabled={isDownloadingKey}
                className={`relative flex-1 min-w-[200px] rounded-xl px-6 py-3 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDownloadingKey
                    ? "bg-white/10 text-white border border-white/10"
                    : "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] active:translate-y-[1px]"
                }`}
              >
                <span className="relative z-10 inline-flex items-center justify-center gap-2">
                  {isDownloadingKey && (
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  )}
                  {isDownloadingKey ? "Downloading..." : "Download Answer Key"}
                </span>
              </button>
            </div>
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
