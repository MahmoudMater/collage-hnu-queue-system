import type { Metadata } from "next";
import { t } from "./strings";

/**
 * One page's metadata: title, description and canonical link, and the same
 * again for link previews. Next does not merge `openGraph` between a layout
 * and a page, so a page states all of it.
 */
export function pageMeta({
  title,
  description,
  path,
  index = true,
}: {
  title: string;
  description: string;
  /** The page's own address without a query, for example "/levels/2". */
  path: string;
  /** False keeps the page out of search results; its links are still followed. */
  index?: boolean;
}): Metadata {
  return {
    // The home page's title already carries the site's name.
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: t.appName, locale: "en_US", url: path, title, description },
    twitter: { card: "summary_large_image", title, description },
    ...(index ? {} : { robots: { index: false, follow: true } }),
  };
}
