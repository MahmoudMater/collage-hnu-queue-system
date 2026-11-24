"use client";

import { t } from "@/lib/strings";
import { useLiveBoard } from "@/lib/use-live-board";
import type { LiveSnapshot } from "@/lib/types";
import { InsideCard } from "./InsideCard";
import { QueueColumn } from "./QueueColumn";

/**
 * The live queue of a started session: the team being asked or inside, then
 * the main queue and the late queue side by side. `myTeam` highlights a team
 * in its column; the leader sign-in that supplies it arrives with the leader
 * panel.
 */
export function LiveBoard({
  sessionId,
  initial,
  myTeam = null,
}: {
  sessionId: string;
  initial: LiveSnapshot;
  myTeam?: number | null;
}) {
  const { board, offsetMs, connection } = useLiveBoard(sessionId, initial);
  return (
    <div className="space-y-4">
      {connection === "lost" ? (
        <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
          {t.live.connectionLost}
        </p>
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
    </div>
  );
}
