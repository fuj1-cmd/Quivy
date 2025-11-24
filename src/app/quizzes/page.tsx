"use client";
import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";

// Mock quiz data
const mockQuizzes = [
  {
    id: "1",
    title: "Pharmacology Final Review",
    createdAt: "Nov 12, 2025",
    questionCount: 25,
    style: "Exam-style",
  },
  {
    id: "2",
    title: "Dosage Calculations Practice",
    createdAt: "Nov 10, 2025",
    questionCount: 10,
    style: "Dosage Calc",
  },
  {
    id: "3",
    title: "Cardiac Meds Flashcards",
    createdAt: "Nov 8, 2025",
    questionCount: 15,
    style: "Recall",
  },
];

export default function QuizzesPage() {
  const [quizzes] = useState(mockQuizzes);

  return (
    <main className="relative min-h-screen pt-12 overflow-x-hidden">
      <div className="relative mx-auto w-full max-w-5xl px-6 pb-24">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-3">
            <h1 className="font-[family-name:var(--font-display)] text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.08em] antialiased bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent leading-none">
              Your Quizzes
            </h1>
            <p className="text-white/60 text-sm">
              Retake, group, rename, or delete.
            </p>
          </div>

          {/* Content Card */}
          <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-xl">
            <div className="p-6">
            {quizzes.length === 0 ? (
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
                <p className="text-neutral-400 mb-4">No quizzes yet.</p>
                <Link href="/generate">
                  <Button variant="primary" size="md">
                    Generate Your First Quiz
                  </Button>
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-white/10">
                {quizzes.map((q) => (
                  <li key={q.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">{q.title}</div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                          <span>Created {q.createdAt}</span>
                          <span className="text-white/40">•</span>
                          <span>{q.questionCount} questions</span>
                          <span className="text-white/40">•</span>
                          <span>{q.style}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm">
                          Open
                        </Button>
                        <Button variant="ghost" size="sm">
                          Rename
                        </Button>
                        <Button variant="danger" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}