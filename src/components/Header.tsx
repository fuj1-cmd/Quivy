"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const baseBtn =
    "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium border border-white/10 transition-all";
  const inactiveBtn =
    "bg-white/5 text-white/70 hover:bg-white/15 hover:text-white backdrop-blur-sm";
  const activeBtn =
    "bg-white !text-black shadow-sm ring-1 ring-white/70 ring-offset-0";

  const navButton = (href: string, label: string) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={`${baseBtn} ${isActive ? activeBtn : inactiveBtn}`}
      >
        {label}
      </Link>
    );
  };

  const glassBase =
    "relative flex items-center justify-between rounded-full px-6 transition-all duration-200 ease-out border border-white/10 backdrop-blur-2xl backdrop-saturate-150";

  const glassState = scrolled
    ? "py-2 bg-black/70 shadow-[0_6px_24px_rgba(0,0,0,0.65)] scale-[0.98] border-white/5"
    : "py-2.5 bg-black/60 shadow-[0_10px_40px_rgba(0,0,0,0.55)]";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className={`${glassBase} ${glassState}`}>
          {/* Top highlight */}
          <div className="pointer-events-none absolute inset-x-1 top-0 h-px bg-gradient-to-r from-white/5 via-white/25 to-white/5 opacity-70" />

          {/* Home / Logo pill */}
          <Link
            href="/"
            aria-label="Quivy Home"
            className="
              group flex items-center gap-2
              rounded-full px-3 py-1
              bg-transparent
              hover:bg-white/10
              transition-all
            "
          >
            <div
              className="
                flex h-6 w-6 items-center justify-center
                rounded-full border border-white/30
                bg-transparent
                text-xs font-bold text-white/80
                transition-all
                group-hover:bg-white/25 group-hover:border-white/80 group-hover:text-black
              "
            >
              Q
            </div>
            <span
              className="
                text-sm font-bold text-white/80
                transition-all
                group-hover:text-white
              "
            >
              Quivy
            </span>
          </Link>

          {/* Right nav */}
          <div className="flex items-center gap-5">
            {!isHome && (
              <button
                onClick={() =>
                  window.history.length > 1
                    ? router.back()
                    : router.push("/")
                }
                className={`${baseBtn} ${inactiveBtn}`}
                aria-label="Back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                <span>Back</span>
              </button>
            )}

            {/* Button group spacing */}
            <div className="flex items-center gap-4">
              {navButton("/generate", "Create")}
              {navButton("/quizzes", "Quizzes")}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}