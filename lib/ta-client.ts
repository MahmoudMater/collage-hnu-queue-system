/**
 * Browser-side calls for TAs. Requests go to this site's own /api (proxied to
 * the backend), carry the sign-in cookie, and try one refresh when the access
 * cookie has expired.
 */
export class AuthRequired extends Error {
  constructor() {
    super("Sign-in is required.");
  }
}

export class TaError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fieldErrors: Record<string, string[]> = {},
    readonly details: Record<string, unknown> = {},
  ) {
    super(message);
  }
}

async function refresh(): Promise<boolean> {
  const res = await fetch("/api/v1/staff/auth/browser/refresh", {
    method: "POST",
    cache: "no-store",
  });
  return res.ok;
}

async function parseError(res: Response): Promise<TaError> {
  let body: { error?: { code?: string; message?: string; field_errors?: Record<string, string[]>; details?: Record<string, unknown> } } = {};
  try {
    body = await res.json();
  } catch {
    /* no JSON body */
  }
  return new TaError(
    res.status,
    body.error?.code ?? "REQUEST_FAILED",
    body.error?.message ?? `The server answered ${res.status}.`,
    body.error?.field_errors,
    body.error?.details,
  );
}

export async function taFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const send = () => fetch(path, { ...init, cache: "no-store" });
  let res = await send();
  if (res.status === 401 && (await refresh())) res = await send();
  if (res.status === 401) throw new AuthRequired();
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as T;
}

export const taGet = <T>(path: string) => taFetch<T>(path);

export const taSend = <T>(method: "POST" | "PATCH" | "DELETE", path: string, body?: unknown) =>
  taFetch<T>(path, {
    method,
    ...(body === undefined
      ? {}
      : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  });

/** Upload a schedule PDF (multipart field "file"). */
export function taUpload<T>(subjectId: string, file: File): Promise<T> {
  const form = new FormData();
  form.append("file", file);
  return taFetch<T>(`/api/v1/discussions/ta/subjects/${encodeURIComponent(subjectId)}/uploads`, {
    method: "POST",
    body: form,
  });
}
