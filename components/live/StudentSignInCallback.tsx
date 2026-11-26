"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StateMessage } from "@/components/StateMessage";
import { finishStudentSignIn } from "@/lib/auth";
import { t, leaderText } from "@/lib/strings";

/** The page Google sends a team leader back to: swaps the one-time code for the sign-in cookies. */
export function StudentSignInCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const code = params.get("code");
  const error = params.get("error");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!code) return;
    finishStudentSignIn(code).then(
      (back) => router.replace(back),
      () => setFailed(true),
    );
  }, [code, router]);

  if (error || failed || !code)
    return (
      <StateMessage
        title={t.state.errorTitle}
        body={error === "student_sign_in_not_eligible" ? leaderText.notEligible : leaderText.signInFailed}
      >
        <Link href="/" className="dq-link text-sm">
          {t.state.goHome}
        </Link>
      </StateMessage>
    );
  return <p className="text-sm text-muted">{leaderText.callbackWorking}</p>;
}
