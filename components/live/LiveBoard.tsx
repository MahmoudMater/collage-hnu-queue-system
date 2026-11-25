"use client";

import { t } from "@/lib/strings";
import { useLiveBoard } from "@/lib/use-live-board";
import { useMyTeam } from "@/lib/use-my-team";
import type { LiveSnapshot } from "@/lib/types";
import { InsideCard } from "./InsideCard";
import { LeaderBox } from "./LeaderBox";
import { QueueColumn } from "./QueueColumn";

/**
 * The live queue of a started session: the team being asked or inside, then
 * the main queue and the late queue side by side. A signed-in leader's own
 * team is highlighted in its column and he can answer the call from above it.
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
  const myTeam = me.state.status === "signed-in" ? me.state.number : null;
  return (
    <div className="space-y-4">
      {connection === "lost" ? (
        <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
          {t.live.connectionLost}
        </p>
      ) : null}
      {board.session.status === "RUNNING" ? (
        <LeaderBox sessionId={sessionId} subjectId={board.session.subject.id} board={board} offsetMs={offsetMs} me={me} />
      ) : null}
      {board.session.status === "ENDED" ? (
        <p className="rounded-lg bg-info-soft px-3 py-2 text-sm text-info">{t.live.ended}</p>
      ) : (
        <InsideCard inside={board.inside} offsetMs={offsetMs} mine={myTeam !== null && board.inside?.number === myTeam} />
      )}
      <div className="grid grid-cols-2 gap-3">
        <QueueColumn
          title={t.live.mainTitle}
          items={board.queues.main}
          empty={t.live.emptyMain}
          late={false}
          mine={myTeam}
        />
        <QueueColumn
          title={t.live.lateTitle}
          items={board.queues.late}
          empty={t.live.emptyLate}
          late
          mine={myTeam}
        />
      </div>
      {board.movedOut.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-medium text-muted">{t.live.movedTitle}</h2>
          <ul className="space-y-1 text-sm text-muted">
            {board.movedOut.map((m) => (
              <li key={m.number}>
                {t.session.team} {m.number} {t.live.movedTo} <span dir="ltr">{m.toTa}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {board.session.status === "ENDED" && board.teams.some((x) => x.status === "NOT_DISCUSSED") ? (
        <section>
          <h2 className="mb-1 text-sm font-medium text-muted">{t.live.notDiscussedTitle}</h2>
          <p className="mb-2 text-xs text-muted">{t.live.notDiscussedHint}</p>
          <p className="text-sm">
            {board.teams
              .filter((x) => x.status === "NOT_DISCUSSED")
              .map((x) => x.number)
              .join("، ")}
          </p>
        </section>
      ) : null}
    </div>
  );
}
