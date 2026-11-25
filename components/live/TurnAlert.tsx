"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { t } from "@/lib/strings";
import type { LiveSnapshot } from "@/lib/types";

const NEAR_POSITION = 3;
const REPEAT_NOW_MS = 5000;

/**
 * The team this phone follows in one session, kept on the phone. A link from
 * the search (`?team=12`) sets it. A phone that blocks storage keeps it only
 * while the page is open.
 */
export function useFollowedTeam(sessionId: string) {
  const key = `follow:${sessionId}`;
  const [team, setTeam] = useState<number | null>(null);
  useEffect(() => {
    let found: string | null = new URLSearchParams(window.location.search).get("team");
    try {
      if (found) localStorage.setItem(key, found);
      else found = localStorage.getItem(key);
    } catch {
      /* storage is not available */
    }
    const number = Number(found);
    // Read once from the browser after the page is shown; the server cannot know it.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (Number.isInteger(number) && number > 0) setTeam(number);
  }, [key]);
  const set = useCallback(
    (number: number | null) => {
      setTeam(number);
      try {
        if (number === null) localStorage.removeItem(key);
        else localStorage.setItem(key, String(number));
      } catch {
        /* storage is not available */
      }
    },
    [key],
  );
  return { team, set };
}

type Sound = { beep: (times: number) => void };

/** A short beep made in the browser, so no sound file is needed. Must be created from a tap. */
function makeSound(): Sound | null {
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  return {
    beep(times) {
      void ctx.resume();
      for (let i = 0; i < times; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 880;
        osc.connect(gain);
        gain.connect(ctx.destination);
        const start = ctx.currentTime + i * 0.35;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.6, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.25);
        osc.start(start);
        osc.stop(start + 0.3);
      }
    },
  };
}

/**
 * Tells the student when the followed team is close to its turn (once) and
 * when it is being called (repeated until it answers). Sound needs one tap
 * first: browsers do not let a page make noise on its own.
 */
export function TurnAlert({
  board,
  team,
  fixed,
  onFollow,
}: {
  board: LiveSnapshot;
  team: number | null;
  /** The team comes from the leader's sign-in and cannot be changed here. */
  fixed: boolean;
  onFollow: (team: number | null) => void;
}) {
  const [draft, setDraft] = useState("");
  const [sound, setSound] = useState<Sound | null>(null);
  const [awake, setAwake] = useState(false);
  const canVibrate = typeof navigator !== "undefined" && "vibrate" in navigator;

  const inLate = team === null ? undefined : board.queues.late.find((q) => q.number === team);
  const queued = inLate ?? (team === null ? undefined : board.queues.main.find((q) => q.number === team));
  const called = team !== null && board.inside?.number === team && board.inside.status === "ASKING";
  const isInside = team !== null && board.inside?.number === team;
  const near = !!queued && queued.position <= NEAR_POSITION;
  const state: "now" | "near" | "idle" = called ? "now" : near ? "near" : "idle";

  const notify = useCallback(
    (times: number) => {
      sound?.beep(times);
      if (canVibrate) navigator.vibrate([250, 120, 250]);
    },
    [sound, canVibrate],
  );

  // Alert when the state is entered, not on every board that repeats it.
  const last = useRef<typeof state>("idle");
  useEffect(() => {
    const before = last.current;
    last.current = state;
    if (!sound || state === before) return;
    if (state === "near") notify(2);
    if (state === "now") notify(3);
  }, [state, sound, notify]);

  useEffect(() => {
    if (state !== "now" || !sound) return;
    const timer = setInterval(() => notify(3), REPEAT_NOW_MS);
    return () => clearInterval(timer);
  }, [state, sound, notify]);

  useEffect(() => {
    if (state === "idle") return;
    const title = document.title;
    document.title = state === "now" ? t.alert.titleNow : t.alert.titleNear;
    return () => {
      document.title = title;
    };
  }, [state]);

  // A locked phone stops the page; the browser also drops the lock when the tab is hidden, so take it again.
  useEffect(() => {
    if (!awake || !("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    let gone = false;
    const take = () =>
      navigator.wakeLock.request("screen").then(
        (l) => {
          if (gone) void l.release();
          else lock = l;
        },
        () => undefined,
      );
    const onVisible = () => {
      if (document.visibilityState === "visible") void take();
    };
    void take();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      gone = true;
      document.removeEventListener("visibilitychange", onVisible);
      void lock?.release();
    };
  }, [awake]);

  if (team === null)
    return (
      <form
        className="rounded-lg border border-line bg-card p-3"
        onSubmit={(e) => {
          e.preventDefault();
          const number = Number(draft);
          if (Number.isInteger(number) && number > 0) onFollow(number);
        }}
      >
        <p className="text-sm font-medium">{t.alert.title}</p>
        <div className="mt-2 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            inputMode="numeric"
            placeholder={t.alert.teamLabel}
            aria-label={t.alert.teamLabel}
            className="min-w-0 flex-1 rounded-lg border border-line bg-background px-3 py-2 text-base"
          />
          <button type="submit" className="rounded-lg border border-line px-4 py-2 text-sm font-medium">
            {t.alert.follow}
          </button>
        </div>
      </form>
    );

  return (
    <div className="space-y-2 rounded-lg border border-line bg-card p-3">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">
          {t.alert.following} {team}
        </span>
        {fixed ? null : (
          <button type="button" className="text-accent" onClick={() => onFollow(null)}>
            {t.alert.stop}
          </button>
        )}
      </div>
      {state === "now" ? (
        <p role="alert" className="rounded-lg bg-info-soft px-3 py-2 text-base font-medium text-info">
          {t.alert.now}
        </p>
      ) : state === "near" && queued ? (
        <p role="status" className="rounded-lg bg-ok-soft px-3 py-2 text-sm font-medium text-ok">
          {inLate ? t.alert.nearLate(queued.position) : t.alert.near(queued.position)}
        </p>
      ) : !queued && !isInside ? (
        <p className="text-xs text-muted">{t.alert.notHere}</p>
      ) : null}
      {sound ? (
        <p className="text-xs text-muted">
          {t.alert.enabled}. {t.alert.silentHint} {canVibrate ? "" : t.alert.noVibration}
        </p>
      ) : (
        <div>
          <button
            type="button"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background"
            onClick={() => {
              const made = makeSound();
              made?.beep(1);
              // With no sound support the banner and the tab title still change.
              setSound(made ?? { beep: () => undefined });
            }}
          >
            {t.alert.enable}
          </button>
          <p className="mt-1 text-xs text-muted">{t.alert.help}</p>
        </div>
      )}
      <label className="flex items-center gap-2 text-xs text-muted">
        <input type="checkbox" checked={awake} onChange={(e) => setAwake(e.target.checked)} />
        {t.alert.keepAwake}
      </label>
    </div>
  );
}
