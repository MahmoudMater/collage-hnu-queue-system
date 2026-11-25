"use client";

import { useCallback, useState } from "react";
import { ErrorNote } from "@/components/ta/ErrorNote";
import { formatDate, ta, t } from "@/lib/strings";
import { taGet, taSend } from "@/lib/ta-client";
import { useLoad } from "@/lib/use-load";

interface Target {
  sessionId: string;
  taName: string;
  label: string | null;
  date: string;
  status: string;
  mainQueueLength: number;
}

/** Pick the session to move a team to. The server's refusal and the target's queue length are shown as they come. */
export function MoveDialog({
  sessionId,
  entryId,
  teamNumber,
  onDone,
  onCancel,
}: {
  sessionId: string;
  entryId: string;
  teamNumber: number;
  onDone: () => void;
  onCancel: () => void;
}) {
  const base = `/api/v1/discussions/ta/sessions/${sessionId}`;
  const load = useCallback(() => taGet<{ targets: Target[] }>(`${base}/move-targets`), [base]);
  const { state } = useLoad(load);
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function move(target: Target) {
    setBusy(true);
    setError(null);
    try {
      const res = await taSend<{ target: { taName: string; mainQueueLength: number } }>("POST", `${base}/entries/${entryId}/move`, {
        targetSessionId: target.sessionId,
      });
      setResult(`${ta.panel.moveDone} ${res.target.taName}. ${ta.panel.moveQueue} ${res.target.mainQueueLength}. ${ta.panel.moveWarn}`);
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div role="dialog" aria-label={ta.panel.moveTitle} className="rounded-xl border border-line bg-card p-4">
      <p className="font-medium">
        {ta.panel.moveTitle} — {t.session.team} {teamNumber}
      </p>
      <p className="mt-1 text-xs text-muted">{ta.panel.moveHelp}</p>
      <div className="mt-3 space-y-2">
        {state.status === "loading" ? <p className="text-sm text-muted">{t.state.loading}</p> : null}
        {state.status === "error" ? <p className="text-sm text-muted">{t.state.errorBody}</p> : null}
        {state.status === "ready" && state.data.targets.length === 0 ? <p className="text-sm text-muted">{ta.panel.moveNone}</p> : null}
        {state.status === "ready" && !result
          ? state.data.targets.map((target) => (
              <button
                key={target.sessionId}
                type="button"
                disabled={busy}
                onClick={() => void move(target)}
                className="block w-full rounded-lg border border-line px-3 py-2 text-start disabled:opacity-40"
              >
                <span className="font-medium" dir="ltr">
                  {target.taName}
                </span>
                <span className="block text-xs text-muted">
                  {formatDate(target.date)} · {ta.panel.moveQueue} {target.mainQueueLength} · {ta.panel.moveWarn}
                </span>
              </button>
            ))
          : null}
      </div>
      <ErrorNote error={error} />
      {result ? <p className="mt-2 rounded-lg bg-ok-soft px-3 py-2 text-sm text-ok">{result}</p> : null}
      <button type="button" onClick={result ? onDone : onCancel} className="mt-3 text-sm text-accent">
        {result ? ta.panel.ok : ta.panel.cancel}
      </button>
    </div>
  );
}
