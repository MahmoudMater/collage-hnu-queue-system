import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@/lib/strings";
import "./globals.css";

export const metadata: Metadata = {
  title: t.appName,
  description: t.home.intro,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" dir="ltr" className="h-full antialiased">
      <body className="min-h-full">
        <header className="border-b border-line bg-card">
          <div className="mx-auto flex max-w-xl items-center px-4 py-3">
            <Link href="/" className="text-base font-medium">
              {t.appName}
            </Link>
          </div>
        </header>
        <div className="mx-auto w-full max-w-xl px-4 py-6">{children}</div>
      </body>
    </html>
  );
}
