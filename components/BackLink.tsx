import Link from "next/link";
import type { ReactNode } from "react";
import { back } from "./PageTransition";

/**
 * The way back, above a screen's title: a drawn arrow in a small tile, then
 * where it leads. `kind` says what sort of place that is ("Subject"), in grey.
 */
export function BackLink({ href, kind, children }: { href: string; kind?: string; children: ReactNode }) {
  return (
    <Link href={href} className="dq-back" transitionTypes={back}>
      <span className="dq-back__icon" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 8H3M7 4 3 8l4 4" />
        </svg>
      </span>
      <span>
        {kind ? <span className="dq-back__kind">{kind} </span> : null}
        {children}
      </span>
    </Link>
  );
}
