import Link from "next/link";
import { Suspense } from "react";
import { ListSkeleton } from "@/components/ListSkeleton";
import { StateMessage } from "@/components/StateMessage";
import { StatusBadge } from "@/components/StatusBadge";
import { TeamSearch } from "@/components/TeamSearch";
import { apiGet } from "@/lib/api";
import { formatDate, t, teamsCount } from "@/lib/strings";
import type { SessionCardsResponse } from "@/lib/types";

export default function SubjectPage({ params }: { params: Promise<{ subjectId: string }> }) {
  return (
    <main>
      <Link href="/" className="text-sm text-accent">
        {t.subject.back}
      </Link>
      <Suspense fallback={<ListSkeleton />}>
        <SubjectContent params={params} />
      </Suspense>
    </main>
  );
}

async function SubjectContent({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params;
  const { subject, sessions } = await apiGet<SessionCardsResponse>(
    `/api/v1/discussions/subjects/${encodeURIComponent(subjectId)}/sessions`,
  );
  return (
    <>
      <h1 className="mt-2 text-2xl font-medium">{subject.name}</h1>
      <h2 className="mt-5 mb-3 text-sm font-medium text-muted">{t.subject.sessions}</h2>
      {sessions.length === 0 ? (
        <StateMessage title={t.subject.empty.title} body={t.subject.empty.body} />
      ) : (
        <div className="space-y-5">
          <ul className="space-y-3">
            {sessions.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/sessions/${s.id}`}
                  className="block rounded-xl border border-line bg-card px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-base font-medium">{s.taName}</span>
                    <StatusBadge status={s.status} />
                  </div>
                  {s.label ? <p className="mt-0.5 text-sm text-muted">{s.label}</p> : null}
                  <p className="mt-2 text-sm text-muted">
                    {formatDate(s.date)} · {teamsCount(s.teamCount)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          <TeamSearch sessions={sessions.map((s) => ({ id: s.id, taName: s.taName }))} />
        </div>
      )}
    </>
  );
}
