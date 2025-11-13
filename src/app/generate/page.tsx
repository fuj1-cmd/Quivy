"use client";
import { useState } from "react";

export default function GeneratePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(false);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
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

  // Mock Grok API
  const handleGenerate = async () => {
    if (files.length === 0) return;
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert(`Quiz generated from ${files.length} file(s)! (Mock)`);
    setIsGenerating(false);
  };

  return (
    <main className="min-h-screen pt-28">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-lg">
          <div className="px-6 pt-6">
            <h3 className="text-lg font-semibold text-white">Create a New Quiz</h3>
            <p className="mt-1 text-sm text-neutral-400">Upload slides/notes, choose options, and generate.</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
                isDragging
                  ? "border-white/40 bg-white/5"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <svg
                className="mx-auto h-12 w-12 text-white/40 mb-3"
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
              <p className="text-sm text-white/70">Drop files here or click to upload</p>
              <p className="text-xs text-white/40 mt-1">PDF, PPTX, PNG, JPG</p>

              <input
                id="file-input"
                type="file"
                multiple
                accept=".pdf,.ppt,.pptx,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-input"
                className="mt-4 inline-block rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition cursor-pointer"
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
                      className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/80"
                    >
                      <span className="truncate max-w-[120px]">{file.name}</span>
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

            {/* Options */}
            <div className="flex flex-wrap gap-3">
              <select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200">
                <option>Exam-style</option>
                <option>Recall</option>
                <option>Dosage Calc</option>
              </select>
              <select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200">
                <option>10 questions</option>
                <option>25 questions</option>
                <option>50 questions</option>
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={files.length === 0 || isGenerating}
              className={`w-full rounded-xl border border-white/10 px-6 py-3 text-sm font-medium transition ${
                files.length === 0 || isGenerating
                  ? "bg-neutral-900/50 text-white/40 cursor-not-allowed"
                  : "bg-neutral-900 text-white hover:bg-neutral-800"
              }`}
            >
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}