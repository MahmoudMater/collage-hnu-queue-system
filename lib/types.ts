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
