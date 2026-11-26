"use client";

import { useEffect, useState } from "react";
import { InsideView } from "@/components/live/InsideCard";
import { Queue } from "@/components/live/Queue";
import { t } from "@/lib/strings";
import type { QueueItem } from "@/lib/types";

const demo = t.landing.demo;
/** The invented teams take turns: the one being called, then the three behind it. */
const ring = [{ ...demo.inside, time: null as string | null }, ...demo.main];
const late: QueueItem[] = demo.late.map((team, i) => ({ ...team, position: i + 1, reason: null }));
const SECONDS_PER_TURN = 7;

/**
 * The picture of a live discussion on the landing page. It moves on its own:
 * the countdown runs, then the next team is called and the queue moves up, so
 * a visitor sees what the real screen does. With reduced motion it stays still.
 */
export function HeroDemo() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const turn = Math.floor(tick / SECONDS_PER_TURN) % ring.length;
  const called = ring[turn];
  const main: QueueItem[] = [1, 2, 3].map((ahead) => {
    const team = ring[(turn + ahead) % ring.length];
    return { number: team.number, leaderName: team.leaderName, time: team.time, position: ahead, reason: null };
  });
  return (
    <div className="dq-stack">
      <InsideView
        inside={{ number: called.number, leaderName: called.leaderName, status: "ASKING" }}
        left={demo.inside.seconds - (tick % SECONDS_PER_TURN) * 6}
        mine={called.number === demo.mine}
      />
      <Queue main={main} late={late} lateOn mine={demo.mine} />
    </div>
  );
}
