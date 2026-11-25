"use client";

import { useCallback, useEffect, useState } from "react";

export type Loaded<T> =
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "error"; error: unknown };

/** Load data in the browser. `load` must be stable (wrap it in useCallback). */
export function useLoad<T>(load: () => Promise<T>) {
  const [state, setState] = useState<Loaded<T>>({ status: "loading" });
  const [round, setRound] = useState(0);

  useEffect(() => {
    let alive = true;
    load().then(
      (data) => alive && setState({ status: "ready", data }),
      (error) => alive && setState({ status: "error", error }),
    );
    return () => {
      alive = false;
    };
  }, [load, round]);

  const reload = useCallback(() => {
    setState({ status: "loading" });
    setRound((n) => n + 1);
  }, []);
  const replace = useCallback((data: T) => setState({ status: "ready", data }), []);
  return { state, reload, replace };
}
