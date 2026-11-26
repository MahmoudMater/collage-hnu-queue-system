import { BoardVisual, ogImage, ogSize, ogType } from "@/lib/og";
import { t } from "@/lib/strings";

export const alt = t.seo.og.alt;
export const size = ogSize;
export const contentType = ogType;

/** The picture for the home page, and for any page without its own. */
export default function Image() {
  return ogImage({
    eyebrow: t.landing.kicker,
    title: t.landing.headline,
    mark: t.landing.headlineMark,
    sub: t.seo.og.homeSub,
    facts: [...t.seo.og.homeFacts],
    visual: <BoardVisual />,
  });
}
