import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
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

export const metadata: Metadata = {
  title: t.appName,
  description: t.landing.sub,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${arabic.variable}`}
    >
      <body className="dq dq-bg">{children}</body>
    </html>
  );
}
