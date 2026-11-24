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
