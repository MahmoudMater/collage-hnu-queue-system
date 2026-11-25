import { describeError } from "@/lib/describe-error";

export function ErrorNote({ error }: { error: unknown }) {
  if (!error) return null;
  return (
    <p role="alert" className="rounded-lg bg-info-soft px-3 py-2 text-sm text-info">
      {describeError(error)}
    </p>
  );
}
