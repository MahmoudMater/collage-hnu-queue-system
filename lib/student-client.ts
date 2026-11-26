/**
 * Browser-side calls for a signed-in team leader. Requests go to this site's
 * own /api, carry the student cookie, and try one refresh when it has expired.
 */
import { AuthRequired, RequestError } from "./request-error";

async function refresh(): Promise<boolean> {
  const res = await fetch("/api/v1/student/auth/browser/refresh", { method: "POST", cache: "no-store" });
  return res.ok;
}

export async function studentFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const send = () => fetch(path, { ...init, cache: "no-store" });
  let res = await send();
  if (res.status === 401 && (await refresh())) res = await send();
  if (res.status === 401) throw new AuthRequired();
  if (!res.ok) {
    let body: { error?: { code?: string; message?: string; details?: { retryAfterSeconds?: number } } } = {};
    try {
      body = await res.json();
    } catch {
      /* no JSON body */
    }
    const error = new RequestError(res.status, body.error?.code ?? "REQUEST_FAILED", body.error?.message ?? `The server answered ${res.status}.`);
    (error as RequestError & { retryAfterSeconds?: number }).retryAfterSeconds = body.error?.details?.retryAfterSeconds;
    throw error;
  }
  return (await res.json()) as T;
}

export const studentPost = <T>(path: string, body?: unknown) =>
  studentFetch<T>(path, {
    method: "POST",
    ...(body === undefined ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  });
