"use client";

import { useCallback, useEffect, useState } from "react";
import { studentFetch } from "./student-client";
import { AuthRequired } from "./ta-client";

export type MyTeam =
  | { status: "loading" }
  | { status: "anonymous" }
  | { status: "signed-in"; number: number | null };

/** Whether a leader is signed in, and the number of the team his account leads in this subject. */
export function useMyTeam(subjectId: string) {
  const [state, setState] = useState<MyTeam>({ status: "loading" });
  const [round, setRound] = useState(0);
  useEffect(() => {
    let alive = true;
    studentFetch<{ teams: { subjectId: string; number: number }[] }>("/api/v1/discussions/leader/teams").then(
      (r) => alive && setState({ status: "signed-in", number: r.teams.find((x) => x.subjectId === subjectId)?.number ?? null }),
      (e) => alive && setState(e instanceof AuthRequired ? { status: "anonymous" } : { status: "anonymous" }),
    );
    return () => {
      alive = false;
    };
  }, [subjectId, round]);
  const reload = useCallback(() => setRound((n) => n + 1), []);
  return { state, reload };
}
