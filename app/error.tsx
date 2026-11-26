"use client";

import { AppShell } from "@/components/AppShell";
import { StateMessage } from "@/components/StateMessage";
import { t } from "@/lib/strings";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <AppShell>
      <main>
        <StateMessage code="!" title={t.state.errorTitle} body={t.state.errorBody}>
          <button type="button" onClick={reset} className="dq-btn dq-btn--primary">
            {t.state.retry}
          </button>
        </StateMessage>
      </main>
    </AppShell>
  );
}
