# Changelog

What changed on the discussion queue site, newest first. Dates are in Cairo time.

## 2026-11-26

A full redesign of the site: a black and yellow look, a landing page, new layouts for every screen, and motion.

### Added

- **Landing page at `/`.** A headline, a demo of a live discussion that plays on its own, the level picker, how the site works in three steps, what the site gives you, a section for team leaders, questions, and a closing call to pick a level.
- **Logo.** The Bubble mark, a speech bubble whose dots shrink like a queue, with the name beside it. The mark is also the favicon.
- **One header and one footer on every page.** The header floats at the top and stays in view while the page scrolls.
- **Queue tabs.** The main queue and the late queue are two tabs, each with its count. The tab that holds your team opens first. The late tab is hidden when late requests are closed and nobody is in the late queue.
- **"You" tag.** Your team is marked on its row, on the tab that holds it, and on its slot in the schedule when you arrive from the team search.
- **Row states.** In the main queue, place 1 is Next, places 2 and 3 are Soon, and the rest show the expected wait. The place number sits on a tile in the state's colour.
- **Paged queue.** A long queue shows eight teams at a time, with the range on show, a small track and previous and next buttons. A "Show my team" button brings you back to your own page.
- **"Your turn" card.** Following a team, sound alerts, keeping the screen on, the call to come in and team-leader sign-in are one card. Sound alerts and "Keep the screen on" are switches, and sound can be switched off again.
- **Inside-now banner.** On a wide screen the team inside is a banner across the page, with how many teams are waiting and how many are late.
- **Starts banner.** A discussion that has not started shows when it starts, how many teams it has, and the first and last slot.
- **Level switcher.** On a level's page, the four levels sit beside the title, so you can change level without going back.
- **Empty states and a 404 page** with their own design.
- **Light and dark button.** A sun and moon button in the header switches the theme. The choice is remembered on the device; without one the phone's setting decides. In light mode the logo is an ink bubble with yellow dots, with no tile behind it.
- **Search and sharing.** Every page has its own title, description and canonical link. The site has a `robots.txt`, a `sitemap.xml` of the home page, the levels and the subjects, a web app manifest, an icon for a phone's home screen, and structured data for the site, its questions and its breadcrumbs.
- **Share images.** A link to the home page, a level, a subject or a discussion shows its own picture in a chat: the queue, the level's number, the number of discussions, or the day of the discussion. No student's name is drawn.
- **Motion.** A slow moving background, lists that arrive one item after another, queue rows that slide when the queue moves, a team number that flips in when a new team goes inside, and transitions between pages (deeper slides in from the right, back from the left). None of it runs when the device asks for reduced motion.

### Changed

- **Colours and type.** Black and yellow with warm neutrals, light and dark. Headlines are Bricolage Grotesque, text is IBM Plex Sans, numbers are IBM Plex Mono.
- **Every page is wider on a desktop.** One 1200px column instead of a narrow one. Phones keep a single column.
- **Inside-now banner.** On a wide screen the countdown is one of the banner's figures, beside Waiting and Late, with the same number and label. It used to sit lower, on its own.
- **Level page.** Subjects are tiles of one size: a number, the subject's name, and one square per discussion.
- **Subject page.** Discussions are rows led by a calendar tile, which is yellow when the discussion is live. Each row shows the TA, the place, the status, the pace and the team count, and a button for the sheet. The team search sits beside the title.
- **Discussion page.** On a desktop the queue takes the wide left column and your own tools the right one, which stays in view.
- **Schedule of a discussion that has not started.** One tile per slot, the time first, instead of a list.
- **Back links.** A drawn arrow in a small tile, then where the link leads. No arrow is typed as text anywhere on the site.
- **Search placeholder.** Shortened to "ID, name or team number" so it fits a small phone.
- **Sign-in line.** Now reads "Are you a team leader? Sign in to answer the call from here."
- **Tap targets.** Every button and link is at least 44px to the finger.
- **App pages moved** into the `app/(app)/` route group. URLs are the same.
- **Discussion pages stay out of search results.** They last a day and list students by name, so they are marked `noindex`; they still get a preview when shared.
- **A subject, discussion or level that does not exist** now answers 404 to search engines instead of 200.

### Removed

- **The remembered level.** The site no longer sends a returning phone straight to its level: `/` always opens the landing page.
- **The two side-by-side queue columns**, replaced by the tabs.
- **The default favicon.**

## 2026-11-25

The site became a site for students and team leaders only, in English.

### Added

- **Levels.** Home is a level picker, and subjects are listed per level, with today's discussions first.
- **Team search** by leader ID, leader name or team number, answered by the backend.
- **Pace and breaks.** Discussion cards and the live page show how far the TA is from the schedule, and a notice when the TA is on a break.
- **Late rule.** The discussion page says when a late team can no longer ask for a new turn.
- **Turn alert.** Follow a team and get a sound, a vibration and a banner when its turn is near and when it is called, with an option to keep the screen on.

### Changed

- **All text is English** and the layout is left to right.

### Removed

- **TA and staff pages.** Sign-in, the control panel and session review moved to the main site's TA workspace.
