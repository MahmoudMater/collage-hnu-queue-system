import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ListSkeleton } from "@/components/ListSkeleton";
import { RememberedLevel } from "@/components/RememberedLevel";
import { StateMessage } from "@/components/StateMessage";
import { apiGet } from "@/lib/api";
import { sessionsCount, t } from "@/lib/strings";
import type { SubjectsResponse } from "@/lib/types";

export default function LevelPage({ params }: { params: Promise<{ level: string }> }) {
  return (
    <main>
      <Link href="/?change" className="text-sm text-accent">
        {t.level.change}
      </Link>
      <Suspense fallback={<ListSkeleton />}>
        <LevelContent params={params} />
      </Suspense>
    </main>
  );
}

async function LevelContent({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  if (!/^[1-4]$/.test(level)) notFound();
  const { subjects } = await apiGet<SubjectsResponse>(`/api/v1/discussions/subjects?level=${level}`);
  return (
    <>
      <RememberedLevel level={Number(level)} />
      <h1 className="mt-2 text-2xl font-medium">{t.level.names[Number(level) - 1]}</h1>
      <p className="mt-1 text-sm text-muted">{t.level.intro}</p>
      <div className="mt-5">
        {subjects.length === 0 ? (
          <StateMessage title={t.home.empty.title} body={t.home.empty.body} />
        ) : (
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
        )}
      </div>
    </>
  );
}
