"use client";

import Link from "next/link";
import { useCallback, type ReactNode } from "react";
import { StateMessage } from "@/components/StateMessage";
import { staffSignOut } from "@/lib/auth";
import { ta, t } from "@/lib/strings";
import { AuthRequired, taGet } from "@/lib/ta-client";
import type { StaffMe } from "@/lib/ta-types";
import { useLoad } from "@/lib/use-load";

/** Shows its children only to a signed-in staff user; otherwise asks to sign in. */
export function RequireStaff({ children }: { children: ReactNode }) {
  const load = useCallback(() => taGet<StaffMe>("/api/v1/staff/me"), []);
  const { state, reload } = useLoad(load);

  if (state.status === "loading")
    return <p className="text-sm text-muted">{t.state.loading}</p>;
  if (state.status === "error") {
    if (state.error instanceof AuthRequired)
      return (
        <StateMessage title={ta.signIn.title} body={ta.signIn.needed}>
          <Link href="/staff/signin" className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background">
            {ta.signIn.button}
          </Link>
        </StateMessage>
      );
    return (
      <StateMessage title={t.state.errorTitle} body={t.state.errorBody}>
        <button type="button" onClick={reload} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background">
          {t.state.retry}
        </button>
      </StateMessage>
    );
  }
  const me = state.data;
  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3 text-xs text-muted">
        <span>
          {ta.nav.signedInAs} {me.displayName ?? me.email}
        </span>
        <button
          type="button"
          className="text-accent"
          onClick={async () => {
            await staffSignOut();
            reload();
          }}
        >
          {ta.nav.signOut}
        </button>
      </div>
      {children}
    </>
  );
}
