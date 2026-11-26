import { ViewTransition, type ReactNode } from "react";

/**
 * How a page arrives and leaves. A link that goes deeper is tagged
 * `nav-forward` and the page slides in from the right; one that goes back is
 * `nav-back` and it slides from the left; anything else fades. The motion
 * itself is in dq.css.
 */
const byDirection = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page-fade" };

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={byDirection} exit={byDirection} default="none">
      {children}
    </ViewTransition>
  );
}

/** A loading placeholder that drops away as the real content rises in its place. */
export function Leaving({ children }: { children: ReactNode }) {
  return (
    <ViewTransition exit="slide-down" default="none">
      {children}
    </ViewTransition>
  );
}

export function Arriving({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="slide-up" default="none">
      {children}
    </ViewTransition>
  );
}

/** Tags for links: deeper into the site, or back out of it. */
export const forward = ["nav-forward"];
export const back = ["nav-back"];
