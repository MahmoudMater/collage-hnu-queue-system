"use client";

import { useEffect, useState } from "react";
import { clockTime, t } from "@/lib/strings";
import type { SessionBreak } from "@/lib/types";

/**
 * One line about the TA's pace: on a break and when he is back, or how far he
 * is from the schedule. The server decides both; this only words them.
 */
export function PaceNote({
  pause,
  delayMinutes,
  offsetMs = 0,
}: {
  pause: SessionBreak | null;
  delayMinutes: number | null;
  offsetMs?: number;
}) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!pause) return;
    const timer = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(timer);
  }, [pause]);

  if (pause) {
    const over = Date.parse(pause.until) <= now + offsetMs;
    return (
      <p className="dq-notice">
        {t.schedule.onBreak}
        {pause.reason && pause.reason !== "OTHER" ? ` (${t.schedule.breakReasons[pause.reason] ?? ""})` : ""}
        {" · "}
        {over ? t.schedule.breakOver : `${t.schedule.backAt} ${clockTime(pause.until)}`}
      </p>
    );
  }
  const label = t.schedule.delay(delayMinutes);
  if (!label) return null;
  return (
    <p className={delayMinutes && delayMinutes > 0 ? "dq-pace dq-pace--late" : "dq-pace"}>{label}</p>
  );
}
