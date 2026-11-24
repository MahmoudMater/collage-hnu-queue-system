"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { clientGet } from "@/lib/api";
import { formatTime, t } from "@/lib/strings";
import type { SessionSnapshot } from "@/lib/types";

interface Hit {
  sessionId: string;
  taName: string;
  time: string | null;
}

type State =
  | { kind: "idle" }
  | { kind: "invalid" }
  | { kind: "searching" }
  | { kind: "failed" }
  | { kind: "done"; hits: Hit[] };

/**
 * Finds a team number across the cards of a subject. It only reads the public
 * schedules; it holds no rules about teams or sessions.
 */
export function TeamSearch({ sessions }: { sessions: { id: string; taName: string }[] }) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  async function search(event: React.FormEvent) {
    event.preventDefault();
    const number = Number(query.trim());
    if (!/^\d{1,4}$/.test(query.trim()) || number < 1) {
      setState({ kind: "invalid" });
      return;
    }
    setState({ kind: "searching" });
    const results = await Promise.allSettled(
      sessions.map((s) => clientGet<SessionSnapshot>(`/api/v1/discussions/sessions/${s.id}`)),
    );
    if (results.length > 0 && results.every((r) => r.status === "rejected")) {
      setState({ kind: "failed" });
      return;
    }
    const hits: Hit[] = [];
    results.forEach((r, i) => {
      if (r.status !== "fulfilled") return;
      const team = r.value.teams.find((x) => x.number === number);
      if (team) hits.push({ sessionId: sessions[i].id, taName: sessions[i].taName, time: team.time });
    });
    setState({ kind: "done", hits });
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
            inputMode="numeric"
            autoComplete="off"
            placeholder={t.search.placeholder}
            className="min-w-0 flex-1 rounded-lg border border-line bg-background px-3 py-2 text-base"
          />
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background"
          >
            {t.search.button}
          </button>
        </div>
      </form>
      <div aria-live="polite" className="mt-3 text-sm">
        {state.kind === "invalid" && <p className="text-muted">{t.search.invalid}</p>}
        {state.kind === "searching" && <p className="text-muted">{t.search.searching}</p>}
        {state.kind === "failed" && <p className="text-muted">{t.search.failed}</p>}
        {state.kind === "done" && state.hits.length === 0 && (
          <p className="text-muted">{t.search.notFound}</p>
        )}
        {state.kind === "done" && state.hits.length > 0 && (
          <ul className="space-y-2">
            {state.hits.map((h) => (
              <li key={h.sessionId}>
                <Link
                  href={`/sessions/${h.sessionId}`}
                  className="flex items-center justify-between rounded-lg bg-accent-soft px-3 py-2 text-accent"
                >
                  <span>
                    {t.search.foundIn} {h.taName}
                  </span>
                  <span className="font-medium">{formatTime(h.time)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
