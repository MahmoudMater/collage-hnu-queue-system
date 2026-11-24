/**
 * Every user-facing string lives here, so the language can change without
 * touching components. The interface is Arabic and right to left for now.
 */
import type { StatusWord } from "./types";

export const t = {
  appName: "طابور المناقشات",
  home: {
    title: "المواد",
    intro: "اختار المادة وشوف مين جوه دلوقتي ودورك إمتى.",
    empty: {
      title: "مفيش مواد لسه",
      body: "هتظهر هنا أول ما حد يضيف مادة.",
    },
  },
  subject: {
    sessions: "المناقشات",
    empty: {
      title: "مفيش مناقشات مفتوحة",
      body: "هتظهر هنا أول ما المعيد يأكد الجدول.",
    },
    back: "كل المواد",
  },
  session: {
    back: "المادة",
    scheduleTitle: "الجدول",
    readOnly: "الجدول للقراءة بس. الطابور الحي بيبدأ لما المعيد يبدأ المناقشة.",
    team: "تيم",
    time: "الميعاد",
    noTeams: "مفيش تيمات في الجدول.",
  },
  live: {
    insideTitle: "جوه دلوقتي",
    nobodyInside: "مفيش حد جوه دلوقتي",
    asking: "بنسأل تيم",
    askingHint: "عنده وقت يرد قبل ما الدور يعدّي",
    coming: "جاي دلوقتي",
    comingHint: "المفروض يوصل قبل ما الوقت يخلص",
    inside: "بيناقش دلوقتي",
    secondsLeft: "ثانية",
    mainTitle: "الطابور",
    lateTitle: "المتأخرين",
    emptyMain: "مفيش حد مستني",
    emptyLate: "مفيش متأخرين",
    position: "الدور",
    scheduledAt: "ميعاده",
    expectedIn: "متوقع بعد حوالي",
    expectedBetween: "متوقع بعد",
    minutes: "دقيقة",
    now: "دوره دلوقتي",
    movedIn: "اتنقل من مناقشة تانية",
    late: "متأخر",
    ended: "المناقشة خلصت.",
    mine: "تيمك",
    connectionLost: "الاتصال اتقطع. بنحاول نرجع وبنحدّث الصفحة كل شوية.",
    connecting: "بنوصّل…",
    live: "مباشر",
  },
  search: {
    label: "دوّر على رقم تيمك",
    placeholder: "مثلاً 21",
    button: "دوّر",
    searching: "بدوّر…",
    invalid: "اكتب رقم التيم بالأرقام.",
    notFound: "التيم ده مش موجود في أي مناقشة هنا.",
    failed: "مقدرتش أدوّر دلوقتي. جرّب تاني.",
    foundIn: "موجود عند",
  },
  state: {
    errorTitle: "حصلت مشكلة",
    errorBody: "مقدرناش نجيب البيانات دلوقتي.",
    retry: "جرّب تاني",
    notFoundTitle: "الصفحة دي مش موجودة",
    notFoundBody: "اللينك ممكن يكون قديم أو المناقشة لسه ماتأكدتش.",
    goHome: "ارجع للمواد",
    loading: "بحمّل…",
  },
} as const;

export const statusLabel: Record<StatusWord, string> = {
  NOT_STARTED: "لسه ماابتدتش",
  RUNNING: "شغالة",
  ENDED: "خلصت",
};

/** "4 تيمات", "تيم واحد": plain Arabic count words for small numbers. */
export function teamsCount(n: number): string {
  if (n === 0) return "مفيش تيمات";
  if (n === 1) return "تيم واحد";
  if (n === 2) return "تيمين";
  return `${n} ${n <= 10 ? "تيمات" : "تيم"}`;
}

export function sessionsCount(n: number): string {
  if (n === 0) return "مفيش مناقشات";
  if (n === 1) return "مناقشة واحدة";
  if (n === 2) return "مناقشتين";
  return `${n} ${n <= 10 ? "مناقشات" : "مناقشة"}`;
}

/** The first two words of a name, for a one-line cell. */
export function shortName(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).join(" ");
}

/** Whole minutes, at least 1, for an estimate in seconds. */
export function minutesOf(seconds: number): number {
  return Math.max(1, Math.round(seconds / 60));
}

/** Presentation only: show the schedule time with Arabic AM and PM markers. */
export function formatTime(time: string | null): string {
  if (!time) return "";
  return time.replace(/\s?AM$/i, " ص").replace(/\s?PM$/i, " م");
}

/** YYYY-MM-DD as a long Arabic date with Latin digits. */
export function formatDate(date: string): string {
  const d = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(d);
}

/** TA and admin screens. */
export const ta = {
  nav: { link: "المعيد", signOut: "خروج", signedInAs: "داخل بحساب" },
  signIn: {
    title: "دخول المعيد",
    body: "ادخل بحساب Google بتاع الكلية عشان تجهّز مناقشاتك.",
    button: "ادخل بحساب Google",
    working: "بنحوّلك لـ Google…",
    failed: "الدخول ماتمش. جرّب تاني.",
    callbackWorking: "بنكمّل الدخول…",
    notEligible: "الحساب ده مش مسموح له يدخل كمعيد.",
    studentEmail: "الإيميل ده مسجّل كطالب، استخدم حساب المعيد.",
    unavailable: "الدخول مش متاح دلوقتي. جرّب بعد شوية.",
    needsConfirmation: "وصلك إيميل تأكيد. أكّد الدخول منه وارجع هنا.",
    needed: "لازم تدخل الأول عشان تكمّل.",
  },
  home: {
    title: "موادي",
    intro: "المواد اللي إنت معيد فيها.",
    empty: { title: "مفيش مواد ليك لسه", body: "لما حد يربطك بمادة هتظهر هنا." },
  },
  subject: {
    back: "موادي",
    uploadTitle: "ارفع جدول المناقشات",
    uploadHelp: "ملف PDF اتصدّر من الشيت، لحد 5 ميجا.",
    chooseFile: "اختار ملف PDF",
    upload: "ارفع وافحص",
    uploading: "بنقرا الملف…",
    duplicate: "الملف ده اترفع قبل كده، ده التقرير بتاعه.",
    report: "نتيجة قراءة الملف",
    rows: "صف",
    tables: "جدول",
    blocking: "مشكلة لازم تتصلّح",
    warnings: "تنبيه",
    namesFound: "الأسماء اللي في الملف",
    createTitle: "اعمل المناقشات",
    date: "تاريخ المناقشة",
    dateHelp: "لو سيبته فاضي هيبقى النهارده.",
    label: "وصف (اختياري)",
    labelPlaceholder: "مثلاً الأسايمنت التاني والتالت",
    create: "اعمل المناقشات",
    creating: "بنجهّزها…",
    sessions: "مناقشات المادة",
    noSessions: "مفيش مناقشات لسه. ارفع ملف الجدول الأول.",
    unclaimed: "لسه محدش حجز الاسم ده",
    mine: "بتاعتك",
    other: "عند معيد تاني",
  },
  session: {
    back: "المادة",
    claimTitle: "الاسم ده بتاعك؟",
    claimBody: "اختار اسمك من الأسماء اللي في الملف عشان تعدّل الجدول وتأكّده.",
    claim: "ده اسمي، احجزه",
    claimedBy: "محجوز لمعيد تاني",
    claimedByMe: "الاسم ده محجوز ليك",
    confirmedNote: "الجدول متأكد وظاهر للطلبة.",
    draftNote: "المناقشة لسه مسودة وماحدش من الطلبة شايفها.",
    unpublished: "فيه تعديلات لسه مانشرتهاش. الطلبة شايفين الجدول القديم لحد ما تأكّد.",
    issues: "المشاكل والتنبيهات",
    noIssues: "مفيش مشاكل في الجدول.",
    apply: "غيّر لـ",
    table: "الجدول",
    team: "تيم",
    edit: "عدّل",
    save: "احفظ",
    cancel: "إلغاء",
    remove: "امسح",
    addRow: "ضيف صف",
    fields: {
      team: "رقم التيم",
      leaderName: "اسم الـ leader",
      leaderUniversityId: "رقم الـ leader (9 أرقام)",
      day: "اليوم",
      time: "الميعاد",
    },
    timePlaceholder: "8:20 AM",
    replaceTitle: "استبدل الجدول بملف جديد",
    replaceHelp: "هناخد جدولك بس من الملف الجديد.",
    replace: "استبدل",
    confirm: "أكّد الجدول",
    confirming: "بنأكّد…",
    confirmHelp: "بعد التأكيد الطلبة بيشوفوا الجدول، وكل تيم بياخد كود.",
    confirmed: "اتأكد",
    openPublic: "افتح صفحة الطلبة",
    blockingLeft: "مشاكل لازم تتصلّح قبل التأكيد:",
  },
  state: { loading: "بحمّل…", failed: "مقدرناش نحمّل البيانات.", retry: "جرّب تاني" },
} as const;

export const dayLabel: Record<string, string> = {
  Monday: "الاثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربع",
  Thursday: "الخميس",
  Friday: "الجمعة",
  Saturday: "السبت",
  Sunday: "الأحد",
};

/** A short Arabic title for each kind of issue the backend reports. */
export const issueTitle: Record<string, string> = {
  UNREADABLE_ROW: "سطر مش مفهوم",
  INVALID_TIME: "ميعاد غلط",
  DUPLICATE_TEAM_NUMBER: "رقم تيم متكرر",
  DUPLICATE_SLOT: "نفس الميعاد لتيمين",
  TIME_GOES_BACKWARDS: "الميعاد رجع لورا",
  GAP_NOT_FIVE_MINUTES: "الفرق مش 5 دقايق",
  UNPARSED_TEXT: "نص مش صف",
  WEEKDAY_MISMATCH: "اليوم مش زي تاريخ المناقشة",
};

/** Arabic text for server error codes we expect; anything else shows the server's message. */
export const errorText: Record<string, string> = {
  NAME_ALREADY_CLAIMED: "الاسم ده اتحجز لمعيد تاني.",
  CANNOT_CONFIRM: "مش هينفع تأكّد دلوقتي.",
  TEAM_IN_ANOTHER_SESSION: "فيه تيمات من دول مستنية في مناقشة تانية.",
  NOT_EDITABLE: "المناقشة دي ابتدت أو خلصت ومش بتتعدّل.",
  NOT_A_PDF: "الملف ده مش PDF.",
  FILE_REQUIRED: "اختار ملف الأول.",
  FILE_TOO_LARGE: "الملف أكبر من 5 ميجا.",
  PDF_NO_TEXT: "الـ PDF ده مفيهوش نص. ارفع النسخة المتصدّرة من الشيت مش صورة.",
  NO_SCHEDULE_ROWS: "مالقيناش صفوف جدول في الملف.",
  PDF_READER_UNAVAILABLE: "قراءة الـ PDF مش متاحة دلوقتي.",
  PDF_UNREADABLE: "الملف ده مش بيتقري كـ PDF.",
  DATE_IN_THE_PAST: "التاريخ ده عدّى.",
  VALIDATION_FAILED: "راجع الخانات.",
  TA_NAME_NOT_IN_FILE: "الملف الجديد مفيهوش جدول للاسم ده.",
  FORBIDDEN: "مش مسموح لك بالحاجة دي.",
};

/** Arabic for the server's plain-English reasons shown when confirming is refused. */
export const reasonText: Record<string, string> = {
  "Fix the blocking issues in the table first.": "صلّح المشاكل اللي لازم تتصلّح في الجدول الأول.",
  "Claim the TA name first.": "احجز اسمك الأول.",
  "The table has no teams.": "الجدول مفيهوش تيمات.",
  "This session has already started or ended.": "المناقشة دي ابتدت أو خلصت.",
};
