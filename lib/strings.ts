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
    /** The name of the level switcher, for a screen reader. */
    switch: "Level",
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
    yourTurn: "Your turn",
    title: "Alert me when my turn is near",
    sound: "Sound alerts",
    help: "A sound when two teams or fewer are ahead of you, and again when you are called. Keep this page open.",
    teamLabel: "Your team number",
    follow: "Follow this team",
    following: "Following team",
    stop: "Change team",
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
    /** Under a subject's title: how many discussions, and how many are live. */
    summary: (total: number, live: number) =>
      `${total === 1 ? "1 discussion" : `${total} discussions`}${live > 0 ? ` · ${live} live now` : ""}`,
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
    starts: "Starts",
    teams: "Teams",
    firstSlot: "First slot",
    lastSlot: "Last slot",
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
    /** The two tabs read "Main queue" and "Late queue"; a narrow phone drops the second word. */
    tabMain: "Main",
    tabLate: "Late",
    tabQueue: "queue",
    queues: "Queues",
    you: "You",
    /** Under a long queue: "1–8 of 15". */
    of: "of",
    previousTeams: "Previous teams",
    nextTeams: "Next teams",
    showMine: "Show my team",
    next: "Next",
    soon: "Soon",
    waiting: "Waiting",
    about: "about",
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
    connectionLost: "The connection dropped. We are trying again and refreshing the page now and then.",
    connecting: "Connecting…",
    live: "Live",
  },
  leader: {
    signInPrompt: "Are you a team leader? Sign in to answer the call from here.",
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
    placeholder: "ID, name or team number",
    button: "Search",
    searching: "Searching…",
    invalid: "Type the full ID (9 digits), a team number, or at least 3 letters of the name.",
    notFound: "No team with these details in this subject's discussions.",
    failed: "Could not search right now. Try again.",
    foundIn: "with",
    more: "There are more results. Type the full name or the ID.",
  },
  landing: {
    nav: { how: "How it works", leaders: "Team leaders", faq: "Questions", open: "Open the queue" },
    kicker: "For students and team leaders",
    headline: "Know when it’s",
    headlineMark: "your turn.",
    sub: "See who is inside now and where your team stands. Keep the page open and you will hear a sound when two teams or fewer are ahead of you.",
    cta: "Pick your level",
    note: "No account needed to watch. Only team leaders sign in.",
    /** The small numbered label above each section's title. */
    sections: { start: "Start here", how: "How it works", get: "What you get", leaders: "Team leaders", faq: "Questions" },
    closing: "Your team is",
    closingMark: "on the board.",
    stepsTitle: "Three taps to your place in the queue",
    steps: [
      { title: "Pick your level and subject", body: "Tap your level, then the subject you have a discussion in. No account, nothing to install." },
      { title: "Find your team", body: "Search by leader ID, leader name or team number. You see the TA, the day and your slot." },
      { title: "Follow your turn", body: "Turn on alerts and keep the page open. You hear a sound when your turn is near, and again when you are called." },
    ],
    featuresTitle: "Built for the minutes before you go in",
    features: {
      live: { title: "Live, without refreshing", body: "The team inside, the main queue and the late queue update on their own. Your team carries a You tag." },
      pace: { title: "An honest wait", body: "See how far the TA is from the schedule, and when a break ends." },
      sound: { title: "A sound when you are near", body: "Two teams or fewer ahead of you, then again when you are called." },
      late: { title: "Missed your slot?", body: "Ask for a new turn and wait in the late queue." },
      sheet: { title: "The sheet, one tap away", body: "Every open discussion carries its sheet as a PDF." },
    },
    leadersTitle: "Leading a team?",
    leadersMark: "Answer the call",
    leadersTail: "from your phone.",
    leadersBody: "Sign in with Google, type the team code from the discussion sheet, and press I am coming when your team is called.",
    faqTitle: "Before you ask",
    faq: [
      { q: "Do I need to sign in?", a: "No. Anyone can watch a queue and follow a team by its number. Only team leaders sign in, with Google, to answer the call or ask for a new turn." },
      { q: "Will I hear the alert on silent?", a: "No. On silent you will not hear the sound, so watch the screen. Keep the page open, and turn on “Keep the screen on” if you like." },
      { q: "What if my team is late?", a: "A team that misses its slot can ask for a new turn and wait in the late queue. If the TA has set a limit, a team later than that cannot ask; only the TA can bring it back." },
      { q: "Where is my team code?", a: "It is on the discussion sheet. Download the sheet from the discussion’s card." },
    ],
    footLevels: "Levels",
    /** The picture of a live discussion on the landing page. Invented names, never real students. */
    demo: {
      subject: "Operating Systems",
      ta: "Eng. Sara Ibrahim",
      label: "Lab 204",
      inside: { number: 12, leaderName: "Omar Khaled", seconds: 42 },
      main: [
        { number: 13, leaderName: "Nour Hassan", time: "8:30 AM" },
        { number: 14, leaderName: "Salma Tarek", time: "8:40 AM" },
        { number: 15, leaderName: "Karim Mostafa", time: "8:50 AM" },
        { number: 16, leaderName: "Mariam Adel", time: "9:00 AM" },
        { number: 17, leaderName: "Ziad Samy", time: "9:10 AM" },
      ],
      late: [{ number: 9, leaderName: "Ahmed Fathy", time: null }],
      mine: 14,
      breakBack: "1:30 PM",
    },
  },
  /** What search engines and link previews read. No student's name goes in here. */
  seo: {
    shortName: "Queue",
    /** The home page's title; every other page reads "<its title> · Discussion queue". */
    title: "Discussion queue: know when it’s your turn",
    description:
      "See who is inside a discussion now and where your team stands in the queue. Get a sound when your turn is near. No account needed to watch.",
    level: {
      title: (level: number) => `Level ${level} subjects`,
      description: (level: number) =>
        `Level ${level} subjects and their discussions. Pick a subject to see who is inside now and when your team’s turn is.`,
    },
    subject: {
      title: (name: string) => `${name} discussions`,
      description: (name: string, total: number) =>
        total === 0
          ? `Discussions for ${name} show here once the TA confirms the schedule.`
          : `${sessionsCount(total)} for ${name}. Find your team by leader ID, leader name or team number, and see who is inside now.`,
    },
    session: {
      title: (subject: string, ta: string) => `${subject} with ${ta}`,
      description: (details: string) =>
        `${details}. See who is inside now, the main queue and the late queue, and get a sound when your team’s turn is near.`,
    },
    signIn: "Signing in",
    /** Words on the share images. */
    og: {
      alt: "Discussion queue: see who is inside now and when it is your team’s turn.",
      homeSub: "See who is inside and where you stand.",
      homeFacts: ["Live queue", "Sound alerts", "No account needed"],
      subjects: (n: number) => (n === 1 ? "1 subject" : `${n} subjects`),
      subject: "Subject",
      discussion: "Discussion",
      discussions: "Discussions",
      subjectSub: "Find your team and see who is inside now.",
    },
  },
  theme: {
    /** The name of the button in the header, for a screen reader and as a tooltip. */
    toggle: "Switch between light and dark",
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

/** The word beside a discussion's team count. */
export function teamsWord(n: number): string {
  return n === 1 ? "team" : "teams";
}

export function sessionsCount(n: number): string {
  return n === 0 ? "No discussions" : n === 1 ? "1 discussion" : `${n} discussions`;
}

/** Whole minutes, at least 1, for an estimate in seconds. */
export function minutesOf(seconds: number): number {
  return Math.max(1, Math.round(seconds / 60));
}

/** Keeps a time and its AM or PM on one line. */
const joined = (time: string) => time.replace(/ (?=[AP]M$)/i, "\u00a0");

/** A schedule time is already written the English way, for example "8:20 AM". */
export function formatTime(time: string | null): string {
  return time ? joined(time) : "";
}

/** An instant as a clock time in Cairo, for example "1:30 PM". */
export function clockTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return joined(new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Africa/Cairo" }).format(d));
}

/** YYYY-MM-DD as the three lines of a calendar tile: "Thu", "26", "Nov". */
export function dateParts(date: string): { weekday: string; day: string; month: string } {
  const d = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return { weekday: "", day: date, month: "" };
  const part = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(d);
  return { weekday: part({ weekday: "short" }), day: part({ day: "numeric" }), month: part({ month: "short" }) };
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
