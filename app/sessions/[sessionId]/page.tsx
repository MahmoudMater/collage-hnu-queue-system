import Link from "next/link";
import { Suspense } from "react";
import { ListSkeleton } from "@/components/ListSkeleton";
import { StateMessage } from "@/components/StateMessage";
import { StatusBadge } from "@/components/StatusBadge";
import { LiveBoard } from "@/components/live/LiveBoard";
import { apiGet } from "@/lib/api";
import { formatDate, formatTime, t } from "@/lib/strings";
import type { LiveSnapshot } from "@/lib/types";

export default function SessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  return (
    <main>
      <Suspense fallback={<ListSkeleton rows={5} />}>
        <SessionContent params={params} />
      </Suspense>
    </main>
  );
}

async function SessionContent({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const snapshot = await apiGet<LiveSnapshot>(
    `/api/v1/discussions/sessions/${encodeURIComponent(sessionId)}`,
  );
  const { session, teams } = snapshot;
  return (
    <>
      <Link href={`/subjects/${session.subject.id}`} className="text-sm text-accent">
        {t.session.back}: {session.subject.name}
      </Link>
      <div className="mt-2 flex items-start justify-between gap-3">
        <h1 className="text-2xl font-medium">{session.taName}</h1>
        <StatusBadge status={session.status} />
      </div>
      {session.label ? <p className="mt-0.5 text-sm text-muted">{session.label}</p> : null}
      <p className="mt-1 text-sm text-muted">{formatDate(session.date)}</p>

      {session.status === "NOT_STARTED" ? (
        <p className="mt-4 rounded-lg bg-idle-soft px-3 py-2 text-sm text-idle">{t.session.readOnly}</p>
      ) : null}

      {session.status !== "NOT_STARTED" ? (
        <div className="mt-5">
          <LiveBoard sessionId={session.id} initial={snapshot} />
        </div>
      ) : null}

      {session.status === "NOT_STARTED" ? (
        <h2 className="mt-6 mb-3 text-sm font-medium text-muted">{t.session.scheduleTitle}</h2>
      ) : null}
      {session.status !== "NOT_STARTED" ? null : teams.length === 0 ? (
        <StateMessage title={t.session.noTeams} body="" />
      ) : (
        <ol className="overflow-hidden rounded-xl border border-line bg-card">
          {teams.map((team) => (
            <li
              key={`${team.lane}-${team.number}`}
              className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-b-0"
            >
              <span>
                <span className="text-base font-medium">
                  {t.session.team} {team.number}
                </span>
                {team.leaderName ? (
                  <span className="block text-sm text-muted">{team.leaderName}</span>
                ) : null}
              </span>
              <span className="shrink-0 text-sm text-muted">{formatTime(team.time)}</span>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
