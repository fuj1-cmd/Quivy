import Container from "@/components/Container";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function QuizzesPage() {
  const stub = []; // later: load from API/DB
  return (
    <main className="min-h-screen pt-28">
      <Container>
        <Card>
          <CardHeader title="Your Quizzes" subtitle="Retake, group, rename, or delete." />
          <CardBody>
            {stub.length === 0 ? (
              <div className="flex items-center justify-between">
                <p className="text-neutral-400">No quizzes yet.</p>
                <Link href="/generate"><Button variant="ghost">Generate Your First Quiz</Button></Link>
              </div>
            ) : (
              <ul className="divide-y divide-white/10">
                {stub.map((q: any) => (
                  <li key={q.id} className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium text-white">{q.title}</div>
                      <div className="text-xs text-neutral-500">Created {q.createdAt}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost">Open</Button>
                      <Button variant="ghost">Rename</Button>
                      <Button variant="ghost">Delete</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </Container>
    </main>
  );
}