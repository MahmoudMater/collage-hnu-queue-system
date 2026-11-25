/**
 * Team leader (student) sign-in with Google through the backend (PKCE). The
 * backend sets httpOnly cookies on this site's own origin; nothing secret is
 * kept here except the one-time code verifier in sessionStorage during the
 * redirect. TAs and admins sign in on the main site, not here.
 */
function base64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export class SignInError extends Error {}

const STUDENT_VERIFIER_KEY = "queue.student.verifier";
const STUDENT_RETURN_KEY = "queue.student.returnTo";

export async function startStudentSignIn(returnTo: string): Promise<void> {
  const verifier = base64Url(crypto.getRandomValues(new Uint8Array(32)));
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  sessionStorage.setItem(STUDENT_VERIFIER_KEY, verifier);
  sessionStorage.setItem(STUDENT_RETURN_KEY, returnTo);
  const res = await fetch("/api/v1/student/auth/google/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client: "WEB",
      redirectUri: `${location.origin}/student/callback`,
      codeChallenge: base64Url(new Uint8Array(digest)),
    }),
  });
  if (!res.ok) throw new SignInError(`start ${res.status}`);
  const { url } = (await res.json()) as { url: string };
  location.assign(url);
}

/** Swap the one-time code for the sign-in cookies; returns the page to go back to. */
export async function finishStudentSignIn(code: string): Promise<string> {
  const verifier = sessionStorage.getItem(STUDENT_VERIFIER_KEY);
  if (!verifier) throw new SignInError("missing verifier");
  const res = await fetch("/api/v1/student/auth/browser/google/exchange", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      codeVerifier: verifier,
      client: "WEB",
      redirectUri: `${location.origin}/student/callback`,
    }),
  });
  sessionStorage.removeItem(STUDENT_VERIFIER_KEY);
  if (!res.ok) throw new SignInError(`exchange ${res.status}`);
  const back = sessionStorage.getItem(STUDENT_RETURN_KEY);
  sessionStorage.removeItem(STUDENT_RETURN_KEY);
  // Only come back to a page of this site.
  return back && back.startsWith("/") && !back.startsWith("//") ? back : "/";
}

export async function studentSignOut(): Promise<void> {
  await fetch("/api/v1/student/auth/browser/logout", { method: "POST" });
}
