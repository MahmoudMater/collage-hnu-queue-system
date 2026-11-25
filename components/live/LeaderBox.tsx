"use client";

import { useState } from "react";
import { startStudentSignIn, studentSignOut } from "@/lib/auth";
import { describeError } from "@/lib/describe-error";
import { leaderText as L } from "@/lib/strings";
import { studentPost } from "@/lib/student-client";
import { TaError } from "@/lib/ta-client";
import type { LiveSnapshot } from "@/lib/types";
import { useSecondsLeft } from "@/lib/use-live-board";
import type { MyTeam } from "@/lib/use-my-team";

/** Above the live board: sign in, bind a team with its code, answer the call, ask for a new turn. */
export function LeaderBox({
  sessionId,
  subjectId,
  board,
  offsetMs,
  me,
}: {
  sessionId: string;
  subjectId: string;
  board: LiveSnapshot;
  offsetMs: number;
  me: { state: MyTeam; reload: () => void };
}) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const number = me.state.status === "signed-in" ? me.state.number : null;
  const asked = board.inside && board.inside.number === number && board.inside.status === "ASKING" ? board.inside : null;
  const comingNow = board.inside && board.inside.number === number && board.inside.status === "COMING";
  const left = useSecondsLeft(asked?.deadlineAt ?? null, offsetMs);
  const mine = number === null ? undefined : board.teams.find((t) => t.number === number);
  const waitingLate = !!mine && mine.status === "QUEUED" && mine.lane === "LATE";

  async function run(work: () => Promise<unknown>, ok?: string) {
    setBusy(true);
    setMessage(null);
    try {
      await work();
      if (ok) setMessage(ok);
    } catch (e) {
      const wait = (e as TaError & { retryAfterSeconds?: number }).retryAfterSeconds;
      setMessage(describeError(e) + (wait ? ` (${L.tryLater} ${wait} ${L.seconds})` : ""));
    } finally {
      setBusy(false);
    }
  }

  if (me.state.status === "loading") return null;
  if (me.state.status === "anonymous")
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-card px-3 py-2 text-sm">
        <span className="text-muted">{L.signInPrompt}</span>
        <button
          type="button"
          onClick={() => void startStudentSignIn(`/sessions/${sessionId}`)}
          className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-background"
        >
          {L.signIn}
        </button>
      </div>
    );

  const button = "rounded-lg px-4 py-3 text-base font-medium disabled:opacity-40";
  return (
    <div className="space-y-2">
      {number === null ? (
        <form
          className="rounded-lg border border-line bg-card p-3"
          onSubmit={(e) => {
            e.preventDefault();
            void run(async () => {
              await studentPost("/api/v1/discussions/leader/claims", { subjectId, code });
              setCode("");
              me.reload();
            });
          }}
        >
          <p className="text-sm font-medium">{L.codeTitle}</p>
          <p className="text-xs text-muted">{L.codeHelp}</p>
          <div className="mt-2 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={L.codePlaceholder}
              autoComplete="off"
              dir="ltr"
              className="min-w-0 flex-1 rounded-lg border border-line bg-background px-3 py-2 text-base uppercase"
            />
            <button type="submit" disabled={busy || code.trim().length < 4} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background disabled:opacity-40">
              {busy ? L.working : L.bind}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between text-xs text-muted">
          <span>
            {L.bound} {number}
          </span>
          <button type="button" className="text-accent" onClick={() => void studentSignOut().then(me.reload)}>
            {L.signOut}
          </button>
        </div>
      )}

      {asked ? (
        <div className="rounded-xl border border-info bg-info-soft p-3 text-info">
          <p className="text-sm font-medium">{L.yourTurn}</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => void run(() => studentPost(`/api/v1/discussions/leader/sessions/${sessionId}/coming`))}
              className={`${button} bg-ok text-background`}
            >
              {L.coming}
            </button>
            {left !== null ? <span className="text-3xl font-medium tabular-nums">{left}</span> : null}
          </div>
        </div>
      ) : null}
      {comingNow ? <p className="rounded-lg bg-ok-soft px-3 py-2 text-sm text-ok">{L.comingDone}</p> : null}
      {mine?.status === "MISSED" ? (
        <div className="rounded-lg bg-info-soft px-3 py-2 text-info">
          <p className="text-sm">{L.missed}</p>
          <button
            type="button"
            disabled={busy}
            onClick={() => void run(() => studentPost(`/api/v1/discussions/leader/sessions/${sessionId}/re-request`))}
            className={`${button} mt-2 bg-accent text-background`}
          >
            {L.askAgain}
          </button>
        </div>
      ) : null}
      {waitingLate ? <p className="rounded-lg bg-idle-soft px-3 py-2 text-sm text-idle">{L.queued}</p> : null}
      {message ? (
        <p role="alert" className="rounded-lg bg-idle-soft px-3 py-2 text-sm">
          {message}
        </p>
      ) : null}
    </div>
  );
}
