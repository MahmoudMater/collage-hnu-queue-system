import { apiGet } from "@/lib/api";
import { LevelVisual, MarkVisual, ogImage, ogSize, ogType } from "@/lib/og";
import { t } from "@/lib/strings";
import type { SubjectsResponse } from "@/lib/types";

export const alt = t.seo.og.alt;
export const size = ogSize;
export const contentType = ogType;

export default async function Image({ params }: { params: Promise<{ level: string }> }) {
  const level = Number((await params).level);
  if (![1, 2, 3, 4].includes(level)) {
    return ogImage({ eyebrow: t.landing.kicker, title: t.appName, sub: t.seo.og.homeSub, visual: <MarkVisual /> });
  }
  // The picture is still drawn when the API does not answer, without the count.
  const subjects = await apiGet<SubjectsResponse>(`/api/v1/discussions/subjects?level=${level}`)
    .then((r) => r.subjects.length)
    .catch(() => 0);
  return ogImage({
    eyebrow: t.landing.kicker,
    title: t.seo.level.title(level),
    sub: t.level.intro,
    facts: [subjects > 0 && t.seo.og.subjects(subjects)],
    visual: <LevelVisual level={level} />,
  });
}
