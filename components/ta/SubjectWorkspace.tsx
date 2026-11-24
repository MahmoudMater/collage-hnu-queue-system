"use client";

import Link from "next/link";
import { use, useCallback, useState } from "react";
import { StateMessage } from "@/components/StateMessage";
import { StatusBadge } from "@/components/StatusBadge";
import { ErrorNote } from "@/components/ta/ErrorNote";
import { IssueList } from "@/components/ta/IssueList";
import { formatDate, ta, t } from "@/lib/strings";
import { taGet, taSend, taUpload } from "@/lib/ta-client";
import type { TaSessionSummary, TaSubject, UploadResult } from "@/lib/ta-types";
import { useLoad } from "@/lib/use-load";
import type { StatusWord } from "@/lib/types";

const statusWord = (s: TaSessionSummary["status"]): StatusWord =>
  s === "STARTED" ? "RUNNING" : s === "ENDED" ? "ENDED" : "NOT_STARTED";

export function SubjectWorkspace({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = use(params);
  const load = useCallback(async () => {
    const base = `/api/v1/discussions/ta`;
    const [subjects, sessions] = await Promise.all([
      taGet<{ subjects: TaSubject[] }>(`${base}/subjects`),
      taGet<{ sessions: TaSessionSummary[] }>(`${base}/subjects/${subjectId}/sessions`),
    ]);
    return { subject: subjects.subjects.find((s) => s.id === subjectId) ?? null, sessions: sessions.sessions };
  }, [subjectId]);
  const { state, reload } = useLoad(load);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [date, setDate] = useState("");
  const [label, setLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<unknown>(null);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!file) {
      setError(new Error("اختار ملف الأول."));
      return;
    }
    setUploading(true);
    try {
      setResult(await taUpload<UploadResult>(subjectId, file));
    } catch (err) {
      setError(err);
    } finally {
      setUploading(false);
    }
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!result) return;
    setError(null);
    setCreating(true);
    try {
      await taSend("POST", `/api/v1/discussions/ta/subjects/${subjectId}/sessions`, {
        uploadId: result.uploadId,
        ...(date ? { date } : {}),
        ...(label.trim() ? { label: label.trim() } : {}),
      });
      setResult(null);
      setFile(null);
      setDate("");
      setLabel("");
      reload();
    } catch (err) {
      setError(err);
    } finally {
      setCreating(false);
    }
  }

  if (state.status === "loading") return <p className="text-sm text-muted">{t.state.loading}</p>;
  if (state.status === "error")
    return (
      <StateMessage title={t.state.errorTitle} body={t.state.errorBody}>
        <button type="button" onClick={reload} className="text-sm text-accent">
          {t.state.retry}
        </button>
      </StateMessage>
    );
  const { subject, sessions } = state.data;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/ta" className="text-sm text-accent">
          {ta.subject.back}
        </Link>
        <h1 className="mt-2 text-2xl font-medium">{subject?.name ?? ""}</h1>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-medium text-muted">{ta.subject.sessions}</h2>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted">{ta.subject.noSessions}</p>
        ) : (
          <ul className="space-y-3">
            {sessions.map((s) => (
              <li key={s.id}>
                <Link href={`/ta/sessions/${s.id}`} className="block rounded-xl border border-line bg-card px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-base font-medium">{s.taName}</span>
                    <StatusBadge status={statusWord(s.status)} />
                  </div>
                  {s.label ? <p className="mt-0.5 text-sm text-muted">{s.label}</p> : null}
                  <p className="mt-2 text-sm text-muted">
                    {formatDate(s.sessionDate)} · {s.rows} {ta.subject.rows} ·{" "}
                    {!s.claimed ? ta.subject.unclaimed : s.mine ? ta.subject.mine : ta.subject.other}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-line bg-card p-4">
        <h2 className="text-base font-medium">{ta.subject.uploadTitle}</h2>
        <p className="mt-1 text-sm text-muted">{ta.subject.uploadHelp}</p>
        <form onSubmit={upload} className="mt-3 space-y-3">
          <input
            type="file"
            accept="application/pdf"
            aria-label={ta.subject.chooseFile}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm"
          />
          <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background">
            {uploading ? ta.subject.uploading : ta.subject.upload}
          </button>
        </form>
        <div className="mt-3">
          <ErrorNote error={error} />
        </div>

        {result ? (
          <div className="mt-4 space-y-3">
            {result.duplicate ? <p className="text-sm text-muted">{ta.subject.duplicate}</p> : null}
            <h3 className="text-sm font-medium">{ta.subject.report}</h3>
            <p className="text-sm text-muted">
              {result.report.counts.rows} {ta.subject.rows} · {result.report.counts.tables} {ta.subject.tables} ·{" "}
              {result.report.counts.blocking} {ta.subject.blocking} · {result.report.counts.warnings} {ta.subject.warnings}
            </p>
            <p className="text-sm">
              <span className="text-muted">{ta.subject.namesFound}: </span>
              <span dir="ltr">{result.report.tables.map((x) => x.taName).join(" · ")}</span>
            </p>
            <IssueList issues={result.report.issues.filter((i) => i.severity === "blocking")} />
            <form onSubmit={create} className="space-y-3 border-t border-line pt-3">
              <h3 className="text-sm font-medium">{ta.subject.createTitle}</h3>
              <label className="block text-sm">
                {ta.subject.date}
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-line bg-background px-3 py-2"
                />
                <span className="text-xs text-muted">{ta.subject.dateHelp}</span>
              </label>
              <label className="block text-sm">
                {ta.subject.label}
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder={ta.subject.labelPlaceholder}
                  className="mt-1 block w-full rounded-lg border border-line bg-background px-3 py-2"
                />
              </label>
              <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background">
                {creating ? ta.subject.creating : ta.subject.create}
              </button>
            </form>
          </div>
        ) : null}
      </section>
    </div>
  );
}
