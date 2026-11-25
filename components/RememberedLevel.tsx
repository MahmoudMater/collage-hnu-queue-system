"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const KEY = "discussion-level";

/**
 * On the home page: go straight to the level this phone picked last time,
 * unless the student came here to change it (`/?change`). On a level page
 * (`level` set): remember it. A phone that blocks storage just picks again.
 */
export function RememberedLevel({ level }: { level?: number }) {
  const router = useRouter();
  useEffect(() => {
    try {
      if (level) localStorage.setItem(KEY, String(level));
      else if (window.location.search.includes("change")) localStorage.removeItem(KEY);
      else {
        const saved = localStorage.getItem(KEY);
        if (saved && /^[1-4]$/.test(saved)) router.replace(`/levels/${saved}`);
      }
    } catch {
      /* storage is not available */
    }
  }, [level, router]);
  return null;
}
