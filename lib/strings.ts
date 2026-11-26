/**
 * Every user-facing string lives here, so the wording can change without
 * touching components. The site is in English and left to right.
 */
import type { StatusWord } from "./types";

export const t = {
  appName: "Discussion queue",
  home: {
    title: "Which level are you in?",
    intro: "Pick your level to see its subjects, who is inside now and when your turn is.",
    empty: {
      title: "No subjects yet",
      body: "They will show here as soon as one is added.",
    },
  },
  level: {
    names: ["Level 1", "Level 2", "Level 3", "Level 4"],
    intro: "Pick a subject to see who is inside now and when your turn is.",
    change: "Change level",
    today: "Today",
    other: "Other days",
  },
  schedule: {
    /** What a student reads about the TA's pace; empty when there is nothing to say. */
    delay: (minutes: number | null) =>
      minutes === null
        ? ""
        : minutes === 0
          ? "Running on time"
          : minutes > 0
            ? `Running about ${minutes} minutes behind`
            : "Ahead of schedule",
    breakReasons: { PRAYER: "prayer", LUNCH: "lunch", OTHER: "break" } as Record<string, string>,
    onBreak: "The TA is on a break",
    backAt: "back at",
    breakOver: "the break is running a little over; the TA will be back soon.",
  },
  alert: {
    title: "Alert me when my turn is near",
    help: "Keep this page open. You will hear a sound when two teams or fewer are ahead of you, and again when you are called.",
    teamLabel: "Your team number",
    follow: "Follow this team",
    following: "Following team",
    stop: "Change team",
    enable: "Turn on alerts",
    enabled: "Alerts are on",
    notHere: "This team is not in the queue right now.",
    near: (position: number) =>
      position === 1
        ? "You are next! Stay at the door."
        : `Your turn is near: ${position - 1} ${position - 1 === 1 ? "team" : "teams"} ahead of you.`,
    /** A late team waits for a slot an on-time team leaves open, so a position is not a promise. */
    nearLate: (position: number) =>
      position === 1
        ? "You are first in the late queue. You will be called as soon as a slot opens."
        : `You are number ${position} in the late queue. Stay close.`,
    now: "Your team is being called now!",
    titleNear: "Your turn is near",
    titleNow: "Your turn now!",
    keepAwake: "Keep the screen on",
    noVibration: "Your phone does not vibrate from the browser, so there is sound only.",
    silentHint: "On silent you will not hear the sound, so watch the screen.",
  },
  latePolicy: {
    notice: (minutes: number) =>
      minutes === 0
        ? "Note: a team that misses its slot cannot ask for a new turn. Only the TA can bring it back."
        : `Note: a team more than ${minutes} minutes late cannot ask for a new turn. Only the TA can bring it back.`,
  },
  subject: {
    sessions: "Discussions",
    empty: {
      title: "No open discussions",
      body: "They will show here once the TA confirms the schedule.",
    },
    back: "All levels",
  },
  session: {
    back: "Subject",
    downloadSheet: "Download the sheet (PDF)",
    scheduleTitle: "Schedule",
    readOnly: "The schedule is read-only. The live queue starts when the TA starts the discussion.",
    team: "Team",
    time: "Time",
    noTeams: "No teams in the schedule.",
  },
  live: {
    insideTitle: "Inside now",
    nobodyInside: "Nobody is inside now",
    asking: "Calling team",
    askingHint: "It has a short time to answer before the turn passes",
    coming: "On the way",
    comingHint: "It should arrive before the time runs out",
    inside: "In discussion now",
    secondsLeft: "seconds",
    mainTitle: "Queue",
    lateTitle: "Late",
    emptyMain: "Nobody is waiting",
    emptyLate: "No late teams",
    position: "Position",
    scheduledAt: "Slot",
    expectedIn: "expected in about",
    expectedBetween: "expected in",
    minutes: "min",
    now: "It is its turn now",
    movedIn: "Moved from another discussion",
    late: "Late",
    ended: "The discussion has ended.",
    movedTitle: "Moved",
    movedTo: "moved to",
    notDiscussedTitle: "Not discussed",
    notDiscussedHint: "If you still want a discussion, ask another TA of this subject.",
    mine: "Your team",
    connectionLost: "The connection dropped. We are trying again and refreshing the page now and then.",
    connecting: "Connecting…",
    live: "Live",
  },
  leader: {
    signInPrompt: "Are you a team leader? Sign in with Google to follow your turn.",
    signIn: "Sign in with Google",
    working: "…",
    codeTitle: "Bind your team",
    codeHelp: "Type your team code (it is on the discussion sheet).",
    codePlaceholder: "For example K7M2QX",
    bind: "Bind",
    bound: "Your team:",
    signOut: "Sign out",
    yourTurn: "Your turn! If you are at the door, press I am coming.",
    coming: "I am coming",
    comingDone: "Good, the TA is waiting for you. Go in now.",
    missed: "You missed your slot. If you still want a discussion, ask for a new turn.",
    askAgain: "Ask for a new turn",
    queued: "You are in the late queue now. You will be called when there is a free slot.",
    notInSession: "Your team is not in this discussion.",
    notEligible: "This account is not an approved student. Finish your registration on the main site first.",
    signInFailed: "Sign-in did not finish. Try again.",
    callbackWorking: "Finishing sign-in…",
    tryLater: "try again in",
    seconds: "seconds",
  },
  search: {
    label: "Find your team",
    placeholder: "Leader ID, leader name or team number",
    button: "Search",
    searching: "Searching…",
    invalid: "Type the full ID (9 digits), a team number, or at least 3 letters of the name.",
    notFound: "No team with these details in this subject's discussions.",
    failed: "Could not search right now. Try again.",
    foundIn: "with",
    more: "There are more results. Type the full name or the ID.",
  },
  state: {
    errorTitle: "Something went wrong",
    errorBody: "We could not load the data right now.",
    retry: "Try again",
    notFoundTitle: "This page does not exist",
    notFoundBody: "The link may be old, or the discussion is not confirmed yet.",
    goHome: "Back to the levels",
    loading: "Loading…",
  },
} as const;

export const leaderText = t.leader;

export const statusLabel: Record<StatusWord, string> = {
  NOT_STARTED: "Not started",
  RUNNING: "Live",
  ENDED: "Ended",
};

export function teamsCount(n: number): string {
  return n === 0 ? "No teams" : n === 1 ? "1 team" : `${n} teams`;
}

export function sessionsCount(n: number): string {
  return n === 0 ? "No discussions" : n === 1 ? "1 discussion" : `${n} discussions`;
}

/** The first two words of a name, for a one-line cell. */
export function shortName(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).join(" ");
}

/** Whole minutes, at least 1, for an estimate in seconds. */
export function minutesOf(seconds: number): number {
  return Math.max(1, Math.round(seconds / 60));
}

/** A schedule time is already written the English way, for example "8:20 AM". */
export function formatTime(time: string | null): string {
  return time ?? "";
}

/** An instant as a clock time in Cairo, for example "1:30 PM". */
export function clockTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Africa/Cairo" }).format(d);
}

/** YYYY-MM-DD as a long date. */
export function formatDate(date: string): string {
  const d = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(d);
}

/** Friendlier text for server error codes a leader can meet; anything else shows the server's own message. */
export const errorText: Record<string, string> = {
  FORBIDDEN: "You are not allowed to do this.",
  LATE_REQUESTS_CLOSED: "You are past the allowed time, so you cannot ask for a new turn. Talk to the TA if you have an excuse.",
  CLAIM_CODE_INVALID: "This code does not match any team.",
  TEAM_ALREADY_BOUND: "This team is bound to another account. If that is wrong, ask the TA to unbind it.",
  ALREADY_LEADING: "Your account already leads another team in this subject.",
  TOO_MANY_ATTEMPTS: "Too many wrong codes. Wait a little and try again.",
  CLAIM_UNAVAILABLE: "Binding is not available right now. Try again shortly.",
  NOT_A_LEADER: "Your account is not bound to a team in this subject.",
  TEAM_NOT_IN_SESSION: "Your team is not in this discussion.",
  SESSION_NOT_STARTED: "The discussion is not running now.",
  ILLEGAL_TRANSITION: "The state changed, so this cannot be done now.",
};
