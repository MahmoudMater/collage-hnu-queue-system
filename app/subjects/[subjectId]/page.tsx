import Link from "next/link";
import { Suspense } from "react";
import { ListSkeleton } from "@/components/ListSkeleton";
import { StateMessage } from "@/components/StateMessage";
import { StatusBadge } from "@/components/StatusBadge";
import { PaceNote } from "@/components/live/PaceNote";
import { TeamSearch } from "@/components/TeamSearch";
import { apiGet } from "@/lib/api";
import { formatDate, t, teamsCount } from "@/lib/strings";
import type { SessionCard, SessionCardsResponse } from "@/lib/types";

export default function SubjectPage({ params }: { params: Promise<{ subjectId: string }> }) {
  return (
    <main>
      <Suspense fallback={<ListSkeleton />}>
        <SubjectContent params={params} />
      </Suspense>
    </main>
  );
}

/** Today in Cairo as YYYY-MM-DD, the form session dates use. */
const cairoToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Cairo" }).format(new Date());

async function SubjectContent({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params;
  const { subject, sessions } = await apiGet<SessionCardsResponse>(
    `/api/v1/discussions/subjects/${encodeURIComponent(subjectId)}/sessions`,
  );
  const today = cairoToday();
  const groups = [
    { title: t.level.today, cards: sessions.filter((s) => s.date === today) },
    { title: t.level.other, cards: sessions.filter((s) => s.date !== today) },
  ].filter((g) => g.cards.length > 0);
  return (
    <>
      <Link href={subject.level ? `/levels/${subject.level}` : "/?change"} className="text-sm text-accent">
        {subject.level ? t.level.names[subject.level - 1] : t.subject.back}
      </Link>
      <h1 className="mt-2 text-2xl font-medium">{subject.name}</h1>
      {sessions.length === 0 ? (
        <div className="mt-5">
          <StateMessage title={t.subject.empty.title} body={t.subject.empty.body} />
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          <TeamSearch subjectId={subject.id} />
          {groups.map((g) => (
            <section key={g.title}>
              <h2 className="mb-3 text-sm font-medium text-muted">
                {t.subject.sessions} · {g.title}
              </h2>
              <ul className="space-y-3">
                {g.cards.map((s) => (
                  <SessionCardItem key={s.id} s={s} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}

function SessionCardItem({ s }: { s: SessionCard }) {
  return (
    <li className="rounded-xl border border-line bg-card">
      <Link href={`/sessions/${s.id}`} className="block px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <span className="text-base font-medium">{s.taName}</span>
          <StatusBadge status={s.status} />
        </div>
        {s.label ? <p className="mt-0.5 text-sm text-muted">{s.label}</p> : null}
        <p className="mt-2 text-sm text-muted">
          {formatDate(s.date)} · {teamsCount(s.teamCount)}
        </p>
        {s.status === "RUNNING" ? (
          <div className="mt-2">
            <PaceNote pause={s.break} delayMinutes={s.delayMinutes} />
          </div>
        ) : null}
      </Link>
      {s.status !== "ENDED" ? (
        <a
          href={`/api/v1/discussions/sessions/${encodeURIComponent(s.id)}/sheet`}
          target="_blank"
          rel="noopener"
          className="block border-t border-line px-4 py-2 text-sm text-accent"
        >
          {t.session.downloadSheet}
        </a>
      ) : null}
    </li>
  );
}
