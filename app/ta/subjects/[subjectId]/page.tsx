import { Suspense } from "react";
import { RequireStaff } from "@/components/ta/RequireStaff";
import { SubjectWorkspace } from "@/components/ta/SubjectWorkspace";
import { ta } from "@/lib/strings";

export default function Page({ params }: { params: Promise<{ subjectId: string }> }) {
  return (
    <main>
      <RequireStaff>
        <Suspense fallback={<p className="text-sm text-muted">{ta.signIn.callbackWorking}</p>}>
          <SubjectWorkspace params={params} />
        </Suspense>
      </RequireStaff>
    </main>
  );
}
