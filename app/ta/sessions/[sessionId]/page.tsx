import { Suspense } from "react";
import { RequireStaff } from "@/components/ta/RequireStaff";
import { SessionReview } from "@/components/ta/SessionReview";
import { ta } from "@/lib/strings";

export default function Page({ params }: { params: Promise<{ sessionId: string }> }) {
  return (
    <main>
      <RequireStaff>
        <Suspense fallback={<p className="text-sm text-muted">{ta.signIn.callbackWorking}</p>}>
          <SessionReview params={params} />
        </Suspense>
      </RequireStaff>
    </main>
  );
}
