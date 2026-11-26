import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "./SiteHeader";

/** Every screen except the landing page: the bar, one column, the footer at the bottom of the window. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="dq-shell">
      <SiteHeader />
      <div className="dq-page">{children}</div>
      <SiteFooter />
    </div>
  );
}
