import { Suspense } from "react";
import { BackLink } from "@/components/BackLink";
import { ListSkeleton } from "@/components/ListSkeleton";
import { Arriving, Leaving, PageTransition } from "@/components/PageTransition";
import { StateMessage } from "@/components/StateMessage";
import { StatusBadge } from "@/components/StatusBadge";
import { LiveBoard } from "@/components/live/LiveBoard";
import { apiGet } from "@/lib/api";
import { dateParts, formatDate, formatTime, t } from "@/lib/strings";
import type { LiveSnapshot } from "@/lib/types";

type Props = { params: Promise<{ sessionId: string }>; searchParams: Promise<{ team?: string }> };

export default function SessionPage({ params, searchParams }: Props) {
  return (
    <PageTransition>
      <main>
        <Suspense
          fallback={
            <Leaving>
              <ListSkeleton rows={5} />
            </Leaving>
          }
        >
          <Arriving>
            <SessionContent params={params} searchParams={searchParams} />
          </Arriving>
        </Suspense>
      </main>
    </PageTransition>
  );
}

async function SessionContent({ params, searchParams }: Props) {
  const { sessionId } = await params;
  // A link from the team search carries the team, so its slot can be marked before the queue starts.
  const myTeam = Number((await searchParams).team);
  const snapshot = await apiGet<LiveSnapshot>(
    `/api/v1/discussions/sessions/${encodeURIComponent(sessionId)}`,
  );
  const { session, teams } = snapshot;
  const notStarted = session.status === "NOT_STARTED";
  const lateLimit = session.status !== "ENDED" ? session.lateCutoffMinutes : null;
  const date = dateParts(session.date);
  return (
    <>
      <BackLink href={`/subjects/${session.subject.id}`} kind={t.session.back}>
        <span dir="auto">{session.subject.name}</span>
      </BackLink>
      <div className="dq-titlebar">
        <h1 className="title" dir="auto">
          {session.taName}
        </h1>
        <StatusBadge status={session.status} />
      </div>
      <p className="dq-intro">{[session.label, formatDate(session.date)].filter(Boolean).join(" · ")}</p>

      {notStarted || lateLimit !== null ? (
        <div className="dq-stack dq-stack--md mt-5">
          {notStarted ? (
            <div className="dq-live__hero">
              <section className="dq-inside">
                <div className="dq-inside__top">
                  <span className="dq-inside__label">{t.session.starts}</span>
                </div>
                <div className="dq-inside__body">
                  <div>
                    <p className="dq-inside__team">
                      {date.weekday} {date.day} {date.month}
                    </p>
                    <p className="dq-inside__name">{t.session.readOnly}</p>
                  </div>
                </div>
                {teams.length > 0 ? (
                  <div className="dq-inside__stats">
                    <span className="dq-inside__stat">
                      <b>{teams.length}</b>
                      {t.session.teams}
                    </span>
                    <span className="dq-inside__stat dq-inside__stat--text">
                      <b>{formatTime(teams[0].time)}</b>
                      {t.session.firstSlot}
                    </span>
                    <span className="dq-inside__stat dq-inside__stat--text">
                      <b>{formatTime(teams[teams.length - 1].time)}</b>
                      {t.session.lastSlot}
                    </span>
                  </div>
                ) : null}
              </section>
            </div>
          ) : null}
          {lateLimit !== null ? <p className="dq-notice dq-notice--info">{t.latePolicy.notice(lateLimit)}</p> : null}
        </div>
      ) : null}

      {!notStarted ? (
        <div className="mt-5">
          <LiveBoard sessionId={session.id} initial={snapshot} />
        </div>
      ) : null}

      {notStarted ? <h2 className="dq-section-title dq-overline mt-6">{t.session.scheduleTitle}</h2> : null}
      {!notStarted ? null : teams.length === 0 ? (
        <StateMessage empty title={t.session.noTeams} body="" />
      ) : (
        <ol className="dq-slots">
          {teams.map((team) => (
            <li key={`${team.lane}-${team.number}`} className={team.number === myTeam ? "dq-slot dq-slot--you" : "dq-slot"}>
              <span className="dq-slot__time">{formatTime(team.time)}</span>
              <span className="dq-slot__team">
                {t.session.team} {team.number}
                {team.number === myTeam ? <span className="dq-you">{t.live.you}</span> : null}
              </span>
              {team.leaderName ? (
                <span className="dq-slot__name" dir="auto">
                  {team.leaderName}
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
