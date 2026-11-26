"use client";

import { t } from "@/lib/strings";
import { useSecondsLeft } from "@/lib/use-live-board";
import type { InsideEntry } from "@/lib/types";

/** The team being asked, coming or inside, above the queue. */
export function InsideCard({
  inside,
  offsetMs,
  mine,
  stats,
}: {
  inside: InsideEntry | null;
  offsetMs: number;
  mine: boolean;
  stats?: Stat[];
}) {
  const left = useSecondsLeft(inside?.deadlineAt ?? null, offsetMs);
  return <InsideView inside={inside} left={left} mine={mine} stats={stats} />;
}

/** One of the board's figures, shown at the right of the banner on a wide screen. */
export type Stat = { label: string; value: number };

/** The card itself, given the seconds left; the landing page shows one as a picture. */
export function InsideView({
  inside,
  left,
  mine,
  stats = [],
}: {
  inside: Pick<InsideEntry, "number" | "status" | "leaderName"> | null;
  left: number | null;
  mine: boolean;
  stats?: Stat[];
}) {
  if (!inside) return <section className="dq-inside dq-inside--empty">{t.live.nobodyInside}</section>;
  const text =
    inside.status === "ASKING"
      ? { title: t.live.asking, hint: t.live.askingHint }
      : inside.status === "COMING"
        ? { title: t.live.coming, hint: t.live.comingHint }
        : { title: t.live.inside, hint: "" };
  return (
    <section aria-live="polite" className={mine ? "dq-inside dq-inside--mine" : "dq-inside"}>
      <div className="dq-inside__top">
        <span className="dq-inside__label">{t.live.insideTitle}</span>
        <span className={inside.status === "INSIDE" ? "dq-badge dq-badge--ok dq-badge--live" : "dq-badge dq-badge--info"}>
          {text.title}
        </span>
      </div>
      <div className="dq-inside__body">
        <div>
          {/* Keyed by the team, so a new team flips in like a board flap. */}
          <p key={inside.number} className="dq-inside__team">
            {t.session.team} {inside.number}
          </p>
          {inside.leaderName ? (
            <p className="dq-inside__name" dir="auto">
              {inside.leaderName}
            </p>
          ) : null}
        </div>
        {left !== null ? (
          <p className="dq-inside__timer">
            <span className="dq-inside__secs">{left}</span>
            <span className="dq-inside__unit">{t.live.secondsLeft}</span>
          </p>
        ) : null}
      </div>
      {text.hint ? <p className="dq-inside__hint">{text.hint}</p> : null}
      {stats.length > 0 ? (
        <div className="dq-inside__stats">
          {stats.map((stat) => (
            <span key={stat.label} className="dq-inside__stat">
              <b>{stat.value}</b>
              {stat.label}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
