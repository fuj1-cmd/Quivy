"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

interface Quiz {
  id: string;
  title: string;
  difficulty: string;
  questionType: string;
  createdAt: string;
  lastAttemptDate: string | null;
  questionCount: number;
  attemptCount: number;
  highestScore: number | null;
}

type SortOption = "recent-attempt" | "recent-created" | "alphabetical" | "highest-score" | "most-attempts";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("recent-created");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/quizzes");
      const data = await response.json();

      if (data.success) {
        setQuizzes(data.quizzes);
      } else {
        setError(data.error || "Failed to load quizzes");
      }
    } catch (err) {
      setError("Failed to load quizzes");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteQuizId) return;

    try {
      const response = await fetch(`/api/quiz/${deleteQuizId}/delete`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        // Remove the quiz from the list
        setQuizzes(quizzes.filter(q => q.id !== deleteQuizId));
      } else {
        setError(data.error || "Failed to delete quiz");
      }
    } catch (err) {
      setError("Failed to delete quiz");
      console.error(err);
    } finally {
      setDeleteQuizId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Sort quizzes based on selected option
  const sortedQuizzes = [...quizzes].sort((a, b) => {
    switch (sortBy) {
      case "recent-attempt":
        // Sort by most recent attempt, fallback to created date if no attempts
        if (!a.lastAttemptDate && !b.lastAttemptDate) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (!a.lastAttemptDate) return 1;
        if (!b.lastAttemptDate) return -1;
        return new Date(b.lastAttemptDate).getTime() - new Date(a.lastAttemptDate).getTime();

      case "recent-created":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

      case "alphabetical":
        return a.title.localeCompare(b.title);

      case "highest-score":
        // Sort by highest score descending, nulls last
        if (a.highestScore === null && b.highestScore === null) return 0;
        if (a.highestScore === null) return 1;
        if (b.highestScore === null) return -1;
        return b.highestScore - a.highestScore;

      case "most-attempts":
        return b.attemptCount - a.attemptCount;

      default:
        return 0;
    }
  });

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="relative mx-auto w-full max-w-5xl px-6 pb-20">
        <div className="space-y-4">
          {/* Header Section */}
          <div className="text-center space-y-1.5">
            <h1 className="font-[family-name:var(--font-display)] text-white text-4xl sm:text-5xl font-bold tracking-[0.08em] antialiased bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent leading-none">
              Your Quizzes
            </h1>
            <p className="text-white/60 text-sm">
              View, take, or manage your generated quizzes
            </p>
          </div>

          {/* Sort Dropdown */}
          {!isLoading && !error && quizzes.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-3.5 py-2">
                <span className="text-white/60 text-xs font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-white text-xs font-semibold cursor-pointer focus:outline-none appearance-none pr-2"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23ffffff' stroke-opacity='0.6' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right center',
                    paddingRight: '1.25rem',
                  }}
                >
                  <option value="recent-created">Recently Created</option>
                  <option value="recent-attempt">Recently Taken</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="highest-score">Highest Score</option>
                  <option value="most-attempts">Most Attempts</option>
                </select>
              </div>
              <div className="text-white/40 text-xs">
                {quizzes.length} {quizzes.length === 1 ? 'quiz' : 'quizzes'}
              </div>
            </div>
          )}

          {/* Content Card */}
          <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-xl">
            <div className="p-6">
              {isLoading ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-white/60"></div>
                  <p className="text-white/60 text-sm">Loading quizzes...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <p className="text-red-400 mb-4">{error}</p>
                  <Button variant="primary" size="md" onClick={fetchQuizzes}>
                    Try Again
                  </Button>
                </div>
              ) : quizzes.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <div className="mb-4 h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-white/30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-white/60 mb-4 text-base">No quizzes yet</p>
                  <p className="text-white/40 mb-6 text-sm">Create your first quiz to get started</p>
                  <Link href="/generate">
                    <Button variant="primary" size="md">
                      Generate Your First Quiz
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedQuizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1.5">
                            <h3 className="font-medium text-white text-base">
                              {quiz.title}
                            </h3>
                            {quiz.highestScore !== null && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {quiz.highestScore}%
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-white/50">
                            <span>{formatDate(quiz.createdAt)}</span>
                            {quiz.lastAttemptDate && (
                              <>
                                <span className="text-white/30">•</span>
                                <span>Last: {formatDate(quiz.lastAttemptDate)}</span>
                              </>
                            )}
                            <span className="text-white/30">•</span>
                            <span>{quiz.questionCount} questions</span>
                            <span className="text-white/30">•</span>
                            <span className="capitalize">{quiz.difficulty}</span>
                            <span className="text-white/30">•</span>
                            <span>{quiz.questionType === "mcq" ? "Multiple Choice" : "True/False"}</span>
                            {quiz.attemptCount > 0 && (
                              <>
                                <span className="text-white/30">•</span>
                                <span>{quiz.attemptCount} attempt{quiz.attemptCount !== 1 ? "s" : ""}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/quiz/${quiz.id}`}>
                            <Button variant="primary" size="sm">
                              View Quiz
                            </Button>
                          </Link>
                          <button
                            onClick={() => setDeleteQuizId(quiz.id)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 px-3 py-1.5 text-sm font-medium transition-all hover:bg-red-500 hover:text-white hover:border-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteQuizId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4 rounded-2xl border border-white/15 bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Delete Quiz?</h3>
            <p className="text-white/70 text-sm mb-6">
              Are you sure you want to delete this quiz? This action cannot be undone and will permanently remove all questions and attempts.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteQuizId(null)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 text-white px-4 py-2.5 text-sm font-semibold transition-all hover:bg-white/15 hover:border-white/30"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-red-500 bg-red-500 text-white px-4 py-2.5 text-sm font-semibold transition-all hover:bg-red-600 hover:border-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}