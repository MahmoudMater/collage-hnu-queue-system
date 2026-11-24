"use client";

import { useState } from "react";
import { formatTime, minutesOf, shortName, t } from "@/lib/strings";
import type { QueueItem } from "@/lib/types";

/**
 * One queue. Each cell shows the position, the team number and a one-line
 * short name. On a phone a tap opens the full name and slot time; from tablet
 * width they show inline. The late queue never shows a time.
 */
export function QueueColumn({
  title,
  items,
  empty,
  late,
  mine,
}: {
  title: string;
  items: QueueItem[];
  empty: string;
  late: boolean;
  mine: number | null;
}) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section aria-label={title} className="min-w-0">
      <h2 className="mb-2 text-sm font-medium text-muted">
        {title} <span className="tabular-nums">({items.length})</span>
      </h2>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-3 py-4 text-center text-sm text-muted">{empty}</p>
      ) : (
        <ol className="space-y-1.5">
          {items.map((item) => {
            const expanded = open === item.number;
            const isMine = mine === item.number;
            return (
              <li key={item.number}>
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : item.number)}
                  aria-expanded={expanded}
                  className={`w-full rounded-lg border px-3 py-2 text-start ${
                    isMine ? "border-accent bg-accent-soft" : "border-line bg-card"
                  }`}
                >
                  <span className="flex items-baseline gap-2">
                    <span className="w-5 shrink-0 text-xs text-muted tabular-nums">{item.position}</span>
                    <span className="shrink-0 font-medium">
                      {t.session.team} {item.number}
                    </span>
                    {item.leaderName ? (
                      <span className="min-w-0 flex-1 truncate text-sm text-muted sm:hidden">
                        {shortName(item.leaderName)}
                      </span>
                    ) : null}
                    {item.leaderName ? (
                      <span className="hidden min-w-0 flex-1 truncate text-sm text-muted sm:inline">
                        {item.leaderName}
                      </span>
                    ) : null}
                    {!late && item.time ? (
                      <span className="hidden shrink-0 text-xs text-muted sm:inline">{formatTime(item.time)}</span>
                    ) : null}
                  </span>
                  {isMine ? <span className="mt-0.5 block text-xs text-accent">{t.live.mine}</span> : null}
                  {item.reason === "MOVED_IN" ? (
                    <span className="mt-0.5 block text-xs text-info">{t.live.movedIn}</span>
                  ) : null}
                  {expanded ? <Details item={item} late={late} /> : null}
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

function Details({ item, late }: { item: QueueItem; late: boolean }) {
  return (
    <span className="mt-1.5 block space-y-0.5 border-t border-line pt-1.5 text-sm sm:hidden">
      {item.leaderName ? <span className="block">{item.leaderName}</span> : null}
      {!late && item.time ? (
        <span className="block text-muted">
          {t.live.scheduledAt}: {formatTime(item.time)}
        </span>
      ) : null}
      {!late ? <Estimate item={item} /> : null}
    </span>
  );
}

/** A wait estimate for a main-queue team; late and moved-in teams get none. */
function Estimate({ item }: { item: QueueItem }) {
  if (item.etaSeconds === undefined) return null;
  if (item.etaSeconds === 0) return <span className="block text-ok">{t.live.now}</span>;
  const range = item.etaRangeSeconds;
  return (
    <span className="block text-muted">
      {range
        ? `${t.live.expectedBetween} ${minutesOf(range[0])}–${minutesOf(range[1])} ${t.live.minutes}`
        : `${t.live.expectedIn} ${minutesOf(item.etaSeconds)} ${t.live.minutes}`}
    </span>
  );
}
