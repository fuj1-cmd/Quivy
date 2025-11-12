import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-display)] text-white text-6xl font-normal tracking-[0.08em] antialiased">
            Quivy
          </h1>
          <p className="mx-auto mt-2.5 max-w-2xl text-white/70">
            Generate grounded, test-like quizzes from your slides and notes. Simple. Precise. Fast.
          </p>

          {/* single set of CTAs */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link
              href="/generate"
              className="rounded-xl border border-white/12 bg-black/70 text-white px-6 py-3 text-sm font-medium hover:bg-black/60 hover:border-white/20 transition"
            >
              Create Quiz
            </Link>
            <Link
              href="/quizzes"
              className="rounded-xl border border-white/12 bg-white/6 text-white/85 px-6 py-3 text-sm font-medium hover:bg-white/10 hover:text-white transition"
            >
              View Quizzes
            </Link>
          </div>
        </div>

        {/* info sections (monotone, minimal) */}
        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          <section>
            <div className="border-t border-white/10 pt-5">
              <h3 className="text-white font-semibold">Create Quiz</h3>
              <p className="mt-1.5 text-sm text-white/65">
                Upload a deck or notes. We synthesize and generate exam-style items.
              </p>
            </div>
          </section>

          <section>
            <div className="border-t border-white/10 pt-5">
              <h3 className="text-white font-semibold">View Quizzes</h3>
              <p className="mt-1.5 text-sm text-white/65">
                Retake, group, and track progress. Clean, distraction-free.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}