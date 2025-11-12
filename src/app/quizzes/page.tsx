import Link from "next/link";

export default function QuizzesPage() {
  const quizzes: any[] = []; // replace with real data later

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
              <div className="flex items-center justify-between">
                <p className="text-neutral-400">No quizzes yet.</p>
                <Link
                  href="/generate"
                  className="rounded-xl border border-white/10 bg-white/5 text-neutral-200 px-5 py-2.5 text-sm hover:bg-white/10 transition"
                >
                  Generate Your First Quiz
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-white/10">
                {quizzes.map((q) => (
                  <li key={q.id} className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium text-white">{q.title}</div>
                      <div className="text-xs text-neutral-500">Created {q.createdAt}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition">Open</button>
                      <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition">Rename</button>
                      <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition">Delete</button>
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