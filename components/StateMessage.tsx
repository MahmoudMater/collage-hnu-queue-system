import type { ReactNode } from "react";

/**
 * An empty state or an error: a title, one line, and an optional action.
 * An empty list sets `empty`: three ghost rows show where the real ones will appear.
 */
export function StateMessage({
  title,
  body,
  empty = false,
  code,
  children,
}: {
  title: string;
  body: string;
  empty?: boolean;
  /** A page that is not there or would not load shows its code, large (for example 404). */
  code?: string;
  children?: ReactNode;
}) {
  return (
    <div className={code ? "dq-card dq-state dq-state--page" : "dq-card dq-state"}>
      {code ? <p className="dq-state__code">{code}</p> : null}
      {empty ? (
        <div className="dq-state__ghost" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      ) : null}
      <h2 className="heading">{title}</h2>
      {body ? <p>{body}</p> : null}
      {children ? <div className="dq-state__action">{children}</div> : null}
    </div>
  );
}
