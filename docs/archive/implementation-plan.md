> **Archival notice.** Historical Website 2027 migration material. Not current implementation guidance. See [archive README](README.md) and active docs under `docs/editorial/` and `docs/technical/`.

# Implementation plan and acceptance

Phases 0–3G are approved. Phase 4A (production readiness: deploy workflow, SEO assets, gallery photos, feed refresh, release docs) is on `website-2027`. Do not execute Phase 4B production cutover until review. Production is still legacy `main`.

## Phase 0 — Audit and freeze
Create branch `website-2027` from current default branch. Capture current desktop/mobile screenshots, route inventory, current brand tokens, exact hero/event headers and behavior, Formspree workflow, 3D assets/dependencies and live hosting settings. Record source and findings; no destructive change. Confirm media hosting and gallery name before public release.

## Phase 1 — Foundation and visual parity
Set up Astro static, TypeScript, package lock, test/check/build scripts. Extract existing tokens, layouts, navigation, hero and footer. Preserve current homepage visually and functionally before introducing new copy. Preserve existing legacy content and domain. Review comparison screenshots. No new media binaries.

## Phase 2 — Content sources
Build Markdown collections, typed Google Sheets adapters, robust CSV parser, snapshot/fallback logic and client refresh. Reuse current tabs without modification initially. Document actual headers and proposed new tabs. Test publishing filters, sorting, date handling, malformed inputs, external URLs and network failures. Add new tabs only with explicit approval; no production credentials or private data.

## Phase 3A — Institutional website foundation
Navigation architecture, `/about/` Markdown introduction, homepage editorial restructuring (School → Artificial Emotion → Selected Research teaser → Atelier → Programme → Inverted Gallery → Collaborate). Expose only live destinations. No empty routes.

## Phase 3B + 3C — Research Archive and workstation directory
`/research/` and `/atelier/` are live. Selected Research renders up to six archive entries from snapshots with client refresh. Workstations feed GID `20271127` powers eight editorial stations. Programme, Inverted Gallery and Collaborate dedicated routes remain later.

## Phase 3D–3F — Institutional pages completion
`/programme/`, `/inverted-gallery/` and `/collaborate/` are live. Primary navigation points to all seven institutional routes.

## Phase 3G — Editorial refactoring and final integrations
Institutional and homepage copy moved to Markdown. Gallery rental rates and financial support (TWINT + Stripe Payment Link) are Markdown-configured. Optional gallery photos via frontmatter. README editorial administration guide published. Wishlist and contributors remain unpublished.

## Phase 4A — Production readiness
Deploy and optional snapshot workflows prepared; robots/sitemap/404/OG metadata; gallery photographs configured; feeds refreshed; release/rollback documented. No merge to `main`, no Pages switch, no live deploy.

## Phase 4B — Production release (owner approval required)
Execute [production-release.md](../technical/deployment.md): preserve `legacy-html-2026` / `v1.0.0-legacy`, merge Astro to `main`, switch Pages to Actions, verify domain, tag `v2.0.0`.

## Acceptance checklist
- [x] Existing brand and split hero retained; visual parity reviewed (Phase 3A screenshots outside Git).
- [x] All public copy English; official names confirmed.
- [x] School location Wetzikon prominent, flagship Artificial Emotion prominent.
- [x] Eight research workstations represented; gallery separately identified (atelier rental excluded).
- [x] Google Sheets hero/events read and refresh without redeploy, validated snapshot fallback works.
- [x] Research Archive adapter and snapshot prepared (not published); rebuild via `npm run refresh-feeds`. Credits/stations remain later.
- [x] Markdown institutional copy for The School (`/about/`); wishlist still empty until a later phase.
- [x] Programme, Inverted Gallery and Collaborate dedicated pages published; inquiry CTAs live.
- [x] Editorial content sourced from Markdown; rental rates and financial support editable without code changes.
- [x] Authorised TWINT/Stripe QR assets only; no unauthorised editorial media committed.
- [ ] Media externally hosted for gallery photography once URLs are supplied.
- [ ] Existing links, events, newsletter, 3D and domain preserved or tested replacements approved.
- [ ] No invented project descriptions, supporter names, grant claims or formal programs.
- [x] Gallery inquiry and curator invitation usable; no unapproved prices or promises.
- [ ] No private records in public sheets or Git; credits authorized.
- [ ] Accessibility, SEO, responsive behavior and feed failure tests pass.
- [ ] README explains content updates, rebuild, troubleshooting, deployment and rollback.

## First Cursor task
Read README, AGENTS and all docs. Inspect current code and report discrepancies with the baseline. Produce a migration plan and tests. Implement Phase 1 only after review; do not rewrite brand or publish. Each subsequent phase is a separate reviewable change.
