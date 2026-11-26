import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import { siteUrl, themeColor, themeKey } from "@/lib/site";
import { t } from "@/lib/strings";
import "./globals.css";
import "./dq.css";

// Headlines, text, numerals, and the fallback for Arabic names (see --font-* in globals.css).
const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz"], variable: "--font-bricolage" });
const sans = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-plex-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-plex-mono" });
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-arabic",
  preload: false,
});

/** What every page starts from; a page adds its own with `pageMeta` (lib/seo.ts). */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: t.seo.title, template: `%s · ${t.appName}` },
  description: t.seo.description,
  applicationName: t.appName,
  category: "education",
  openGraph: { type: "website", siteName: t.appName, locale: "en_US" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
  appleWebApp: { title: t.seo.shortName },
  // A student ID or a team number is not a phone number.
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: themeColor.light },
    { media: "(prefers-color-scheme: dark)", color: themeColor.dark },
  ],
};

/**
 * Puts the student's own choice of theme on the page before it is painted, so
 * it never flashes the other one. Without a choice the phone's setting decides.
 */
const themeScript = `try{var t=localStorage.getItem("${themeKey}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${arabic.variable}`}
      // The script below sets data-theme before React wakes up.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="dq dq-bg">{children}</body>
    </html>
  );
}
