"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { StateMessage } from "@/components/StateMessage";
import { ErrorNote } from "@/components/ta/ErrorNote";
import { formatTime, ta, t } from "@/lib/strings";
import { TaError, taGet, taSend } from "@/lib/ta-client";
import type { QueueEntry, QueueView } from "@/lib/ta-types";
import { useSecondsLeft } from "@/lib/use-live-board";

const REFRESH_MS = 2000;

/**
 * Runs a started session. It shows what the server returns and offers only
 * the actions the server says are allowed; it holds no queue rules. After a
 * refused action it shows the server's reason and the state it just fetched.
 */
export function ControlPanel({ sessionId }: { sessionId: string }) {
  const base = `/api/v1/discussions/ta/sessions/${sessionId}`;
  const [view, setView] = useState<QueueView | null>(null);
  const [offsetMs, setOffsetMs] = useState(0);
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const latest = useRef(0);

  const show = useCallback((next: QueueView) => {
    setView(next);
    setOffsetMs(Date.parse(next.serverNow) - Date.now());
  }, []);

  const refresh = useCallback(async () => {
    const ticket = ++latest.current;
    try {
      const next = await taGet<QueueView>(`${base}/queue`);
      if (ticket === latest.current) show(next);
    } catch (e) {
      if (e instanceof TaError && e.status === 403) setForbidden(true);
    }
  }, [base, show]);

  useEffect(() => {
    const first = setTimeout(() => void refresh(), 0);
    const timer = setInterval(() => void refresh(), REFRESH_MS);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [refresh]);

  async function act(path: string) {
    setBusy(true);
    setError(null);
    try {
      latest.current++; // an older refresh must not overwrite this answer
      show(await taSend<QueueView>("POST", `${base}/${path}`, path === "undo" ? {} : undefined));
    } catch (e) {
      setError(e);
      await refresh(); // show the state the server has now
    } finally {
      setBusy(false);
    }
  }

  const active = view?.entries.find((e) => e.id === view.activeEntryId) ?? null;
  const left = useSecondsLeft(
    active ? (active.status === "ASKING" ? active.comingDeadlineAt : active.status === "COMING" ? active.arriveDeadlineAt : null) : null,
    offsetMs,
  );

  if (forbidden) return <StateMessage title={ta.panel.notYours} body="" />;
  if (!view) return <p className="text-sm text-muted">{t.state.loading}</p>;

  const waiting = view.entries.filter((e) => e.status === "QUEUED");
  const main = waiting.filter((e) => e.lane === "MAIN");
  const late = waiting.filter((e) => e.lane === "LATE");
  const done = view.entries.filter((e) => e.status === "DONE").length;
  const missed = view.entries.filter((e) => e.status === "MISSED").length;
  const allowed = view.allowed;
  const button = "rounded-lg px-4 py-3 text-base font-medium disabled:opacity-40";

  return (
    <section className="space-y-4" aria-label={ta.panel.title}>
      <ErrorNote error={error} />
      {error ? <p className="text-xs text-muted">{ta.panel.refreshed}</p> : null}

      <div className="rounded-xl border border-line bg-card p-4">
        {active ? (
          <>
            <p className="text-sm text-muted">
              {active.status === "ASKING" ? ta.panel.asking : active.status === "COMING" ? ta.panel.coming : ta.panel.inside}
            </p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <div>
                <p className="text-3xl font-medium">
                  {t.session.team} {active.number}
                </p>
                <p className="text-sm text-muted">{active.leaderName}</p>
              </div>
              {left !== null ? (
                <p className="text-end">
                  <span className="block text-3xl font-medium tabular-nums">{left}</span>
                  <span className="text-xs text-muted">{ta.panel.secondsLeft}</span>
                </p>
              ) : null}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {allowed.arrived ? (
                <button type="button" disabled={busy} onClick={() => act(`entries/${active.id}/arrived`)} className={`${button} bg-ok text-background`}>
                  {ta.panel.arrived}
                </button>
              ) : null}
              {allowed.finish ? (
                <button type="button" disabled={busy} onClick={() => act(`entries/${active.id}/finish`)} className={`${button} bg-ok text-background`}>
                  {ta.panel.finish}
                </button>
              ) : null}
              {allowed.absent ? (
                <button type="button" disabled={busy} onClick={() => act(`entries/${active.id}/absent`)} className={`${button} border border-line`}>
                  {ta.panel.absent}
                </button>
              ) : null}
            </div>
          </>
        ) : (
          <p className="text-muted">{ta.panel.nobody}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={busy || !allowed.next} onClick={() => act("next")} className={`${button} flex-1 bg-accent text-background`}>
          {busy ? ta.panel.working : ta.panel.next}
        </button>
        <button type="button" disabled={busy || !allowed.undo} onClick={() => act("undo")} className={`${button} border border-line`}>
          {ta.panel.undo}
        </button>
      </div>

      <p className="text-sm text-muted">
        {ta.panel.done}: {done} · {ta.panel.missed}: {missed}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Waiting title={`${ta.panel.main} (${main.length})`} entries={main} busy={busy} onRemove={(id) => act(`entries/${id}/remove`)} />
        <Waiting title={`${ta.panel.late} (${late.length})`} entries={late} busy={busy} onRemove={(id) => act(`entries/${id}/remove`)} />
      </div>
    </section>
  );
}

function Waiting({
  title,
  entries,
  busy,
  onRemove,
}: {
  title: string;
  entries: QueueEntry[];
  busy: boolean;
  onRemove: (entryId: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-muted">{title}</h3>
      {entries.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line px-3 py-3 text-center text-sm text-muted">{ta.panel.empty}</p>
      ) : (
        <ol className="space-y-1.5">
          {entries.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-2 rounded-lg border border-line bg-card px-3 py-2">
              <span className="min-w-0">
                <span className="font-medium">
                  {t.session.team} {e.number}
                </span>
                <span className="block truncate text-xs text-muted">
                  {e.leaderName}
                  {e.time && e.lane === "MAIN" ? ` · ${formatTime(e.time)}` : ""}
                </span>
              </span>
              {e.canRemove ? (
                <button type="button" disabled={busy} onClick={() => onRemove(e.id)} className="shrink-0 text-sm text-danger disabled:opacity-40">
                  {ta.panel.remove}
                </button>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
