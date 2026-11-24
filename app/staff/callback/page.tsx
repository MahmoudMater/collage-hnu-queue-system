import { Suspense } from "react";
import { SignInCallback } from "@/components/ta/SignInCallback";
import { ta } from "@/lib/strings";

export default function CallbackPage() {
  return (
    <main>
      <Suspense fallback={<p className="text-sm text-muted">{ta.signIn.callbackWorking}</p>}>
        <SignInCallback />
      </Suspense>
    </main>
  );
}
