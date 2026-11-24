/** Shapes returned by the public discussion API (see the backend spec 0012). */

export type StatusWord = "NOT_STARTED" | "RUNNING" | "ENDED";

export interface SubjectSummary {
  id: string;
  name: string;
  sessionCount: number;
}

export interface SubjectsResponse {
  subjects: SubjectSummary[];
}

export interface SessionCard {
  id: string;
  taName: string;
  label: string | null;
  /** Calendar date, YYYY-MM-DD. */
  date: string;
  status: StatusWord;
  teamCount: number;
}

export interface SessionCardsResponse {
  subject: { id: string; name: string };
  sessions: SessionCard[];
}

export interface PublicTeam {
  number: number;
  /** As written in the schedule, for example "8:20 AM". */
  time: string | null;
  lane: "MAIN" | "LATE";
  status: string;
  leaderName?: string;
}

export interface SessionSnapshot {
  session: {
    id: string;
    subject: { id: string; name: string };
    taName: string;
    label: string | null;
    date: string;
    status: StatusWord;
  };
  seq: number;
  serverNow: string;
  teams: PublicTeam[];
}

export type QueueReason = "MOVED_IN" | "LATE" | null;

export interface QueueItem {
  number: number;
  time: string | null;
  /** 1 is next. */
  position: number;
  reason: QueueReason;
  leaderName?: string;
  /** Main queue only: seconds until the team is expected to start. */
  etaSeconds?: number;
  etaRangeSeconds?: [number, number];
}

export interface InsideEntry {
  number: number;
  status: "ASKING" | "COMING" | "INSIDE";
  /** Answer deadline while asking, arrival deadline while coming; null inside. */
  deadlineAt: string | null;
  leaderName?: string;
}

/** The live board: the snapshot plus who is inside and both queues. */
export interface LiveSnapshot extends SessionSnapshot {
  inside: InsideEntry | null;
  queues: { main: QueueItem[]; late: QueueItem[] };
  eta: { samples: number; medianSeconds: number | null };
}

/** What a broadcast carries: the full board and the sequence of the previous broadcast. */
export interface LiveBroadcast extends LiveSnapshot {
  fromSeq: number;
}
