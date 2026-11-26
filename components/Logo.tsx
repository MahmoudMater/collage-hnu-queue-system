import Link from "next/link";
import { t } from "@/lib/strings";
import { back } from "./PageTransition";

/**
 * The Bubble mark: a speech bubble whose dots shrink like a queue. It takes
 * its colours from the theme. At 20px and under it has two dots, because
 * three merge.
 */
export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg className="dq-mark" width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <rect className="dq-mark__tile" width="48" height="48" />
      <rect className="dq-mark__b" x="8" y="9" width="32" height="23" rx="7" />
      <path className="dq-mark__b" d="M13 28v12l11-9z" />
      {size <= 20 ? (
        <>
          <circle className="dq-mark__cut" cx="18" cy="20.5" r="4.4" />
          <circle className="dq-mark__cut" cx="30" cy="20.5" r="4.4" />
        </>
      ) : (
        <>
          <circle className="dq-mark__cut" cx="17" cy="20.5" r="3.6" />
          <circle className="dq-mark__cut" cx="25.6" cy="20.5" r="2.8" />
          <circle className="dq-mark__cut" cx="32.6" cy="20.5" r="2" />
        </>
      )}
    </svg>
  );
}

/** The lockup: the mark and the name, linking home. */
export function Logo() {
  return (
    <Link href="/" className="dq-logo" transitionTypes={back}>
      <Mark />
      <span>{t.appName}</span>
    </Link>
  );
}
