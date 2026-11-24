import Link from "next/link";
import { Suspense } from "react";
import { ListSkeleton } from "@/components/ListSkeleton";
import { StateMessage } from "@/components/StateMessage";
import { apiGet } from "@/lib/api";
import { sessionsCount, t } from "@/lib/strings";
import type { SubjectsResponse } from "@/lib/types";

export default function Home() {
  return (
    <main>
      <h1 className="text-2xl font-medium">{t.home.title}</h1>
      <p className="mt-1 text-sm text-muted">{t.home.intro}</p>
      <div className="mt-5">
        <Suspense fallback={<ListSkeleton />}>
          <SubjectList />
        </Suspense>
      </div>
    </main>
  );
}

async function SubjectList() {
  const { subjects } = await apiGet<SubjectsResponse>("/api/v1/discussions/subjects");
  if (subjects.length === 0)
    return <StateMessage title={t.home.empty.title} body={t.home.empty.body} />;
  return (
    <ul className="space-y-3">
      {subjects.map((s) => (
        <li key={s.id}>
          <Link
            href={`/subjects/${s.id}`}
            className="flex items-center justify-between gap-3 rounded-xl border border-line bg-card px-4 py-4"
          >
            <span className="text-base font-medium">{s.name}</span>
            <span className="shrink-0 text-sm text-muted">{sessionsCount(s.sessionCount)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
