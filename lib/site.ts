/**
 * Where the site lives, for canonical links, the sitemap and share images.
 * Set SITE_URL in production; on Vercel the production domain is the fallback.
 */
export const siteUrl = (
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/+$/, "");

/** The page colours a browser paints its own bars with (see --background in globals.css). */
export const themeColor = { light: "#f4f3ee", dark: "#000000" };

/** Where the browser keeps the student's choice of theme (see components/ThemeToggle.tsx). */
export const themeKey = "theme";
