"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { clientGet } from "./api";
import type { LiveBroadcast, LiveSnapshot } from "./types";

export type Connection = "connecting" | "live" | "lost";

const POLL_WHEN_LOST_MS = 5000;

/**
 * Keeps one session's board up to date. The server sends a full board on
 * connect and after each change; the sequence number only ever moves forward.
 * When the socket drops, the page keeps asking over HTTP until it is back,
 * and it asks once after every reconnect or missed broadcast.
 *
 * `offsetMs` is how far the server's clock is ahead of this device's clock,
 * measured when a board arrives. Countdowns use it and never the device
 * clock alone.
 */
export function useLiveBoard(sessionId: string, initial: LiveSnapshot) {
  const [board, setBoard] = useState(initial);
  const [offsetMs, setOffsetMs] = useState(() => Date.parse(initial.serverNow) - Date.now());
  const [connection, setConnection] = useState<Connection>("connecting");
  const seq = useRef(initial.seq);

  const apply = useCallback((next: LiveSnapshot) => {
    if (next.seq < seq.current) return; // an older board arrived late
    seq.current = next.seq;
    setBoard(next);
    setOffsetMs(Date.parse(next.serverNow) - Date.now());
  }, []);

  const refetch = useCallback(async () => {
    try {
      apply(await clientGet<LiveSnapshot>(`/api/v1/discussions/sessions/${encodeURIComponent(sessionId)}`));
    } catch {
      /* the next broadcast or poll repairs it */
    }
  }, [apply, sessionId]);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL ?? `${window.location.origin}/discussions`;
    const socket = io(url, { auth: { sessionId } });
    let seenConnect = false;
    socket.on("connect", () => {
      setConnection("live");
      if (seenConnect) void refetch(); // came back after a drop
      seenConnect = true;
    });
    socket.on("snapshot", (s: LiveSnapshot) => apply(s));
    socket.on("board", (b: LiveBroadcast) => {
      const gap = b.fromSeq > seq.current;
      apply(b);
      if (gap) void refetch(); // missed a broadcast: confirm over HTTP
    });
    socket.on("disconnect", () => setConnection("lost"));
    socket.on("connect_error", () => setConnection("lost"));
    socket.on("problem", () => setConnection("lost"));
    return () => {
      socket.close();
    };
  }, [apply, refetch, sessionId]);

  useEffect(() => {
    if (connection !== "lost") return;
    const timer = setInterval(() => void refetch(), POLL_WHEN_LOST_MS);
    return () => clearInterval(timer);
  }, [connection, refetch]);

  return { board, offsetMs, connection };
}

/** Whole seconds left until `deadlineAt`, by the server's clock; null when there is none. */
export function useSecondsLeft(deadlineAt: string | null, offsetMs: number): number | null {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!deadlineAt) return;
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, [deadlineAt]);
  if (!deadlineAt) return null;
  return Math.max(0, Math.ceil((Date.parse(deadlineAt) - (now + offsetMs)) / 1000));
}
