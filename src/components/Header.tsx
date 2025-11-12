"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-black/60 px-5 py-2.5 shadow backdrop-blur">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-full px-3 py-1.5 hover:bg-white/5 transition"
            aria-label="Go to home"
          >
            {/* ring mark */}
            <svg width="18" height="18" viewBox="0 0 24 24" className="text-white/80">
              <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="text-sm font-medium text-white/85">Quivy</span>
          </Link>

          {!isHome && (
            <button
              onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/85 hover:bg-white/10 transition"
              aria-label="Back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span className="text-sm font-medium">Back</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}