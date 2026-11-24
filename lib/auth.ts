/**
 * Staff sign-in with Google through the backend (PKCE). The backend sets
 * httpOnly cookies on this site's own origin; nothing secret is kept here
 * except the one-time code verifier in sessionStorage during the redirect.
 */
const VERIFIER_KEY = "queue.staff.verifier";

function base64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export class SignInError extends Error {}

export async function startStaffSignIn(): Promise<void> {
  const verifier = base64Url(crypto.getRandomValues(new Uint8Array(32)));
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  sessionStorage.setItem(VERIFIER_KEY, verifier);
  const res = await fetch("/api/v1/staff/auth/google/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client: "WEB",
      redirectUri: `${location.origin}/staff/callback`,
      codeChallenge: base64Url(new Uint8Array(digest)),
    }),
  });
  if (!res.ok) throw new SignInError(`start ${res.status}`);
  const { url } = (await res.json()) as { url: string };
  location.assign(url);
}

export async function finishStaffSignIn(code: string): Promise<void> {
  const verifier = sessionStorage.getItem(VERIFIER_KEY);
  if (!verifier) throw new SignInError("missing verifier");
  const res = await fetch("/api/v1/staff/auth/browser/google/exchange", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      codeVerifier: verifier,
      client: "WEB",
      redirectUri: `${location.origin}/staff/callback`,
    }),
  });
  sessionStorage.removeItem(VERIFIER_KEY);
  if (!res.ok) throw new SignInError(`exchange ${res.status}`);
}

export async function staffSignOut(): Promise<void> {
  await fetch("/api/v1/staff/auth/browser/logout", { method: "POST" });
}
