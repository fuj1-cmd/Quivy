import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen pt-12 overflow-x-hidden">
      {/* Centered content wrapper */}
      <div className="relative mx-auto w-full px-6 pb-24">
        <div className="text-center space-y-8">
          {/* Hero section */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
            <h1 className="font-[family-name:var(--font-display)] text-white text-[1.75rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[4.25rem] xl:text-[5rem] font-bold tracking-[0.08em] antialiased bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent leading-none whitespace-nowrap">
              Quivy
            </h1>
            <div className="space-y-2">
              <p className="mx-auto max-w-2xl text-lg text-white/85 leading-relaxed font-light">
                Turn your study materials into exam-ready quizzes instantly.
              </p>
              <p className="mx-auto max-w-xl text-sm text-white/50 leading-relaxed">
                Powered by AI. Built for students.
              </p>
            </div>
          </div>

          {/* Cards with staggered animation */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 max-w-5xl mx-auto">
            {/* Create Quiz – primary card */}
            <Link
              href="/generate"
              className="block group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150"
            >
              <div className="relative rounded-3xl border border-white/15 bg-gradient-to-br from-black/70 to-black/50 p-6 backdrop-blur-xl transition-all duration-300 hover:bg-black/60 hover:border-white/25 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                {/* Glow effect */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative flex flex-col gap-4">
                  {/* Icon and Title */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-white/20">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                        <path d="M5 3v4" />
                        <path d="M19 17v4" />
                        <path d="M3 5h4" />
                        <path d="M17 19h4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white/95">Create Quiz</h3>
                  </div>

                  {/* Content */}
                  <p className="text-sm text-white/65 leading-relaxed text-left">
                    Upload your files and we&apos;ll generate exam-style questions tailored to your content.
                  </p>

                  {/* CTA Button */}
                  <div className="flex items-center justify-start pt-1">
                    <div className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-all duration-300 group-hover:bg-white group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-white/30">
                      Create a Quiz →
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* View Quizzes – secondary card */}
            <Link
              href="/quizzes"
              className="block group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300"
            >
              <div className="relative rounded-3xl border border-white/12 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:border-white/25 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                {/* Glow effect */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative flex flex-col gap-4">
                  {/* Icon and Title */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/40 group-hover:scale-110">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white/90"
                      >
                        <path d="M8 6h13" />
                        <path d="M8 12h13" />
                        <path d="M8 18h13" />
                        <path d="M3 6h.01" />
                        <path d="M3 12h.01" />
                        <path d="M3 18h.01" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white/95">View Quizzes</h3>
                  </div>

                  {/* Content */}
                  <p className="text-sm text-white/65 leading-relaxed text-left">
                    Review, retake, and track your progress. Clean, distraction-free experience.
                  </p>

                  {/* CTA Button */}
                  <div className="flex items-center justify-start pt-1">
                    <div className="rounded-full border border-white/30 bg-white/5 px-5 py-2 text-sm font-semibold text-white/90 transition-all duration-300 group-hover:border-white group-hover:bg-white/15 group-hover:text-white group-hover:scale-105">
                      View My Quizzes →
                    </div>
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
