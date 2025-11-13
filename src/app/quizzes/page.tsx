"use client";
import Link from "next/link";
import { useState } from "react";

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
    <main className="min-h-screen pt-28">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-lg">
          <div className="px-6 pt-6">
            <h3 className="text-lg font-semibold text-white">Your Quizzes</h3>
            <p className="mt-1 text-sm text-neutral-400">Retake, group, rename, or delete.</p>
          </div>

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
                <Link
                  href="/generate"
                  className="rounded-xl border border-white/10 bg-neutral-900 text-white px-6 py-2.5 text-sm font-medium hover:bg-neutral-800 transition"
                >
                  Generate Your First Quiz
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
                        <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition">
                          Open
                        </button>
                        <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/10 transition">
                          Rename
                        </button>
                        <button className="rounded-lg border border-red-500/30 bg-red-900/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 transition">
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}