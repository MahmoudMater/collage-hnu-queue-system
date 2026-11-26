"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { formatDate, formatTime, t } from "@/lib/strings";
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
    <section className="rounded-xl border border-line bg-card p-4">
      <form onSubmit={search} className="flex flex-col gap-2">
        <label htmlFor={inputId} className="text-sm font-medium">
          {t.search.label}
        </label>
        <div className="flex gap-2">
          <input
            id={inputId}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            placeholder={t.search.placeholder}
            className="min-w-0 flex-1 rounded-lg border border-line bg-background px-3 py-2 text-base"
          />
          <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background">
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
          <ul className="space-y-2">
            {state.found.results.map((h) => (
              <li key={`${h.sessionId}-${h.number}`}>
                <Link
                  href={`/sessions/${h.sessionId}?team=${h.number}`}
                  className="flex items-center justify-between gap-3 rounded-lg bg-accent-soft px-3 py-2 text-accent"
                >
                  <span className="min-w-0">
                    <span className="font-medium">
                      {t.session.team} {h.number}
                    </span>
                    {h.leaderName ? <span className="block truncate text-xs">{h.leaderName}</span> : null}
                    <span className="block text-xs">
                      {t.search.foundIn} <span dir="ltr">{h.taName}</span> · {formatDate(h.date)}
                    </span>
                  </span>
                  <span className="shrink-0 font-medium">{formatTime(h.time)}</span>
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
