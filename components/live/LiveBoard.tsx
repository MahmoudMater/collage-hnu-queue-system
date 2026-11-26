"use client";

import { t } from "@/lib/strings";
import { useLiveBoard } from "@/lib/use-live-board";
import { useMyTeam } from "@/lib/use-my-team";
import type { LiveSnapshot } from "@/lib/types";
import { InsideCard } from "./InsideCard";
import { LeaderBox } from "./LeaderBox";
import { PaceNote } from "./PaceNote";
import { TurnAlert, useFollowedTeam } from "./TurnAlert";
import { Queue } from "./Queue";

/**
 * The live board of a started session, top to bottom on a phone: the TA's
 * pace, the team being asked or inside, the student's own tools (alerts, the
 * leader's actions), then the queue with a tab each for the main and the late
 * queue. On a desktop the team inside is a banner across the page, the queue
 * takes the wide left column and the tools a right one that stays in view. A signed-in
 * leader's own team is marked "You" and he can answer the call from above it.
 */
export function LiveBoard({
  sessionId,
  initial,
}: {
  sessionId: string;
  initial: LiveSnapshot;
}) {
  const { board, offsetMs, connection } = useLiveBoard(sessionId, initial);
  const me = useMyTeam(board.session.subject.id);
  const leaderTeam = me.state.status === "signed-in" ? me.state.number : null;
  const follow = useFollowedTeam(sessionId);
  // A signed-in leader watches his own team; anyone else may follow one by number.
  const myTeam = leaderTeam ?? follow.team;
  // With late requests closed (cutoff 0) the late queue stays empty unless the TA or a move fills it.
  const lateOn = board.session.lateCutoffMinutes !== 0 || board.queues.late.length > 0;
  // The page shows this board only once the discussion has started, so it is running or it has ended.
  const running = board.session.status === "RUNNING";
  return (
    <div className="dq-stack dq-stack--md">
      {connection === "lost" ? (
        <p role="alert" className="dq-notice dq-notice--danger">
          {t.live.connectionLost}
        </p>
      ) : null}
      <div className={running ? "dq-live" : "dq-live dq-live--solo"}>
        <div className="dq-live__pace">
          {running ? (
            <PaceNote pause={board.session.break} delayMinutes={board.delayMinutes} offsetMs={offsetMs} />
          ) : (
            <p className="dq-notice dq-notice--info">{t.live.ended}</p>
          )}
        </div>
        {running ? (
          <div className="dq-live__hero">
            <InsideCard
              inside={board.inside}
              offsetMs={offsetMs}
              mine={myTeam !== null && board.inside?.number === myTeam}
              stats={[
                { label: t.live.waiting, value: board.queues.main.length },
                ...(lateOn ? [{ label: t.live.tabLate, value: board.queues.late.length }] : []),
              ]}
            />
          </div>
        ) : null}
        {running ? (
          <div className="dq-live__tools">
            <section className="dq-turn" aria-label={t.alert.yourTurn}>
              <TurnAlert board={board} team={myTeam} fixed={leaderTeam !== null} onFollow={follow.set} />
              <LeaderBox sessionId={sessionId} subjectId={board.session.subject.id} board={board} offsetMs={offsetMs} me={me} />
            </section>
          </div>
        ) : null}
        <div className="dq-live__queue dq-stack dq-stack--md">
          <Queue main={board.queues.main} late={board.queues.late} lateOn={lateOn} mine={myTeam} />
          {board.movedOut.length > 0 ? (
            <section>
              <h2 className="dq-section-title dq-overline">{t.live.movedTitle}</h2>
              <ul className="space-y-1 text-sm text-muted">
                {board.movedOut.map((m) => (
                  <li key={m.number}>
                    {t.session.team} {m.number} {t.live.movedTo} <span dir="auto">{m.toTa}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {board.session.status === "ENDED" && board.teams.some((x) => x.status === "NOT_DISCUSSED") ? (
            <section>
              <h2 className="dq-section-title dq-overline">{t.live.notDiscussedTitle}</h2>
              <p className="dq-help mb-2">{t.live.notDiscussedHint}</p>
              <ul className="dq-chips">
                {board.teams
                  .filter((x) => x.status === "NOT_DISCUSSED")
                  .map((x) => (
                    <li key={x.number}>{x.number}</li>
                  ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
