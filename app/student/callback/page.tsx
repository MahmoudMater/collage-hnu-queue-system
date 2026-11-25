import { Suspense } from "react";
import { StudentSignInCallback } from "@/components/live/StudentSignInCallback";
import { t } from "@/lib/strings";

export default function Page() {
  return (
    <main>
      <Suspense fallback={<p className="text-sm text-muted">{t.state.loading}</p>}>
        <StudentSignInCallback />
      </Suspense>
    </main>
  );
}
