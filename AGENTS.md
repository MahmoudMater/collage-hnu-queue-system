<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Agent skills

### Issue tracker

GitHub Issues is the source of truth for ticket status, with the full ticket text in local Markdown in the backend repository. Check the GitHub status before working on a ticket, update it when finished, and publish new tickets. This repo is public: no real student data in tickets. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical roles (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) are used as-is on GitHub. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context. The backend repository owns the domain rules and the design. See `docs/agents/domain.md`.
