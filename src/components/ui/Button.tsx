"use client";
import clsx from "clsx";
import { forwardRef } from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
};

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = "primary", size = "md", fullWidth = false, disabled, ...props },
  ref
) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";

  const sizes = {
    sm: "px-4 py-2 text-xs rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
  };

  const variants = {
    primary:
      "bg-white text-black hover:bg-white/90 hover:scale-105 hover:shadow-lg shadow-white/20",
    secondary:
      "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105",
    ghost:
      "bg-transparent text-white/70 border border-white/10 hover:bg-white/5 hover:text-white hover:border-white/20",
    danger:
      "bg-red-900/20 text-red-400 border border-red-500/30 hover:bg-red-900/30 hover:border-red-500/50",
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button
      ref={ref}
      className={clsx(base, sizes[size], variants[variant], width, className)}
      disabled={disabled}
      {...props}
    />
  );
});

export default Button;
