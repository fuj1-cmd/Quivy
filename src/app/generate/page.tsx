"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import type { QuizGenerationResponse, Difficulty, QuestionType } from "@/types/quiz";

type InputMode = "file" | "text";

export default function GeneratePage() {
  const router = useRouter();
  const [inputMode, setInputMode] = useState<InputMode>("file");
  const [studyMaterial, setStudyMaterial] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [questionType, setQuestionType] = useState<QuestionType>("mcq");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizGenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Remove file
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    // Validate input based on mode
    if (inputMode === "text" && !studyMaterial.trim()) {
      setError("Please enter some study material");
      return;
    }
    if (inputMode === "file" && files.length === 0) {
      setError("Please upload at least one file");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      let textToProcess = studyMaterial;

      // If in file mode, read file contents (for now, just text files)
      if (inputMode === "file") {
        // For now, only handle text files - file parsing will be added later
        const textFiles = files.filter(f => f.name.endsWith('.txt'));
        if (textFiles.length === 0) {
          throw new Error("Please upload at least one .txt file. Other file types coming soon!");
        }

        const fileContents = await Promise.all(
          textFiles.map(file => file.text())
        );
        textToProcess = fileContents.join("\n\n");
      }

      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textToProcess,
          numQuestions,
          difficulty,
          questionType,
        }),
      });

      const data: QuizGenerationResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to generate quiz");
      }

      setGeneratedQuiz(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="relative min-h-screen pt-4 overflow-x-hidden">
      <div className="relative mx-auto w-full max-w-5xl px-6 pb-10">
        <div className="space-y-4">
          {/* Header Section */}
          <div className="text-center space-y-1.5">
            <h1 className="font-[family-name:var(--font-display)] text-white text-4xl sm:text-5xl font-bold tracking-[0.08em] antialiased bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent leading-none">
              Create a New Quiz
            </h1>
            <p className="text-white/60 text-sm">
              Upload files or enter a prompt to generate your quiz
            </p>
          </div>

          {/* Content Card */}
          <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-xl">
            <div className="p-6 space-y-5">
              {/* Toggle Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setInputMode("file")}
                  className={`flex-1 rounded-xl px-5 py-3 text-base font-medium transition-all ${
                    inputMode === "file"
                      ? "bg-white/10 text-white border border-white/20"
                      : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  Upload Files
                </button>
                <button
                  onClick={() => setInputMode("text")}
                  className={`flex-1 rounded-xl px-5 py-3 text-base font-medium transition-all ${
                    inputMode === "text"
                      ? "bg-white/10 text-white border border-white/20"
                      : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  Enter Prompt
                </button>
              </div>

              {/* File Upload Mode */}
              {inputMode === "file" && (
                <div className="space-y-4">
                  {/* Drag & Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
                      isDragging
                        ? "border-white/40 bg-white/10"
                        : "border-white/20 bg-white/5"
                    }`}
                  >
                    <svg
                      className="mx-auto h-10 w-10 text-white/40 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-sm text-white/70 mb-1">Drop files here or click to upload</p>
                    <p className="text-xs text-white/40">PDF, PPTX, PNG, JPG, TXT</p>

                    <input
                      id="file-input"
                      type="file"
                      multiple
                      accept=".pdf,.ppt,.pptx,.png,.jpg,.jpeg,.txt,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="file-input"
                      className="mt-3 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-200 cursor-pointer"
                    >
                      Choose Files
                    </label>
                  </div>

                  {/* File Preview */}
                  {files.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm text-white/70">{files.length} file(s) selected</p>
                      <div className="flex flex-wrap gap-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-xs text-white/80"
                          >
                            <span className="truncate max-w-[150px]">{file.name}</span>
                            <button
                              onClick={() => removeFile(index)}
                              className="text-white/40 hover:text-white transition"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Text Input Mode */}
              {inputMode === "text" && (
                <div className="space-y-3">
                  <label className="text-base text-white/80">Quiz Prompt</label>
                  <textarea
                    value={studyMaterial}
                    onChange={(e) => setStudyMaterial(e.target.value)}
                    placeholder="Enter your study material or describe the quiz you want...
Examples:
• Paste your lecture notes or textbook content
• 'Create a quiz about photosynthesis for high school biology'
• 'Generate questions on the American Revolution'"
                    className="w-full h-44 rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-base text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                  />
                </div>
              )}

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-white/70">Question Type</label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <option value="mcq">Multiple Choice</option>
                    <option value="true_false">True/False</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-white/70">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-white/70">Number of Questions</label>
                  {numQuestions === 0 ? (
                    <input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="Enter number"
                      onChange={(e) => setNumQuestions(Number(e.target.value) || 10)}
                      onBlur={(e) => {
                        if (!e.target.value) setNumQuestions(10);
                      }}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200 text-center focus:outline-none focus:ring-2 focus:ring-white/20"
                      autoFocus
                    />
                  ) : (
                    <select
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(Number(e.target.value))}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={0}>Custom</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              {!generatedQuiz ? (
                <div className="relative w-full">
                  {isGenerating && (
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <div
                        className="absolute inset-0"
                        style={{
                          background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 60deg, rgba(255,255,255,0.8) 90deg, transparent 120deg, transparent 360deg)",
                          animation: "spin 2s linear infinite",
                        }}
                      />
                    </div>
                  )}
                  <button
                    onClick={handleGenerate}
                    disabled={
                      (inputMode === "text" && !studyMaterial.trim()) ||
                      (inputMode === "file" && files.length === 0) ||
                      isGenerating
                    }
                    className={`relative w-full rounded-xl px-6 py-3.5 text-base font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      isGenerating
                        ? "bg-black/90 text-white border-2 border-transparent m-[2px]"
                        : "bg-white/10 text-white border-2 border-white/20 hover:bg-white/15 hover:scale-[1.02]"
                    }`}
                  >
                    {isGenerating ? "Generating..." : "Generate Quiz"}
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setGeneratedQuiz(null);
                      setStudyMaterial("");
                      setFiles([]);
                      setError(null);
                    }}
                    variant="ghost"
                    size="lg"
                    fullWidth
                  >
                    Generate Another
                  </Button>
                  <Button
                    onClick={() => router.push(`/quiz/${generatedQuiz.quiz?.id}`)}
                    variant="primary"
                    size="lg"
                    fullWidth
                  >
                    View Quiz →
                  </Button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}