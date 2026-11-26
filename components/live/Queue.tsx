"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { formatTime, minutesOf, t, teamsCount } from "@/lib/strings";
import type { QueueItem } from "@/lib/types";

type Tab = "main" | "late";

/** Teams on one page of a queue: a long queue is paged, never one endless list. */
const PAGE_SIZE = 8;

/**
 * The queue of a live discussion: one list of full-width rows. When the late
 * queue is in use, two tabs sit above it, each with its count, and the tab
 * that holds the student's own team opens first and is marked "You". Tapping
 * a tab keeps it open from then on.
 */
export function Queue({
  main,
  late,
  lateOn,
  mine,
}: {
  main: QueueItem[];
  late: QueueItem[];
  /** False when no team can be in the late queue: the tabs are left out. */
  lateOn: boolean;
  mine: number | null;
}) {
  const id = useId();
  const [picked, setPicked] = useState<Tab | null>(null);
  const tabRefs = useRef<Partial<Record<Tab, HTMLButtonElement | null>>>({});

  if (!lateOn) {
    return (
      <section className="dq-queue" aria-label={t.live.mainTitle}>
        <h2 className="dq-queue__title dq-overline">
          {t.live.mainTitle} <span className="dq-num">({main.length})</span>
        </h2>
        <QueueList items={main} late={false} mine={mine} empty={t.live.emptyMain} />
      </section>
    );
  }

  const tabs = [
    { key: "main" as const, label: t.live.tabMain, items: main, empty: t.live.emptyMain },
    { key: "late" as const, label: t.live.tabLate, items: late, empty: t.live.emptyLate },
  ];
  const has = (items: QueueItem[]) => mine !== null && items.some((q) => q.number === mine);
  const tab = picked ?? (has(late) ? "late" : "main");
  const current = tabs.find((x) => x.key === tab) ?? tabs[0];

  return (
    <section className="dq-queue">
      <div
        className="dq-tabs"
        role="tablist"
        aria-label={t.live.queues}
        onKeyDown={(e) => {
          if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
          const other: Tab = tab === "main" ? "late" : "main";
          setPicked(other);
          tabRefs.current[other]?.focus();
        }}
      >
        {tabs.map(({ key, label, items }) => (
          <button
            key={key}
            ref={(el) => {
              tabRefs.current[key] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${key}`}
            aria-controls={`${id}-panel`}
            aria-selected={tab === key}
            aria-label={`${label} ${t.live.tabQueue}, ${teamsCount(items.length)}${has(items) ? `, ${t.live.you}` : ""}`}
            tabIndex={tab === key ? 0 : -1}
            className="dq-tab"
            onClick={() => setPicked(key)}
          >
            <span>
              {label}
              <span className="dq-tab__w"> {t.live.tabQueue}</span>
            </span>
            <span className="dq-tab__n">{items.length}</span>
            {has(items) ? <span className="dq-you">{t.live.you}</span> : null}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${tab}`}>
        <QueueList key={tab} items={current.items} late={tab === "late"} mine={mine} empty={current.empty} />
      </div>
    </section>
  );
}

/**
 * The rows of one queue. A row's place sets its state: 1 is next, 2 and 3 are
 * soon, the rest wait. The late queue never shows a time or an estimate.
 * When the queue moves on, each row slides to its new place. A long queue
 * shows eight teams at a time, with a pager under it.
 */
export function QueueList({
  items: all,
  late,
  mine,
  empty,
}: {
  items: QueueItem[];
  late: boolean;
  mine: number | null;
  empty: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  // The page that holds the student's own team shows first; paging by hand keeps the choice.
  const [pickedPage, setPickedPage] = useState<number | null>(null);
  const pages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const mineAt = mine === null ? -1 : all.findIndex((q) => q.number === mine);
  const minePage = mineAt < 0 ? 0 : Math.floor(mineAt / PAGE_SIZE);
  const page = Math.min(pickedPage ?? minePage, pages - 1);
  const items = all.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const goTo = (next: number | null) => {
    setPickedPage(next);
    setOpen(null);
  };
  const list = useRef<HTMLOListElement>(null);
  const tops = useRef(new Map<string, number>());
  const lastOrder = useRef("");
  const order = items.map((q) => q.number).join(",");

  // Measured after every render (an opened row moves the ones under it), animated only when the order changed.
  useLayoutEffect(() => {
    const el = list.current;
    const moved = lastOrder.current !== "" && lastOrder.current !== order;
    lastOrder.current = order;
    const before = tops.current;
    const now = new Map<string, number>();
    tops.current = now;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (const li of Array.from(el.children) as HTMLElement[]) {
      const key = li.dataset.team ?? "";
      const top = li.offsetTop;
      now.set(key, top);
      if (!moved || still || typeof li.animate !== "function") continue;
      const was = before.get(key);
      if (was === undefined) li.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
      else if (was !== top)
        li.animate([{ transform: `translateY(${was - top}px)` }, { transform: "none" }], {
          duration: 400,
          easing: "cubic-bezier(.2,.8,.2,1)",
        });
    }
  });

  if (all.length === 0) return <p className="dq-queue__empty">{empty}</p>;
  return (
    <>
      <ol className="dq-queue__list" ref={list}>
        {items.map((item) => {
          const state = late ? "late" : item.position === 1 ? "next" : item.position <= 3 ? "soon" : "wait";
          const word =
            state === "late" ? t.live.waiting : state === "next" ? t.live.next : state === "soon" ? t.live.soon : waitOf(item);
          const isMine = mine === item.number;
          const expanded = open === item.number;
          const canOpen = !late && item.etaSeconds !== undefined;
          const className = `dq-qrow dq-qrow--${state}${isMine ? " dq-qrow--you" : ""}${canOpen ? "" : " dq-qrow--static"}`;
          const row = (
            <>
              <span className="dq-qrow__pos">{item.position}</span>
              <span className="dq-qrow__who">
                <span className="dq-qrow__team">
                  {t.session.team} {item.number}
                  {isMine ? <span className="dq-you">{t.live.you}</span> : null}
                </span>
                {item.leaderName ? (
                  <span className="dq-qrow__name" dir="auto">
                    {item.leaderName}
                  </span>
                ) : null}
                {item.reason === "MOVED_IN" ? <span className="dq-qrow__tag">{t.live.movedIn}</span> : null}
              </span>
              <span className="dq-qrow__end">
                {!late && item.time ? <span className="dq-qrow__time">{formatTime(item.time)}</span> : null}
                {word ? <span className="dq-qrow__state">{word}</span> : null}
              </span>
              {expanded && canOpen ? <Details item={item} /> : null}
            </>
          );
          return (
            <li key={item.number} data-team={item.number}>
              {canOpen ? (
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : item.number)}
                  aria-expanded={expanded}
                  className={className}
                >
                  {row}
                </button>
              ) : (
                <div className={className}>{row}</div>
              )}
            </li>
          );
        })}
      </ol>
      {pages > 1 ? (
        <div className="dq-pager">
          <span className="dq-pager__info">
            <span className="dq-pager__range">
              <b>
                {page * PAGE_SIZE + 1}–{page * PAGE_SIZE + items.length}
              </b>{" "}
              {t.live.of} {all.length}
            </span>
            {/* Where the teams on show sit in the whole queue. */}
            <span className="dq-pager__track" aria-hidden="true">
              <i
                style={{
                  left: `${((page * PAGE_SIZE) / all.length) * 100}%`,
                  width: `${(items.length / all.length) * 100}%`,
                }}
              />
            </span>
          </span>
          {mineAt >= 0 && page !== minePage ? (
            <button type="button" className="dq-btn dq-btn--quiet" onClick={() => goTo(null)}>
              {t.live.showMine}
            </button>
          ) : null}
          <div className="dq-pager__nav">
            <button
              type="button"
              className="dq-pager__btn"
              aria-label={t.live.previousTeams}
              disabled={page === 0}
              onClick={() => goTo(page - 1)}
            >
              <Chevron d="M10 3 5 8l5 5" />
            </button>
            <span className="dq-pager__page">
              {page + 1} / {pages}
            </span>
            <button
              type="button"
              className="dq-pager__btn"
              aria-label={t.live.nextTeams}
              disabled={page >= pages - 1}
              onClick={() => goTo(page + 1)}
            >
              <Chevron d="M6 3l5 5-5 5" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Chevron({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/** The short wait shown at the end of a waiting row, for example "24–30 min". */
function waitOf(item: QueueItem): string {
  if (item.etaSeconds === undefined) return "";
  const range = item.etaRangeSeconds;
  return range
    ? `${minutesOf(range[0])}–${minutesOf(range[1])} ${t.live.minutes}`
    : `${t.live.about} ${minutesOf(item.etaSeconds)} ${t.live.minutes}`;
}

/** What a tap on a main-queue row opens: its slot and the wait estimate in full. */
function Details({ item }: { item: QueueItem }) {
  const range = item.etaRangeSeconds;
  return (
    <span className="dq-qrow__more">
      {item.time ? (
        <span>
          {t.live.scheduledAt}: {formatTime(item.time)}
        </span>
      ) : null}
      {item.etaSeconds === 0 ? (
        <span className="text-ok">{t.live.now}</span>
      ) : item.etaSeconds !== undefined ? (
        <span className="dq-muted">
          {range
            ? `${t.live.expectedBetween} ${minutesOf(range[0])}–${minutesOf(range[1])} ${t.live.minutes}`
            : `${t.live.expectedIn} ${minutesOf(item.etaSeconds)} ${t.live.minutes}`}
        </span>
      ) : null}
    </span>
  );
}
