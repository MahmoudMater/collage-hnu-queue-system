import type { Metadata } from "next";
import { Suspense } from "react";
import { StudentSignInCallback } from "@/components/live/StudentSignInCallback";
import { t } from "@/lib/strings";

export const metadata: Metadata = { title: t.seo.signIn, robots: { index: false, follow: false } };

export default function Page() {
  return (
    <main>
      <Suspense fallback={<p className="text-sm text-muted">{t.state.loading}</p>}>
        <StudentSignInCallback />
      </Suspense>
    </main>
  );
}
