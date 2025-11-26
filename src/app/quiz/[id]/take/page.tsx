"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  questions: QuizQuestion[];
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

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

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answerIndex,
    });
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!quiz) return { correct: 0, total: 0, percentage: 0 };

    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });

    return {
      correct,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100),
    };
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

  if (showResults) {
    const score = calculateScore();
    return (
      <main className="relative min-h-screen pt-4 overflow-x-hidden">
        <div className="relative mx-auto w-full max-w-5xl px-6 pb-10">
          <div className="space-y-4">
            <div className="text-center space-y-1.5">
              <h1 className="font-[family-name:var(--font-display)] text-white text-4xl sm:text-5xl font-bold tracking-[0.08em] antialiased bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent leading-none">
                Quiz Results
              </h1>
              <p className="text-white/60 text-sm">{quiz.title}</p>
            </div>

            <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-xl p-6">
              <div className="text-center space-y-4 mb-6">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-white/20 bg-white/5">
                  <span className="text-5xl font-bold text-white">{score.percentage}%</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-semibold text-white">
                    {score.correct} out of {score.total} correct
                  </p>
                  <p className="text-white/60">
                    {score.percentage >= 80
                      ? "Excellent work!"
                      : score.percentage >= 60
                      ? "Good job!"
                      : "Keep practicing!"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {quiz.questions.map((question, index) => {
                  const userAnswer = selectedAnswers[index];
                  const isCorrect = userAnswer === question.correctAnswer;

                  return (
                    <div
                      key={question.id}
                      className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                            isCorrect
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {isCorrect ? "✓" : "×"}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white mb-2">
                            {index + 1}. {question.question}
                          </p>
                          <div className="space-y-2">
                            {question.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`rounded-lg px-3 py-2 text-sm ${
                                  optIndex === question.correctAnswer
                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                    : optIndex === userAnswer && !isCorrect
                                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                    : "bg-white/5 text-white/50"
                                }`}
                              >
                                {option}
                                {optIndex === question.correctAnswer && " ✓"}
                                {optIndex === userAnswer && !isCorrect && " (Your answer)"}
                              </div>
                            ))}
                          </div>
                          {question.explanation && (
                            <p className="text-xs text-white/50 italic mt-2">
                              {question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setSelectedAnswers({});
                    setShowResults(false);
                  }}
                >
                  Retake Quiz
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  fullWidth
                  onClick={() => router.push("/quizzes")}
                >
                  Back to Quizzes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <main className="relative min-h-screen pt-4 overflow-x-hidden">
      <div className="relative mx-auto w-full max-w-5xl px-6 pb-10">
        <div className="space-y-4">
          <div className="text-center space-y-1.5">
            <h1 className="font-[family-name:var(--font-display)] text-white text-4xl sm:text-5xl font-bold tracking-[0.08em] antialiased bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent leading-none">
              {quiz.title}
            </h1>
            <p className="text-white/60 text-sm">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-xl overflow-hidden">
            <div className="h-2 bg-white/5">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <p className="text-xl font-medium text-white">{currentQuestion.question}</p>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full text-left rounded-xl px-4 py-3 text-base transition-all ${
                        selectedAnswers[currentQuestionIndex] === index
                          ? "bg-white/15 text-white border-2 border-white/30"
                          : "bg-white/5 text-white/70 border-2 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="flex-1"
                >
                  Previous
                </Button>

                {currentQuestionIndex === quiz.questions.length - 1 ? (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={Object.keys(selectedAnswers).length !== quiz.questions.length}
                    className="flex-1"
                  >
                    Submit Quiz
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleNext}
                    disabled={selectedAnswers[currentQuestionIndex] === undefined}
                    className="flex-1"
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
