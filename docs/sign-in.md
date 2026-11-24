# Sign-in from the queue site

Decision (2026-11-24, to be adjusted after manual testing): the Next.js app proxies `/api/*` to the backend with a rewrite, so the browser only talks to the queue site's own origin for HTTP. Cookies set by the backend then belong to the queue site and stay first-party, whatever the production hostnames turn out to be. See ADR 0010 in the backend repository.

## What the backend must allow

Set these in the backend environment (the example file already has the local values):

| Setting | Local value | Why |
| --- | --- | --- |
| `CORS_ORIGINS` | `http://localhost:3000` | The public board's socket connects straight to the API from the browser. |
| `STAFF_AUTH_WEB_REDIRECTS` | `http://localhost:3000/staff/callback` | The browser sign-in origin check for TAs and admins. |
| `STUDENT_AUTH_WEB_REDIRECTS` | `http://localhost:3000/student/callback` | The same check for team leaders. |

In production use the queue site's real origin in all three. Cookie settings stay at the backend defaults (`*_COOKIE_DOMAIN` empty, `*_COOKIE_SECURE=true` on HTTPS).

## Local steps

1. Start the backend (port 5000 in the example file) with `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` set and the staff and student callback URLs registered for that Google client.
2. Set `NEXT_PUBLIC_API_URL=http://localhost:5000` and `NEXT_PUBLIC_SOCKET_URL=http://localhost:5000` for the queue site and run `npm run dev` (port 3000).
3. Open a page that needs sign-in. The site calls `/api/v1/...` on its own origin; the rewrite sends it to the backend.

Without Google credentials the public pages (subjects, session cards, the live queue) still work; only TA and leader actions need sign-in.

## Still open

The real deployment hostnames. When they are known, record them here and in the backend settings above.
