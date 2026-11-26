import { statusLabel } from "@/lib/strings";
import type { StatusWord } from "@/lib/types";

const styles: Record<StatusWord, string> = {
  NOT_STARTED: "dq-badge",
  RUNNING: "dq-badge dq-badge--ok dq-badge--live",
  ENDED: "dq-badge dq-badge--info",
};

/** The same three words without the pill, for a row of the agenda. */
const plainStyles: Record<StatusWord, string> = {
  NOT_STARTED: "dq-status",
  RUNNING: "dq-status dq-status--ok dq-status--live",
  ENDED: "dq-status dq-status--info",
};

export function StatusBadge({ status, plain = false }: { status: StatusWord; plain?: boolean }) {
  return <span className={(plain ? plainStyles : styles)[status]}>{statusLabel[status]}</span>;
}
