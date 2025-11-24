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
    "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50";
  const inactiveBtn =
    "bg-white/5 text-white/70 hover:bg-white/15 hover:text-white hover:scale-105 hover:border-white/20 backdrop-blur-sm border-white/10";
  const activeBtn =
    "bg-white !text-black shadow-lg shadow-white/20 ring-1 ring-white/70 ring-offset-0 border-white scale-105 hover:shadow-xl hover:shadow-white/30";

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
    "relative flex items-center justify-between rounded-full px-4 transition-all duration-300 ease-out border backdrop-blur-2xl backdrop-saturate-150";

  const glassState = scrolled
    ? "py-2 bg-black/75 shadow-[0_8px_32px_rgba(0,0,0,0.7),0_0_80px_rgba(255,255,255,0.03)] scale-[0.97] border-white/10"
    : "py-2.5 bg-black/60 shadow-[0_12px_48px_rgba(0,0,0,0.6),0_0_100px_rgba(255,255,255,0.05)] border-white/15";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className={`${glassBase} ${glassState}`}>
          {/* Top highlight */}
          <div className="pointer-events-none absolute inset-x-1 top-0 h-px bg-gradient-to-r from-white/0 via-white/30 to-white/0" />

          {/* Left side with logo */}
          <div className="flex items-center">
            {/* Home / Logo pill */}
            <Link
              href="/"
              aria-label="Quivy Home"
              className="
                group flex items-center gap-2
                rounded-full px-3 py-1.5
                bg-transparent
                hover:bg-white/10
                hover:scale-105
                transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50
              "
            >
              <div
                className="
                  flex h-6 w-6 items-center justify-center
                  rounded-full border border-white/40
                  bg-gradient-to-br from-white/10 to-white/5
                  text-xs font-bold text-white
                  transition-all duration-200
                  group-hover:from-white/30 group-hover:to-white/20
                  group-hover:border-white group-hover:shadow-lg group-hover:shadow-white/20
                  group-hover:scale-110
                "
              >
                Q
              </div>
              <span
                className="
                  text-sm font-semibold text-white/90
                  transition-all duration-200
                  group-hover:text-white
                  tracking-tight
                "
              >
                Quivy
              </span>
            </Link>
          </div>

          {/* Right nav */}
          <div className="flex items-center gap-2">
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
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:-translate-x-0.5"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                <span>Back</span>
              </button>
            )}

            {/* Button group */}
            <div className="flex items-center gap-2.5">
              {navButton("/generate", "Create")}
              {navButton("/quizzes", "Quizzes")}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
