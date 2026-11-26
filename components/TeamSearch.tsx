"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { formatDate, formatTime, t } from "@/lib/strings";
import { forward } from "./PageTransition";
import type { TeamSearchResult } from "@/lib/types";

type State =
  | { kind: "idle" }
  | { kind: "invalid" }
  | { kind: "searching" }
  | { kind: "failed" }
  | { kind: "done"; found: TeamSearchResult };

/**
 * Finds a team in a subject by the leader's ID, the leader's name or the team
 * number. The server does the matching and never sends an ID back; the query
 * goes in the request body so an ID is not left in a URL.
 */
export function TeamSearch({ subjectId }: { subjectId: string }) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  async function search(event: React.FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    setState({ kind: "searching" });
    try {
      const res = await fetch(`/api/v1/discussions/subjects/${encodeURIComponent(subjectId)}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: query }),
        cache: "no-store",
      });
      if (res.status === 400) setState({ kind: "invalid" });
      else if (!res.ok) setState({ kind: "failed" });
      else setState({ kind: "done", found: (await res.json()) as TeamSearchResult });
    } catch {
      setState({ kind: "failed" });
    }
  }

  return (
    <section className="dq-card dq-card--pad">
      <form onSubmit={search} className="dq-stack dq-stack--sm">
        <label htmlFor={inputId} className="dq-label">
          {t.search.label}
        </label>
        <div className="dq-field">
          <input
            id={inputId}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            placeholder={t.search.placeholder}
            className="dq-input"
          />
          <button type="submit" className="dq-btn dq-btn--primary">
            {t.search.button}
          </button>
        </div>
      </form>
      <div aria-live="polite" className="mt-3 text-sm">
        {state.kind === "invalid" && <p className="text-muted">{t.search.invalid}</p>}
        {state.kind === "searching" && <p className="text-muted">{t.search.searching}</p>}
        {state.kind === "failed" && <p className="text-muted">{t.search.failed}</p>}
        {state.kind === "done" && state.found.results.length === 0 && <p className="text-muted">{t.search.notFound}</p>}
        {state.kind === "done" && state.found.results.length > 0 && (
          <ul className="dq-stack dq-stack--sm">
            {state.found.results.map((h) => (
              <li key={`${h.sessionId}-${h.number}`}>
                <Link href={`/sessions/${h.sessionId}?team=${h.number}`} className="dq-hit" transitionTypes={forward}>
                  <span>
                    <span className="dq-hit__team">
                      {t.session.team} {h.number}
                    </span>
                    {h.leaderName ? (
                      <span className="dq-hit__meta" dir="auto">
                        {h.leaderName}
                      </span>
                    ) : null}
                    <span className="dq-hit__meta">
                      {t.search.foundIn} <span dir="auto">{h.taName}</span> ·{" "}
                      <span className="dq-nowrap">{formatDate(h.date)}</span>
                    </span>
                  </span>
                  <span className="dq-hit__time">{formatTime(h.time)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {state.kind === "done" && state.found.total > state.found.results.length && (
          <p className="mt-2 text-muted">{t.search.more}</p>
        )}
      </div>
    </section>
  );
}
