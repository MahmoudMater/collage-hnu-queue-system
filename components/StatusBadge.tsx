import { statusLabel } from "@/lib/strings";
import type { StatusWord } from "@/lib/types";

const styles: Record<StatusWord, string> = {
  NOT_STARTED: "bg-idle-soft text-idle",
  RUNNING: "bg-ok-soft text-ok",
  ENDED: "bg-info-soft text-info",
};

export function StatusBadge({ status }: { status: StatusWord }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {statusLabel[status]}
    </span>
  );
}
