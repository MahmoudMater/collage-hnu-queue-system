"use client";

import { shortName, t } from "@/lib/strings";
import { useSecondsLeft } from "@/lib/use-live-board";
import type { InsideEntry } from "@/lib/types";

/** The team being asked, coming or inside, above the two queues. */
export function InsideCard({
  inside,
  offsetMs,
  mine,
}: {
  inside: InsideEntry | null;
  offsetMs: number;
  mine: boolean;
}) {
  const left = useSecondsLeft(inside?.deadlineAt ?? null, offsetMs);
  if (!inside) {
    return (
      <section className="rounded-xl border border-line bg-card px-4 py-5 text-center text-muted">
        {t.live.nobodyInside}
      </section>
    );
  }
  const text =
    inside.status === "ASKING"
      ? { title: t.live.asking, hint: t.live.askingHint }
      : inside.status === "COMING"
        ? { title: t.live.coming, hint: t.live.comingHint }
        : { title: t.live.inside, hint: "" };
  return (
    <section
      aria-live="polite"
      className={`rounded-xl border px-4 py-4 ${
        inside.status === "INSIDE" ? "border-ok bg-ok-soft text-ok" : "border-info bg-info-soft text-info"
      } ${mine ? "ring-2 ring-accent" : ""}`}
    >
      <p className="text-sm">{text.title}</p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <div>
          <p className="text-3xl font-medium">
            {t.session.team} {inside.number}
          </p>
          {inside.leaderName ? <p className="text-sm">{shortName(inside.leaderName)}</p> : null}
        </div>
        {left !== null ? (
          <p className="text-end">
            <span className="block text-3xl font-medium tabular-nums">{left}</span>
            <span className="text-xs">{t.live.secondsLeft}</span>
          </p>
        ) : null}
      </div>
      {text.hint ? <p className="mt-2 text-xs">{text.hint}</p> : null}
    </section>
  );
}
