"use client";

import { themeKey } from "@/lib/site";
import { t } from "@/lib/strings";

/**
 * Switches between light and dark and remembers the choice on this device.
 * Which icon shows is decided in CSS (--theme-sun, --theme-moon), so the
 * button is right before React wakes up and needs no state.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const now = root.dataset.theme ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = now === "dark" ? "light" : "dark";
    const apply = () => {
      root.dataset.theme = next;
    };
    // The whole page fades from one theme to the other where the browser can.
    // A fade that is cut short (a second click, a hidden tab) still changes the theme.
    if (document.startViewTransition) document.startViewTransition(apply).ready.catch(() => {});
    else apply();
    try {
      localStorage.setItem(themeKey, next);
    } catch {
      // Private browsing: the choice lasts until the page is closed.
    }
  }
  return (
    <button type="button" className="dq-theme" aria-label={t.theme.toggle} title={t.theme.toggle} onClick={toggle}>
      <svg className="dq-theme__sun" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
        <circle cx="10" cy="10" r="3.5" />
        <path d="M10 1.75v2M10 16.25v2M1.75 10h2M16.25 10h2M4.17 4.17l1.41 1.41M14.42 14.42l1.41 1.41M4.17 15.83l1.41-1.41M14.42 5.58l1.41-1.41" />
      </svg>
      <svg className="dq-theme__moon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16.5 11.6A7 7 0 0 1 8.4 3.5a7 7 0 1 0 8.1 8.1Z" />
      </svg>
    </button>
  );
}
