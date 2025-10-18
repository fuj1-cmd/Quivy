import Link from "next/link";
import Container from "@/components/Container";
import { Card, CardBody } from "@/components/ui/Card";

function Tile({
  href,
  title,
  desc,
  icon,
}: { href: string; title: string; desc: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-all duration-300 group-hover:translate-y-[-2px] group-hover:border-white/20">
        <CardBody>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/15 text-indigo-300">
              {icon}
            </div>
            <div>
              <div className="text-base font-semibold text-white">{title}</div>
              <div className="text-sm text-neutral-400">{desc}</div>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="pt-28 pb-10">
        <Container>
          <div className="text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
              <span className="text-xl">✨</span>
              <span className="text-sm font-medium text-neutral-300">Quivy</span>
            </div>
            <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white">
              Study smarter, not sweatier
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-neutral-400">
              Feed slides and notes → get grounded, exam-style quizzes with rationales. Retake anytime.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <Tile
              href="/generate"
              title="Create Quiz"
              desc="Upload material and generate a set in seconds."
              icon={<span className="text-lg">🧩</span>}
            />
            <Tile
              href="/quizzes"
              title="View Quizzes"
              desc="Browse, rename, group, and retake saved sets."
              icon={<span className="text-lg">📚</span>}
            />
          </div>
        </Container>
      </section>
    </main>
  );
}
