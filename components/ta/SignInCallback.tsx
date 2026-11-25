"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StateMessage } from "@/components/StateMessage";
import { finishStaffSignIn } from "@/lib/auth";
import { ta } from "@/lib/strings";

const reasons: Record<string, string> = {
  staff_sign_in_not_eligible: ta.signIn.notEligible,
  student_email_not_allowed: ta.signIn.studentEmail,
  staff_sign_in_unavailable: ta.signIn.unavailable,
  google_authorization_failed: ta.signIn.failed,
};

/** The page Google sends the TA back to: swaps the one-time code for the sign-in cookies. */
export function SignInCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const code = params.get("code");
  const error = params.get("error");
  const status = params.get("status");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!code) return;
    finishStaffSignIn(code).then(
      () => router.replace("/ta"),
      () => setFailed(true),
    );
  }, [code, router]);

  if (status === "mailbox_confirmation_required")
    return <StateMessage title={ta.signIn.title} body={ta.signIn.needsConfirmation} />;
  if (error || failed || !code)
    return (
      <StateMessage title={ta.signIn.title} body={(error && reasons[error]) || ta.signIn.failed}>
        <Link href="/staff/signin" className="text-sm text-accent">
          {ta.signIn.button}
        </Link>
      </StateMessage>
    );
  return <p className="text-sm text-muted">{ta.signIn.callbackWorking}</p>;
}
