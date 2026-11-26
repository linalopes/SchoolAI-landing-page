# Implementation plan and acceptance

Phase 0–2 are approved. Phase 3A (navigation, The School, homepage editorial hierarchy) is in progress on `website-2027`. Do not start Phase 3B until 3A is approved. Production is still `main`.

## Phase 0 — Audit and freeze
Create branch `website-2027` from current default branch. Capture current desktop/mobile screenshots, route inventory, current brand tokens, exact hero/event headers and behavior, Formspree workflow, 3D assets/dependencies and live hosting settings. Record source and findings; no destructive change. Confirm media hosting and gallery name before public release.

## Phase 1 — Foundation and visual parity
Set up Astro static, TypeScript, package lock, test/check/build scripts. Extract existing tokens, layouts, navigation, hero and footer. Preserve current homepage visually and functionally before introducing new copy. Preserve existing legacy content and domain. Review comparison screenshots. No new media binaries.

## Phase 2 — Content sources
Build Markdown collections, typed Google Sheets adapters, robust CSV parser, snapshot/fallback logic and client refresh. Reuse current tabs without modification initially. Document actual headers and proposed new tabs. Test publishing filters, sorting, date handling, malformed inputs, external URLs and network failures. Add new tabs only with explicit approval; no production credentials or private data.

## Phase 3A — Institutional website foundation
Navigation architecture, `/about/` Markdown introduction, homepage editorial restructuring (School → Artificial Emotion → Selected Research teaser → Atelier → Programme → Inverted Gallery → Collaborate). Expose only live destinations. No empty routes.

## Phase 3B — Remaining institutional sections
Curated Research Archive cards from snapshots, workstation directory, dedicated Research/Atelier/Programme/Gallery/Collaborate routes as needed, wishlist, contributors. Confirm gallery availability and payment links before publishing them. Keep research notebooks and repositories external.

## Phase 4 — QA and release
Run `npm ci`, type checks, tests and production build; test mobile/desktop, accessibility, no-JS, link validity, legacy routes, external media, feed outage, event date handling, newsletter, 3D and search metadata. Review public credits for permission. Check that no new binary media exists in Git. Obtain owner approval before merging/deploying. Record rollback instructions (redeploy previous approved commit) and README for editors.

## Acceptance checklist
- [x] Existing brand and split hero retained; visual parity reviewed (Phase 3A screenshots outside Git).
- [x] All public copy English; official names confirmed.
- [x] School location Wetzikon prominent, flagship Artificial Emotion prominent.
- [ ] Seven stations accurately represented; gallery separately identified (gallery intro in 3A; workstation directory later).
- [x] Google Sheets hero/events read and refresh without redeploy, validated snapshot fallback works.
- [x] Research Archive adapter and snapshot prepared (not published); rebuild via `npm run refresh-feeds`. Credits/stations remain later.
- [x] Markdown institutional copy for The School (`/about/`); wishlist still empty until a later phase.
- [ ] Media externally hosted; no new binary media in repo.
- [ ] Existing links, events, newsletter, 3D and domain preserved or tested replacements approved.
- [ ] No invented project descriptions, supporter names, grant claims or formal programs.
- [ ] Gallery inquiry and curator invitation usable; no unapproved prices or promises.
- [ ] No private records in public sheets or Git; credits authorized.
- [ ] Accessibility, SEO, responsive behavior and feed failure tests pass.
- [ ] README explains content updates, rebuild, troubleshooting, deployment and rollback.

## First Cursor task
Read README, AGENTS and all docs. Inspect current code and report discrepancies with the baseline. Produce a migration plan and tests. Implement Phase 1 only after review; do not rewrite brand or publish. Each subsequent phase is a separate reviewable change.
