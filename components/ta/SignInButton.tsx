"use client";

import { useState } from "react";
import { startStaffSignIn } from "@/lib/auth";
import { ta } from "@/lib/strings";

export function SignInButton() {
  const [state, setState] = useState<"idle" | "working" | "failed">("idle");
  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          setState("working");
          try {
            await startStaffSignIn();
          } catch {
            setState("failed");
          }
        }}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background"
      >
        {state === "working" ? ta.signIn.working : ta.signIn.button}
      </button>
      {state === "failed" ? <p className="mt-2 text-sm text-muted">{ta.signIn.failed}</p> : null}
    </div>
  );
}
