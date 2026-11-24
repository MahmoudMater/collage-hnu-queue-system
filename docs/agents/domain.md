# Domain docs

How the engineering skills should consume this repo's domain documentation.

## Before exploring, read these

- `GLOSSARY.md` at the repo root, if it exists.
- `docs/adr/`: read ADRs that touch the area you are about to work in.
- The backend repository's design for this app: `docs/designs/discussion-queue-board.md` (and the backend `GLOSSARY.md` and `docs/architecture/adr/`). The backend owns the domain rules; this repo is a thin client that renders what the API returns.

If any of these files do not exist, proceed silently. Do not flag their absence.

This is a single-context repo.

## Use the glossary's vocabulary

When your output names a domain concept (team, session, queue entry, main queue, late queue, claim code), use the term as the design and the glossary define it. If a concept is missing, note it for `/domain-modeling` rather than inventing language.

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly instead of silently overriding it.
