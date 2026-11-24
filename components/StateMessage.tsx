import type { ReactNode } from "react";

/** An empty state or an error: a title, one line, and an optional action. */
export function StateMessage({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-card px-5 py-8 text-center">
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="mt-1 text-sm text-muted">{body}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
