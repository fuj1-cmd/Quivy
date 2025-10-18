import Container from "@/components/Container";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function GeneratePage() {
  return (
    <main className="min-h-screen pt-28">
      <Container>
        <Card>
          <CardHeader title="Create a New Quiz" subtitle="Upload slides/PDFs, pick mode, and generate." />
          <CardBody>
            <div className="flex flex-col gap-4">
              <input
                type="file"
                multiple
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-neutral-200 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-white"
                accept=".pdf,.ppt,.pptx,.png,.jpg,.jpeg"
              />
              <div className="flex gap-3">
                <select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200">
                  <option>NCLEX-style</option>
                  <option>Recall</option>
                  <option>Dosage Calc</option>
                </select>
                <select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200">
                  <option>10 questions</option>
                  <option>25 questions</option>
                  <option>50 questions</option>
                </select>
                <select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200">
                  <option>gpt-4o-mini</option>
                  <option>gpt-4o</option>
                </select>
              </div>
              <Button className="mt-2">Generate</Button>
            </div>
          </CardBody>
        </Card>
      </Container>
    </main>
  );
}