"use client";

import Link from "next/link";
import { useCallback } from "react";
import { StateMessage } from "@/components/StateMessage";
import { ta, t } from "@/lib/strings";
import { taGet } from "@/lib/ta-client";
import type { TaSubject } from "@/lib/ta-types";
import { useLoad } from "@/lib/use-load";

export function MySubjects() {
  const load = useCallback(() => taGet<{ subjects: TaSubject[] }>("/api/v1/discussions/ta/subjects"), []);
  const { state, reload } = useLoad(load);
  if (state.status === "loading") return <p className="text-sm text-muted">{t.state.loading}</p>;
  if (state.status === "error")
    return (
      <StateMessage title={t.state.errorTitle} body={t.state.errorBody}>
        <button type="button" onClick={reload} className="text-sm text-accent">
          {t.state.retry}
        </button>
      </StateMessage>
    );
  const { subjects } = state.data;
  if (subjects.length === 0) return <StateMessage title={ta.home.empty.title} body={ta.home.empty.body} />;
  return (
    <ul className="space-y-3">
      {subjects.map((s) => (
        <li key={s.id}>
          <Link href={`/ta/subjects/${s.id}`} className="block rounded-xl border border-line bg-card px-4 py-4 text-base font-medium">
            {s.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
