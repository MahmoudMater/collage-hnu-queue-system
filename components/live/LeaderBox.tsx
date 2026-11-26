"use client";

import { useState } from "react";
import { startStudentSignIn, studentSignOut } from "@/lib/auth";
import { describeError } from "@/lib/describe-error";
import { leaderText as L } from "@/lib/strings";
import { studentPost } from "@/lib/student-client";
import { RequestError } from "@/lib/request-error";
import type { LiveSnapshot } from "@/lib/types";
import { useSecondsLeft } from "@/lib/use-live-board";
import type { MyTeam } from "@/lib/use-my-team";

/**
 * The team leader's part of the Your turn card: what needs action now (the
 * call, a missed slot), which the card lifts to its top, and the account at
 * its foot (sign in, bind a team with its code, sign out).
 */
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
      const wait = (e as RequestError & { retryAfterSeconds?: number }).retryAfterSeconds;
      setMessage(describeError(e) + (wait ? ` (${L.tryLater} ${wait} ${L.seconds})` : ""));
    } finally {
      setBusy(false);
    }
  }

  if (me.state.status === "loading") return null;
  if (me.state.status === "anonymous")
    return (
      <div className="dq-turn__foot dq-turn__row">
        <span>{L.signInPrompt}</span>
        <button
          type="button"
          onClick={() => void startStudentSignIn(`/sessions/${sessionId}`)}
          className="dq-btn dq-btn--quiet"
        >
          {L.signIn}
        </button>
      </div>
    );

  const missed = mine?.status === "MISSED";
  return (
    <>
      {asked || comingNow || missed || waitingLate || message ? (
        <div className="dq-turn__urgent">
          {asked ? (
            <div className="dq-call">
              <p className="dq-call__text">{L.yourTurn}</p>
              <div className="dq-call__row">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void run(() => studentPost(`/api/v1/discussions/leader/sessions/${sessionId}/coming`))}
                  className="dq-btn dq-btn--go dq-btn--lg"
                >
                  {L.coming}
                </button>
                {left !== null ? <span className="dq-call__secs">{left}</span> : null}
              </div>
            </div>
          ) : null}
          {comingNow ? <p className="dq-notice dq-notice--ok">{L.comingDone}</p> : null}
          {missed ? (
            <div className="dq-notice dq-notice--info">
              <p>{L.missed}</p>
              <button
                type="button"
                disabled={busy}
                onClick={() => void run(() => studentPost(`/api/v1/discussions/leader/sessions/${sessionId}/re-request`))}
                className="dq-btn dq-btn--primary mt-2"
              >
                {L.askAgain}
              </button>
            </div>
          ) : null}
          {waitingLate ? <p className="dq-notice">{L.queued}</p> : null}
          {message ? (
            <p role="alert" className="dq-notice">
              {message}
            </p>
          ) : null}
        </div>
      ) : null}

      {number === null ? (
        <form
          className="dq-turn__foot"
          onSubmit={(e) => {
            e.preventDefault();
            void run(async () => {
              await studentPost("/api/v1/discussions/leader/claims", { subjectId, code });
              setCode("");
              me.reload();
            });
          }}
        >
          <p className="dq-label">{L.codeTitle}</p>
          <p className="dq-help">{L.codeHelp}</p>
          <div className="dq-field mt-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={L.codePlaceholder}
              aria-label={L.codeTitle}
              autoComplete="off"
              dir="ltr"
              className="dq-input dq-input--code"
            />
            <button type="submit" disabled={busy || code.trim().length < 4} className="dq-btn dq-btn--primary">
              {busy ? L.working : L.bind}
            </button>
          </div>
        </form>
      ) : (
        <div className="dq-turn__foot dq-turn__row">
          <span>
            {L.bound} {number}
          </span>
          <button type="button" className="dq-btn dq-btn--quiet" onClick={() => void studentSignOut().then(me.reload)}>
            {L.signOut}
          </button>
        </div>
      )}
    </>
  );
}
