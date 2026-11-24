"use client";

import Link from "next/link";
import { use, useCallback, useState } from "react";
import { StateMessage } from "@/components/StateMessage";
import { StatusBadge } from "@/components/StatusBadge";
import { ErrorNote } from "@/components/ta/ErrorNote";
import { IssueList } from "@/components/ta/IssueList";
import { RowForm } from "@/components/ta/RowForm";
import { dayLabel, formatDate, formatTime, ta, t } from "@/lib/strings";
import { TaError, taGet, taSend, taUpload } from "@/lib/ta-client";
import type { ParseIssue, RowInput, TaSession, UploadResult } from "@/lib/ta-types";
import { useLoad } from "@/lib/use-load";
import type { StatusWord } from "@/lib/types";

const statusWord = (s: TaSession["status"]): StatusWord =>
  s === "STARTED" ? "RUNNING" : s === "ENDED" ? "ENDED" : "NOT_STARTED";

/** The TA's review screen: claim the name, fix the table, confirm. No rule lives here; the server decides and explains. */
export function SessionReview({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const base = `/api/v1/discussions/ta/sessions/${sessionId}`;
  const load = useCallback(() => taGet<TaSession>(base), [base]);
  const { state, reload, replace } = useLoad(load);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);

  async function act(run: () => Promise<TaSession>, after?: () => void) {
    setBusy(true);
    setError(null);
    try {
      replace(await run());
      after?.();
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  }

  if (state.status === "loading") return <p className="text-sm text-muted">{t.state.loading}</p>;
  if (state.status === "error") {
    if (state.error instanceof TaError && state.error.status === 403)
      return <StateMessage title={ta.session.claimedBy} body="" />;
    return (
      <StateMessage title={t.state.errorTitle} body={t.state.errorBody}>
        <button type="button" onClick={reload} className="text-sm text-accent">
          {t.state.retry}
        </button>
      </StateMessage>
    );
  }
  const s = state.data;
  const editable = s.status === "DRAFT" || s.status === "CONFIRMED";
  const blocking = s.issues.filter((i) => i.severity === "blocking");

  const applySuggestion = (issue: ParseIssue) => {
    const row = s.table.find((r) => r.team === issue.team);
    if (row && issue.suggestedTime)
      act(() => taSend<TaSession>("PATCH", `${base}/rows/${row.rowId}`, { time: issue.suggestedTime }));
  };

  async function replaceTable(e: React.FormEvent) {
    e.preventDefault();
    if (!newFile) return;
    setBusy(true);
    setError(null);
    try {
      const upload = await taUpload<UploadResult>(s.subjectId, newFile);
      replace(await taSend<TaSession>("POST", `${base}/table`, { uploadId: upload.uploadId }));
      setNewFile(null);
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/ta/subjects/${s.subjectId}`} className="text-sm text-accent">
          {ta.session.back}
        </Link>
        <div className="mt-2 flex items-start justify-between gap-3">
          <h1 dir="ltr" className="text-2xl font-medium">
            {s.taName}
          </h1>
          <StatusBadge status={statusWord(s.status)} />
        </div>
        {s.label ? <p className="mt-0.5 text-sm text-muted">{s.label}</p> : null}
        <p className="mt-1 text-sm text-muted">{formatDate(s.sessionDate)}</p>
      </div>

      {!s.claimed ? (
        <section className="rounded-xl border border-line bg-card p-4">
          <h2 className="text-base font-medium">{ta.session.claimTitle}</h2>
          <p className="mt-1 text-sm text-muted">{ta.session.claimBody}</p>
          <button
            type="button"
            onClick={() => act(() => taSend<TaSession>("POST", `${base}/claim`))}
            className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background"
          >
            {busy ? "…" : ta.session.claim}
          </button>
        </section>
      ) : (
        <p className="text-sm text-muted">{s.mine ? ta.session.claimedByMe : ta.session.claimedBy}</p>
      )}

      {s.status === "CONFIRMED" ? (
        <p className="rounded-lg bg-ok-soft px-3 py-2 text-sm text-ok">
          {ta.session.confirmedNote}{" "}
          <Link href={`/sessions/${s.id}`} className="underline">
            {ta.session.openPublic}
          </Link>
        </p>
      ) : s.status === "DRAFT" ? (
        <p className="rounded-lg bg-idle-soft px-3 py-2 text-sm text-idle">{ta.session.draftNote}</p>
      ) : null}
      {s.unpublishedChanges ? (
        <p className="rounded-lg bg-info-soft px-3 py-2 text-sm text-info">{ta.session.unpublished}</p>
      ) : null}

      <ErrorNote error={error} />

      <section>
        <h2 className="mb-2 text-sm font-medium text-muted">{ta.session.issues}</h2>
        <IssueList issues={s.issues} onApply={s.mine ? applySuggestion : undefined} />
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted">
            {ta.session.table} ({s.counts.rows})
          </h2>
          {s.mine && editable && editing !== "new" ? (
            <button type="button" onClick={() => setEditing("new")} className="text-sm text-accent">
              {ta.session.addRow}
            </button>
          ) : null}
        </div>
        {editing === "new" ? (
          <div className="mb-3">
            <RowForm
              busy={busy}
              onCancel={() => setEditing(null)}
              onSave={(input: RowInput) =>
                act(() => taSend<TaSession>("POST", `${base}/rows`, input), () => setEditing(null))
              }
            />
          </div>
        ) : null}
        <ol className="overflow-hidden rounded-xl border border-line bg-card">
          {s.table.map((row) => (
            <li key={row.rowId} className="border-b border-line px-4 py-3 last:border-b-0">
              {editing === row.rowId ? (
                <RowForm
                  initial={row}
                  busy={busy}
                  onCancel={() => setEditing(null)}
                  onSave={(input: RowInput) =>
                    act(() => taSend<TaSession>("PATCH", `${base}/rows/${row.rowId}`, input), () => setEditing(null))
                  }
                />
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-base font-medium">
                      {ta.session.team} {row.team}
                    </span>
                    <span className="block text-sm text-muted">{row.leaderName}</span>
                    <span className="block text-xs text-muted">
                      {dayLabel[row.day] ?? row.day} · {formatTime(row.time)}
                    </span>
                  </div>
                  {s.mine && editable ? (
                    <div className="flex shrink-0 gap-3 text-sm">
                      <button type="button" className="text-accent" onClick={() => setEditing(row.rowId)}>
                        {ta.session.edit}
                      </button>
                      <button
                        type="button"
                        className="text-danger"
                        onClick={() => act(() => taSend<TaSession>("DELETE", `${base}/rows/${row.rowId}`))}
                      >
                        {ta.session.remove}
                      </button>
                    </div>
                  ) : null}
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      {s.mine && editable ? (
        <>
          <section className="rounded-xl border border-line bg-card p-4">
            <h2 className="text-base font-medium">{ta.session.replaceTitle}</h2>
            <p className="mt-1 text-sm text-muted">{ta.session.replaceHelp}</p>
            <form onSubmit={replaceTable} className="mt-3 space-y-3">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setNewFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm"
              />
              <button type="submit" className="rounded-lg border border-line px-4 py-2 text-sm">
                {busy ? "…" : ta.session.replace}
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-line bg-card p-4">
            <p className="text-sm text-muted">{ta.session.confirmHelp}</p>
            {blocking.length > 0 ? (
              <p className="mt-2 text-sm text-danger">
                {ta.session.blockingLeft} {blocking.length}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => act(() => taSend<TaSession>("POST", `${base}/confirm`))}
              className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background"
            >
              {busy ? ta.session.confirming : ta.session.confirm}
            </button>
          </section>
        </>
      ) : null}
    </div>
  );
}
