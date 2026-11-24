# Issue tracking: GitHub + local Markdown (kept in the backend repo)

Tickets for the discussion queue board live in two places. **GitHub Issues is the source of truth for status.** The full ticket text is a local Markdown file in the backend repository under `docs/issues/discussion-queue/`, with this repo's tickets marked `repo: MahmoudMater/collage-hnu-queue-system` and an `issue:` field (`owner/repo#n`).

This repo is public. Never put real student names, student IDs or claim codes in a ticket, a comment or a commit message.

## Rules for agents

1. **Before working on a ticket**, read its GitHub issue and confirm its status: `gh issue view <n> -R MahmoudMater/collage-hnu-queue-system --json state,labels,assignees,comments`. If GitHub and the local file disagree, GitHub wins: tell the user and correct the local file. If the issue is closed or does not carry `ready-for-agent`, stop and ask.
2. **When a ticket is finished**, update GitHub first (comment with the evidence, replace the status label, close the issue), then update the local file in the backend repository.
3. **When a new ticket is created**, write the local file in the backend repository, publish it here with `gh issue create -R MahmoudMater/collage-hnu-queue-system --label needs-triage`, and record the issue number in the local file. A ticket that changes the API goes to `MahmoudMater/api.fcsitsu.site` instead.
4. Cross-repo references use `owner/repo#n`. Express blocking with GitHub issue dependencies where available, otherwise a `Blocked by:` line at the top of the body.
5. These rules cover the ticket lifecycle only. They do not authorize commits, pushes, pull requests, deployments or any other external action; those need the user's request.

Always pass `-R` to `gh` because the workspace holds several repos.

PRs as a triage request surface: off.

## When a skill says "publish to the issue tracker"

Write the local file first, then create the GitHub issue as in Rule 3.

## When a skill says "fetch the relevant ticket"

Read the GitHub issue as in Rule 1, then the local file for the full text.
