/** Shapes of the TA and sign-in API (see the backend spec 0012). */

export interface StaffMe {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  roles: { role: { name: string; displayName: string | null } }[];
}

export interface TaSubject {
  id: string;
  name: string;
}

export interface ParseIssue {
  severity: "blocking" | "warning";
  code: string;
  message: string;
  taName?: string;
  team?: number;
  line?: number;
  suggestion?: string;
  /** A time to use if the TA agrees, for example "12:05 PM". */
  suggestedTime?: string;
}

export interface UploadResult {
  uploadId: string;
  fileName: string;
  fileHash: string;
  duplicate: boolean;
  report: {
    tables: { taName: string; rows: { team: number }[] }[];
    issues: ParseIssue[];
    counts: { rows: number; tables: number; blocking: number; warnings: number };
  };
}

export interface TaSessionSummary {
  id: string;
  subjectId: string;
  taName: string;
  status: "DRAFT" | "CONFIRMED" | "STARTED" | "ENDED" | "CANCELLED";
  sessionDate: string;
  label: string | null;
  claimed: boolean;
  mine: boolean;
  rows: number;
}

export interface TableRow {
  rowId: string;
  team: number;
  leaderName: string;
  leaderUniversityId: string;
  day: string;
  time: string;
  minutes: number;
}

export interface TaSession {
  id: string;
  subjectId: string;
  taName: string;
  status: TaSessionSummary["status"];
  sessionDate: string;
  label: string | null;
  claimed: boolean;
  mine: boolean;
  owner: { staffUserId: string; displayName: string | null } | null;
  confirmedAt: string | null;
  version: number;
  table: TableRow[];
  issues: ParseIssue[];
  counts: { rows: number; blocking: number; warnings: number };
  unpublishedChanges: boolean;
}

export interface RowInput {
  team?: number;
  leaderName?: string;
  leaderUniversityId?: string | null;
  day?: string;
  time?: string;
}

export type EntryStatus =
  | "QUEUED"
  | "ASKING"
  | "COMING"
  | "INSIDE"
  | "DONE"
  | "MISSED"
  | "MOVED"
  | "NOT_DISCUSSED"
  | "CANCELLED";

export interface QueueEntry {
  id: string;
  number: number;
  leaderName: string;
  time: string | null;
  lane: "MAIN" | "LATE";
  status: EntryStatus;
  mainSeq: number | null;
  lateSeq: number | null;
  comingDeadlineAt: string | null;
  arriveDeadlineAt: string | null;
  /** Decided by the server: whether Remove is allowed for this team now. */
  canRemove: boolean;
  canSendLate: boolean;
  canMove: boolean;
}

/** The TA's view of a started session. `allowed` is decided by the server; the panel only reads it. */
export interface QueueView {
  session: { id: string; status: TaSessionSummary["status"]; version: number };
  serverNow: string;
  activeEntryId: string | null;
  allowed: { next: boolean; arrived: boolean; absent: boolean; finish: boolean; undo: boolean };
  entries: QueueEntry[];
}
