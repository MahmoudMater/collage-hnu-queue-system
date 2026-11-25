"use client";

import { useCallback, useState } from "react";
import { ErrorNote } from "@/components/ta/ErrorNote";
import { ta, t } from "@/lib/strings";
import { taGet, taSend } from "@/lib/ta-client";
import { useLoad } from "@/lib/use-load";

interface TeamRow {
  teamId: string;
  number: number;
  leaderName: string;
  claimCode: string | null;
  boundTo: { userId: string; displayName: string; boundAt: string | null } | null;
}

/** The TA's teams with their claim codes and the account bound to each; Reset unbinds one. */
export function TeamsTable({ sessionId }: { sessionId: string }) {
  const base = `/api/v1/discussions/ta/sessions/${sessionId}`;
  const load = useCallback(() => taGet<{ teams: TeamRow[] }>(`${base}/teams`), [base]);
  const { state, replace } = useLoad(load);
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function reset(team: TeamRow) {
    if (!window.confirm(ta.codes.confirm)) return;
    setBusy(team.teamId);
    setError(null);
    try {
      replace(await taSend<{ teams: TeamRow[] }>("POST", `${base}/teams/${team.teamId}/reset-binding`));
    } catch (e) {
      setError(e);
    } finally {
      setBusy(null);
    }
  }

  if (state.status === "loading") return <p className="text-sm text-muted">{t.state.loading}</p>;
  if (state.status === "error") return <p className="text-sm text-muted">{t.state.errorBody}</p>;
  const teams = state.data.teams;
  return (
    <section>
      <h2 className="text-sm font-medium text-muted">{ta.codes.title}</h2>
      <p className="mt-1 mb-2 text-xs text-muted">{ta.codes.help}</p>
      <a
        href={`/api/v1/discussions/sessions/${sessionId}/sheet`}
        target="_blank"
        rel="noopener"
        className="mb-2 inline-block text-sm text-accent"
      >
        {ta.codes.sheet}
      </a>
      <ErrorNote error={error} />
      {teams.length === 0 ? (
        <p className="text-sm text-muted">{ta.codes.empty}</p>
      ) : (
        <ul className="overflow-hidden rounded-xl border border-line bg-card">
          {teams.map((team) => (
            <li key={team.teamId} className="flex items-center justify-between gap-3 border-b border-line px-3 py-2 last:border-b-0">
              <div className="min-w-0">
                <p className="flex items-baseline gap-2">
                  <span className="font-medium">
                    {ta.codes.team} {team.number}
                  </span>
                  <span dir="ltr" className="font-mono text-sm tracking-wider">
                    {team.claimCode ?? ""}
                  </span>
                </p>
                <p className="truncate text-xs text-muted">
                  {team.boundTo ? `${ta.codes.account}: ${team.boundTo.displayName}` : ta.codes.none}
                </p>
              </div>
              {team.boundTo ? (
                <button
                  type="button"
                  disabled={busy === team.teamId}
                  onClick={() => void reset(team)}
                  className="shrink-0 text-sm text-danger disabled:opacity-40"
                >
                  {ta.codes.reset}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
