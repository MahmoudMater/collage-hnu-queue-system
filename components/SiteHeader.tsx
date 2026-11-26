import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { t } from "@/lib/strings";
import { Logo } from "./Logo";
import { back } from "./PageTransition";

/**
 * The bar at the top of every page. The landing page passes its own links;
 * everywhere else it leads back to the levels and to how the site works.
 * It keeps its place while a page changes under it.
 */
export function SiteHeader({ children }: { children?: ReactNode }) {
  return (
    <ViewTransition name="site-header">
      <header className="dq-header">
        <Logo />
        <nav className="dq-header__links">
          {children ?? (
            <>
              <Link href="/#levels" transitionTypes={back}>
                {t.landing.footLevels}
              </Link>
              <Link href="/#how" transitionTypes={back}>
                {t.landing.nav.how}
              </Link>
            </>
          )}
        </nav>
      </header>
    </ViewTransition>
  );
}

/** The foot of every page: the logo and the three places a student may want next. */
export function SiteFooter() {
  return (
    <div className="dq-wrap">
      <footer className="dq-footer">
        <Logo />
        <nav>
          <Link href="/#levels">{t.landing.footLevels}</Link>
          <Link href="/#how">{t.landing.nav.how}</Link>
          <Link href="/#faq">{t.landing.nav.faq}</Link>
        </nav>
      </footer>
    </div>
  );
}
