import { apiGet } from "@/lib/api";
import { DateVisual, MarkVisual, drawable, ogImage, ogSize, ogType } from "@/lib/og";
import { dateParts, formatDate, formatTime, t, teamsCount } from "@/lib/strings";
import type { SessionSnapshot } from "@/lib/types";

export const alt = t.seo.og.alt;
export const size = ogSize;
export const contentType = ogType;

/** A discussion's picture: the subject, the TA, the day and the slots. No team's or student's name. */
export default async function Image({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const data = await apiGet<SessionSnapshot>(`/api/v1/discussions/sessions/${encodeURIComponent(sessionId)}`).catch(
    () => null,
  );
  if (!data) {
    return ogImage({ eyebrow: t.seo.og.discussion, title: t.appName, sub: t.seo.og.homeSub, visual: <MarkVisual /> });
  }
  const { session, teams } = data;
  const subject = drawable(session.subject.name);
  const ta = drawable(session.taName);
  const slots = teams.map((team) => team.time).filter(Boolean);
  return ogImage({
    eyebrow: ta && subject ? subject : t.seo.og.discussion,
    title: ta ?? subject ?? t.appName,
    sub: formatDate(session.date),
    facts: [
      drawable(session.label),
      teams.length > 0 && teamsCount(teams.length),
      slots.length > 1 && `${formatTime(slots[0])} – ${formatTime(slots[slots.length - 1])}`,
    ],
    visual: <DateVisual {...dateParts(session.date)} />,
  });
}
