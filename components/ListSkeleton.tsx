import { t } from "@/lib/strings";

/** Placeholder rows shown while a list loads. */
export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div role="status" aria-busy="true" aria-label={t.state.loading} className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-[72px] animate-pulse rounded-xl border border-line bg-card" />
      ))}
    </div>
  );
}
