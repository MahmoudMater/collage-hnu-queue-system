/**
 * The picture a chat or a search shows beside a link to the site: one frame,
 * a title on the left and a small drawing on the right. Drawn by `next/og`,
 * which knows flexbox and inline styles only, so nothing here uses a class.
 *
 * No student's name is drawn, and nothing that goes stale in a cached preview
 * (who is inside, whether a discussion is live).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { ReactNode } from "react";
import { siteUrl } from "./site";
import { t } from "./strings";

export const ogSize = { width: 1200, height: 630 };
export const ogType = "image/png";

/** The dark theme's colours (see globals.css). */
const c = {
  page: "#000000",
  card: "#151513",
  line: "#2b2a26",
  lineStrong: "#77756c",
  text: "#f5f3ea",
  muted: "#a9a79d",
  signal: "#ffd23f",
  ink: "#141412",
};

const display = "Bricolage";
const sans = "Plex Sans";
const mono = "Plex Mono";

// Read when the server starts, so the home page's picture can be drawn at build time.
const font = (name: string, file: string, weight: 500 | 600 | 800) => ({
  name,
  data: readFileSync(join(process.cwd(), "assets/og", file)),
  weight,
  style: "normal" as const,
});
const fonts = [
  font(display, "bricolage-800.ttf", 800),
  font(sans, "plex-sans-500.ttf", 500),
  font(mono, "plex-mono-600.ttf", 600),
];

/**
 * The renderer cannot join Arabic letters or set them right to left, so a
 * name it cannot draw is left out and the caller's fallback is shown.
 * ponytail: Latin names only; draw Arabic once the renderer shapes it.
 */
export function drawable(text: string | null | undefined): string | null {
  return text && !/[֐-ࣿיִ-ﻼ]/.test(text) ? text : null;
}

/** The Bubble mark without a tile, as on the site. */
function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="4 5 40 40">
      <rect fill={c.signal} x="8" y="9" width="32" height="23" rx="7" />
      <path fill={c.signal} d="M13 28v12l11-9z" />
      <circle fill={c.page} cx="17" cy="20.5" r="3.6" />
      <circle fill={c.page} cx="25.6" cy="20.5" r="2.8" />
      <circle fill={c.page} cx="32.6" cy="20.5" r="2" />
    </svg>
  );
}

const overline = { fontFamily: mono, fontSize: 21, letterSpacing: 3, textTransform: "uppercase" as const };

/** Smaller type for a longer title, so a long subject name still fits three lines. */
const titleSize = (length: number) => (length <= 12 ? 112 : length <= 20 ? 92 : length <= 34 ? 76 : length <= 60 ? 60 : 50);

export function ogImage({
  eyebrow,
  title,
  mark,
  sub,
  facts = [],
  visual,
}: {
  eyebrow: string;
  title: string;
  /** Words under the title on a yellow marker, as in the site's headline. */
  mark?: string;
  sub?: string;
  /** Short facts along the bottom. */
  facts?: (string | null | undefined | false)[];
  visual: ReactNode;
}) {
  const size = titleSize(Math.max(title.length, mark?.length ?? 0) + (mark ? 8 : 0));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          padding: "52px 64px 56px",
          background: c.page,
          color: c.text,
          fontFamily: sans,
        }}
      >
        {/* The site's background: a dot matrix and a warm glow. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            backgroundImage: `radial-gradient(circle at 15px 15px, ${c.line} 8%, transparent 0%)`,
            backgroundSize: "30px 30px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            backgroundImage:
              "radial-gradient(circle at 82% 18%, rgba(255,210,63,0.2) 0%, rgba(255,210,63,0.05) 30%, rgba(0,0,0,0) 55%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: 10,
            display: "flex",
            background: c.signal,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Mark size={50} />
            <span style={{ fontFamily: display, fontSize: 31, letterSpacing: -0.5 }}>{t.appName}</span>
          </div>
          <span style={{ fontFamily: mono, fontSize: 20, color: c.muted }}>{new URL(siteUrl).host}</span>
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 56 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, color: c.signal, ...overline }}>
              <div style={{ width: 12, height: 12, background: c.signal, display: "flex" }} />
              <span>{eyebrow}</span>
            </div>
            <div
              style={{
                display: "block",
                lineClamp: 3,
                marginTop: 18,
                fontFamily: display,
                fontSize: size,
                lineHeight: 1.02,
                letterSpacing: -size / 40,
              }}
            >
              {title}
            </div>
            {mark ? (
              <div style={{ display: "flex", marginTop: 10 }}>
                <span
                  style={{
                    fontFamily: display,
                    fontSize: size,
                    lineHeight: 1.02,
                    letterSpacing: -size / 40,
                    padding: "2px 16px 8px",
                    marginLeft: -6,
                    background: c.signal,
                    color: c.ink,
                    borderRadius: 14,
                  }}
                >
                  {mark}
                </span>
              </div>
            ) : null}
            {sub ? (
              <div style={{ display: "block", lineClamp: 2, marginTop: 24, fontSize: 29, lineHeight: 1.3, color: c.muted }}>
                {sub}
              </div>
            ) : null}
          </div>
          <div style={{ display: "flex", flexShrink: 0, width: 380, justifyContent: "flex-end" }}>{visual}</div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {facts.filter(Boolean).map((fact) => (
            <span
              key={String(fact)}
              style={{
                fontFamily: mono,
                fontSize: 21,
                padding: "9px 18px",
                border: `2px solid ${c.line}`,
                borderRadius: 12,
                background: c.card,
              }}
            >
              {fact}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  );
}

/** Home: the team inside and the queue under it, with one row marked You. */
export function BoardVisual() {
  const demo = t.landing.demo;
  const rows = [
    { place: 1, number: demo.main[0].number, tag: t.live.next, you: false, fade: 1 },
    { place: 2, number: demo.main[1].number, tag: t.live.you, you: true, fade: 1 },
    { place: 3, number: demo.main[2].number, tag: t.live.soon, you: false, fade: 0.5 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", width: 380, gap: 12 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "22px 26px 20px",
          background: c.signal,
          color: c.ink,
          borderRadius: 24,
        }}
      >
        <span style={{ ...overline, fontSize: 18 }}>{t.live.insideTitle}</span>
        <span style={{ fontFamily: display, fontSize: 76, lineHeight: 1.05, letterSpacing: -2 }}>
          {t.session.team} {demo.inside.number}
        </span>
      </div>
      {rows.map((row) => (
        <div
          key={row.place}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "12px 18px 12px 12px",
            background: c.card,
            border: `2px solid ${row.you ? c.signal : c.line}`,
            borderRadius: 18,
            opacity: row.fade,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 46,
              height: 46,
              borderRadius: 12,
              fontFamily: mono,
              fontSize: 24,
              background: row.place === 1 ? c.signal : c.line,
              color: row.place === 1 ? c.ink : c.text,
            }}
          >
            {row.place}
          </div>
          <span style={{ flex: 1, fontFamily: display, fontSize: 30 }}>
            {t.session.team} {row.number}
          </span>
          <span
            style={{
              ...overline,
              fontSize: 17,
              letterSpacing: 2,
              padding: row.you ? "5px 12px" : 0,
              borderRadius: 8,
              background: row.you ? c.signal : "transparent",
              color: row.you ? c.ink : c.muted,
            }}
          >
            {row.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

/** A level: its number, and the four-step meter from the level tiles. */
export function LevelVisual({ level }: { level: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      <span style={{ fontFamily: display, fontSize: 380, lineHeight: 0.86, letterSpacing: -12, color: c.signal }}>{level}</span>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            style={{ display: "flex", width: 70, height: 16, borderRadius: 8, background: step <= level ? c.signal : c.line }}
          />
        ))}
      </div>
    </div>
  );
}

/** A subject: how many discussions it has, and one square for each, as on its tile. */
export function CountVisual({ count, label }: { count: number; label: string }) {
  if (count === 0) return <Mark size={300} />;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 380,
        padding: "26px 34px 34px",
        background: c.card,
        border: `2px solid ${c.line}`,
        borderRadius: 28,
      }}
    >
      <span style={{ fontFamily: display, fontSize: 190, lineHeight: 1, letterSpacing: -6, color: c.signal }}>{count}</span>
      <span style={{ ...overline, color: c.muted }}>{label}</span>
      <div style={{ display: "flex", gap: 9, marginTop: 24 }}>
        {Array.from({ length: Math.min(count, 8) }, (_, i) => (
          <div key={i} style={{ display: "flex", width: 30, height: 30, borderRadius: 8, background: c.signal }} />
        ))}
      </div>
    </div>
  );
}

/** A discussion: its day as the calendar tile of the agenda. */
export function DateVisual({ weekday, day, month }: { weekday: string; day: string; month: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 340,
        height: 360,
        background: c.signal,
        color: c.ink,
        borderRadius: 36,
      }}
    >
      <span style={{ ...overline, fontSize: 34, letterSpacing: 6 }}>{weekday}</span>
      <span style={{ fontFamily: display, fontSize: 220, lineHeight: 1, letterSpacing: -8 }}>{day}</span>
      <span style={{ ...overline, fontSize: 34, letterSpacing: 6 }}>{month}</span>
    </div>
  );
}

/** When there is nothing to count or date: the mark, large. */
export function MarkVisual() {
  return <Mark size={300} />;
}
