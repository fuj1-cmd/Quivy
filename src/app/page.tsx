import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="mx-auto w-full max-w-5xl px-6 pt-24 pb-32">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-display)] text-white text-6xl font-normal tracking-[0.08em] antialiased">
            Quivy
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70 leading-relaxed">
            Generate grounded, test-like quizzes from your slides and notes. Simple. Precise. Fast.
          </p>

          {/* Clean cards */}
          <div className="mt-20 grid gap-10 sm:grid-cols-2">
            {/* Create Quiz – button */}
            <Link href="/generate" className="block group">
              <div className="rounded-2xl border border-white/12 bg-black/70 p-7 backdrop-blur-sm transition-all hover:bg-black/60 hover:border-white/20">
                <div className="flex items-center justify-between">
                  <div className="max-w-[220px]">
                    <h3 className="text-xl font-semibold text-white/90">Create Quiz</h3>
                    <p className="mt-2 text-sm text-white/65 leading-snug">
                      Upload files. We generate exam-style questions.
                    </p>
                  </div>
                  <div className="ml-auto rounded-full bg-white/90 px-5 py-2 text-sm font-medium text-black transition-all group-hover:bg-white group-hover:scale-105">
                    Start →
                  </div>
                </div>
              </div>
            </Link>

            {/* View Quizzes – button */}
            <Link href="/quizzes" className="block group">
              <div className="rounded-2xl border border-white/12 bg-white/6 p-7 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20">
                <div className="flex items-center justify-between">
                  <div className="max-w-[220px]">
                    <h3 className="text-xl font-semibold text-white/90">View Quizzes</h3>
                    <p className="mt-2 text-sm text-white/65 leading-snug">
                      Retake, group, and track progress. Clean, distraction-free.
                    </p>
                  </div>
                  <div className="ml-auto rounded-full border border-white/40 bg-transparent px-5 py-2 text-sm font-medium text-white/90 transition-all group-hover:border-white group-hover:bg-white/10 group-hover:text-white">
                    View →
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}