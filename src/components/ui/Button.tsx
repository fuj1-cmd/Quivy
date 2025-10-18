"use client";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  asChild?: boolean;
};

export default function Button({ className, variant = "primary", ...props }: Props) {
  const base =
    "inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/60";
  const styles =
    variant === "primary"
      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
      : "bg-white/5 hover:bg-white/10 text-neutral-200 border border-white/10";
  return <button className={clsx(base, styles, className)} {...props} />;
}