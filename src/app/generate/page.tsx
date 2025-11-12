export default function GeneratePage() {
  return (
    <main className="min-h-screen pt-28">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-lg">
          <div className="px-6 pt-6">
            <h3 className="text-lg font-semibold text-white">Create a New Quiz</h3>
            <p className="mt-1 text-sm text-neutral-400">Upload slides/notes, choose options, and generate.</p>
          </div>
          <div className="p-6 space-y-4">
            <input
              type="file"
              multiple
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-neutral-200 file:mr-4 file:rounded-lg file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:text-white"
              accept=".pdf,.ppt,.pptx,.png,.jpg,.jpeg"
            />
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
            <button className="rounded-xl border border-white/10 bg-neutral-900 text-white px-6 py-3 text-sm font-medium hover:bg-neutral-800 transition">
              Generate
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}