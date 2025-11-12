"use client";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost";
  size?: "md" | "lg";
};
export default function Button({ className, variant="solid", size="md", ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none";
  const sizes = size==="lg" ? "px-6 py-3 text-sm" : "px-5 py-2.5 text-sm";
  const styles = variant==="solid"
    ? "bg-neutral-900 hover:bg-neutral-800 text-white border border-white/10 shadow"
    : "bg-white/5 hover:bg-white/10 text-neutral-200 border border-white/10";
  return <button className={clsx(base, sizes, styles, className)} {...props} />;
}