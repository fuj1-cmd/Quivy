import type { Metadata } from "next";
import "./globals.css";
import { Electrolize, Inter } from "next/font/google";
import Header from "@/components/Header";

const display = Electrolize({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
});

const text = Inter({
  subsets: ["latin"],
  variable: "--font-text",
});

export const metadata: Metadata = {
  title: "Quivy",
  description: "AI-powered quiz generation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${text.variable} bg-background text-foreground`}>
        <Header />
        {/* pad for the fixed header */}
        <div className="pt-32">{children}</div>
      </body>
    </html>
  );
}