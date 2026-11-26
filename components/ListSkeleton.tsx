import { t } from "@/lib/strings";

/** Placeholder rows shown while a list loads. */
export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div role="status" aria-busy="true" aria-label={t.state.loading} className="dq-stack mt-4">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="dq-skel" />
      ))}
    </div>
  );
}
