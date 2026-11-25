import { issueTitle, ta } from "@/lib/strings";
import type { ParseIssue } from "@/lib/ta-types";

/** The problems and warnings found in a table. A suggested time can be applied with one tap. */
export function IssueList({
  issues,
  onApply,
}: {
  issues: ParseIssue[];
  onApply?: (issue: ParseIssue) => void;
}) {
  if (issues.length === 0) return <p className="text-sm text-muted">{ta.session.noIssues}</p>;
  return (
    <ul className="space-y-2">
      {issues.map((issue, i) => (
        <li
          key={`${issue.code}-${issue.team ?? ""}-${issue.line ?? ""}-${i}`}
          className={`rounded-lg px-3 py-2 text-sm ${
            issue.severity === "blocking" ? "bg-danger-soft text-danger" : "bg-info-soft text-info"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium">
              {issueTitle[issue.code] ?? issue.code}
              {issue.team ? ` · ${ta.session.team} ${issue.team}` : ""}
            </span>
            {issue.suggestedTime && onApply ? (
              <button
                type="button"
                onClick={() => onApply(issue)}
                className="shrink-0 rounded-md border border-current px-2 py-0.5 text-xs"
              >
                {ta.session.apply} {issue.suggestedTime}
              </button>
            ) : null}
          </div>
          <p dir="ltr" className="mt-1 text-left text-xs opacity-80">
            {issue.message}
          </p>
        </li>
      ))}
    </ul>
  );
}
