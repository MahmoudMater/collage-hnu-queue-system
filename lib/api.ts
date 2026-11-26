import { notFound } from "next/navigation";

const API_URL = process.env.API_URL ?? "http://localhost:5000";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/**
 * Server-side read of the public API. Always fresh. A missing resource shows
 * the not-found page; any other failure reaches the error boundary.
 */
export async function apiGet<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  } catch {
    throw new ApiError(0, "The server is not reachable.");
  }
  if (res.status === 404) notFound();
  if (!res.ok) throw new ApiError(res.status, `The server answered ${res.status}.`);
  return (await res.json()) as T;
}

/**
 * For a page's head: when the API fails, the head keeps the site's own title
 * and the page itself says what went wrong. A missing resource is still not found.
 */
export function orNull(error: unknown): null {
  if (error instanceof ApiError) return null;
  throw error;
}

/** Browser-side read through this site's own /api proxy. */
export async function clientGet<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new ApiError(res.status, `The server answered ${res.status}.`);
  return (await res.json()) as T;
}
