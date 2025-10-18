"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between rounded-full border border-gray-700/50 bg-gray-900/80 px-5 py-2.5 shadow-lg backdrop-blur-md">
          {/* Logo → Home */}
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full px-4 py-2 hover:bg-gray-800 transition-all duration-300"
            aria-label="Go to home"
          >
            <span className="text-2xl text-blue-400">✨</span>
            <span className="text-base font-bold text-white tracking-tight">Quivy</span>
          </Link>

          {/* Back (hidden on home) */}
          {!isHome && (
            <button
              onClick={() => {
                if (window.history.length > 1) router.back();
                else router.push("/");
              }}
              className="flex items-center gap-2 rounded-full bg-gray-800/50 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300 shadow-md"
              aria-label="Back to home"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span className="text-sm font-semibold">Back</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}