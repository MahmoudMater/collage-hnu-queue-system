import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BackLink } from "@/components/BackLink";
import { Breadcrumbs } from "@/components/JsonLd";
import { ListSkeleton } from "@/components/ListSkeleton";
import { Arriving, Leaving, PageTransition, forward } from "@/components/PageTransition";
import { StateMessage } from "@/components/StateMessage";
import { StatusBadge } from "@/components/StatusBadge";
import { PaceNote } from "@/components/live/PaceNote";
import { TeamSearch } from "@/components/TeamSearch";
import { apiGet, orNull } from "@/lib/api";
import { pageMeta } from "@/lib/seo";
import { dateParts, formatDate, t, teamsWord } from "@/lib/strings";
import type { SessionCard, SessionCardsResponse } from "@/lib/types";

const sessionsOf = (subjectId: string) =>
  apiGet<SessionCardsResponse>(`/api/v1/discussions/subjects/${encodeURIComponent(subjectId)}/sessions`);

export async function generateMetadata({ params }: { params: Promise<{ subjectId: string }> }): Promise<Metadata> {
  const { subjectId } = await params;
  const data = await sessionsOf(subjectId).catch(orNull);
  if (!data) return {};
  return pageMeta({
    title: t.seo.subject.title(data.subject.name),
    description: t.seo.subject.description(data.subject.name, data.sessions.length),
    path: `/subjects/${encodeURIComponent(data.subject.id)}`,
  });
}

export default function SubjectPage({ params }: { params: Promise<{ subjectId: string }> }) {
  return (
    <PageTransition>
      <main>
        <Suspense
          fallback={
            <Leaving>
              <ListSkeleton />
            </Leaving>
          }
        >
          <Arriving>
            <SubjectContent params={params} />
          </Arriving>
        </Suspense>
      </main>
    </PageTransition>
  );
}

/** Today in Cairo as YYYY-MM-DD, the form session dates use. */
const cairoToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Cairo" }).format(new Date());

async function SubjectContent({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params;
  const { subject, sessions } = await sessionsOf(subjectId);
  const today = cairoToday();
  const groups = [
    { title: t.level.today, cards: sessions.filter((s) => s.date === today) },
    { title: t.level.other, cards: sessions.filter((s) => s.date !== today) },
  ].filter((g) => g.cards.length > 0);
  const live = sessions.filter((s) => s.status === "RUNNING").length;
  return (
    <>
      <Breadcrumbs
        items={[
          { name: t.appName, path: "/" },
          ...(subject.level ? [{ name: t.level.names[subject.level - 1], path: `/levels/${subject.level}` }] : []),
          { name: subject.name, path: `/subjects/${encodeURIComponent(subject.id)}` },
        ]}
      />
      <div className="dq-pagehead">
        <div>
          <BackLink href={subject.level ? `/levels/${subject.level}` : "/#levels"}>
            {subject.level ? t.level.names[subject.level - 1] : t.subject.back}
          </BackLink>
          <div className="dq-titlebar">
            <h1 className="title" dir="auto">
              {subject.name}
            </h1>
          </div>
          {sessions.length > 0 ? <p className="dq-intro">{t.subject.summary(sessions.length, live)}</p> : null}
        </div>
        {sessions.length > 0 ? <TeamSearch subjectId={subject.id} /> : null}
      </div>
      {sessions.length === 0 ? (
        <div className="mt-5">
          <StateMessage empty title={t.subject.empty.title} body={t.subject.empty.body} />
        </div>
      ) : (
        <div className="dq-stack dq-stack--lg mt-6">
          {groups.map((g) => (
            <section key={g.title}>
              <h2 className="dq-section-title dq-overline">{g.title}</h2>
              <ul className="dq-stack">
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

/** A discussion as a row of the agenda: a calendar tile, the TA and the place, status and pace, team count, the sheet. */
function SessionCardItem({ s }: { s: SessionCard }) {
  const date = dateParts(s.date);
  return (
    <li className={s.status === "RUNNING" ? "dq-session dq-session--live" : "dq-session"}>
      <Link href={`/sessions/${s.id}`} className="dq-session__main" transitionTypes={forward}>
        <span className="dq-session__date" aria-label={formatDate(s.date)}>
          <span>{date.weekday}</span>
          <b>{date.day}</b>
          <span>{date.month}</span>
        </span>
        <span className="dq-session__who">
          <span className="dq-session__ta block" dir="auto">
            {s.taName}
          </span>
          {s.label ? <span className="dq-session__meta block">{s.label}</span> : null}
        </span>
        <span className="dq-session__state">
          <StatusBadge status={s.status} plain />
          {s.status === "RUNNING" ? <PaceNote pause={s.break} delayMinutes={s.delayMinutes} /> : null}
        </span>
        <span className="dq-session__count">
          <b>{s.teamCount}</b> {teamsWord(s.teamCount)}
        </span>
      </Link>
      {s.status !== "ENDED" ? (
        <a
          href={`/api/v1/discussions/sessions/${encodeURIComponent(s.id)}/sheet`}
          target="_blank"
          rel="noopener nofollow"
          aria-label={t.session.downloadSheet}
          title={t.session.downloadSheet}
          className="dq-session__sheet"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 2v8M4.5 7 8 10.5 11.5 7M3 13h10" />
          </svg>
        </a>
      ) : null}
    </li>
  );
}
