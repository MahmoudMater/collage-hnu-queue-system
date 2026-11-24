"use client";

import { StateMessage } from "@/components/StateMessage";
import { t } from "@/lib/strings";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <StateMessage title={t.state.errorTitle} body={t.state.errorBody}>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background"
      >
        {t.state.retry}
      </button>
    </StateMessage>
  );
}
