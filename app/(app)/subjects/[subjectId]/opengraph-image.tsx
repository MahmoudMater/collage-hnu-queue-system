import { apiGet } from "@/lib/api";
import { CountVisual, MarkVisual, drawable, ogImage, ogSize, ogType } from "@/lib/og";
import { sessionsCount, t } from "@/lib/strings";
import type { SessionCardsResponse } from "@/lib/types";

export const alt = t.seo.og.alt;
export const size = ogSize;
export const contentType = ogType;

export default async function Image({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params;
  const data = await apiGet<SessionCardsResponse>(
    `/api/v1/discussions/subjects/${encodeURIComponent(subjectId)}/sessions`,
  ).catch(() => null);
  if (!data) {
    return ogImage({ eyebrow: t.seo.og.subject, title: t.appName, sub: t.seo.og.subjectSub, visual: <MarkVisual /> });
  }
  const { subject, sessions } = data;
  const level = subject.level ? t.level.names[subject.level - 1] : null;
  return ogImage({
    eyebrow: [level, t.seo.og.subject].filter(Boolean).join(" · "),
    title: drawable(subject.name) ?? t.seo.og.discussions,
    sub: t.seo.og.subjectSub,
    facts: [level, sessionsCount(sessions.length)],
    visual: <CountVisual count={sessions.length} label={sessions.length === 1 ? t.seo.og.discussion : t.seo.og.discussions} />,
  });
}
