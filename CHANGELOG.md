# Changelog

Verified against Git history and release tags. Intermediate commits that were never tagged are summarised without inventing version numbers.

Git release tags (`v2.0.0`, `v2.1.0`) are distinct from the npm package version (`2027.1.0`), which tracks the Website 2027 product line.

## Unreleased maintenance

### Room for Interaction — Astro migration

- Migrated `/room-for-interaction.html` from standalone `public/` HTML to Markdown (`src/content/pages/room-for-interaction.md`) + Astro presentation.  
- Preserved the public URL via `scripts/flatten-html-routes.mjs`; JSON compatibility endpoint is generated from the same Markdown source.  
- Archived programme presentation: no active “Next workshop” or registration CTAs; workshop statuses reconciled against the Events snapshot (Maze Circuit completed 28–29 August 2026; other proposals cancelled).  
- Hero uses `id="hero"` with `.rfi-hero` isolation from homepage `#hero` styles; workshop anchors keep `#workshop-*` fragments.

### Arduino Day 2026 — Astro migration

- Migrated `/arduino-day-2026.html` from standalone `public/` HTML to Markdown (`src/content/pages/arduino-day-2026.md`) + Astro presentation.  
- Preserved the public URL via `scripts/flatten-html-routes.mjs` after the static build.  
- Reuses shared navigation, footer, Brand Kit tokens and button styles; page-specific styles remain scoped under `.arduino-day`.  
- Programme past-event sheet link and sitemap entry remain `/arduino-day-2026.html`.

## [v2.1.0] — 2026-11-26 — School of Tomorrow’s AI — Website 2027

Final institutional website release after the Astro production cutover. Closes the Website 2027 migration project. Production: https://schoolai.linalopes.info/

### Institutional website

- Complete institutional information architecture (eight routes including Research Wishlist).
- Research and Research Archive (Artificial Emotion presentation; six published archive entries).
- Atelier and eight editorial workstations with external photographs.
- Programme.
- Inverted Gallery with Markdown rental rates.
- Collaboration pathways (visit, contribute, financial support, wishlist).

### Editorial infrastructure

- Six Google Sheets feeds (hero, events, archive, workstations, contributors, wishlist).
- Validated CSV adapters and committed JSON snapshots.
- Markdown institutional content under `src/content/`.
- Automated daily snapshot refresh (06:00 UTC) with manual dispatch.
- Browser-side refresh with last-known-good fallback.
- Offline production builds that never call Google.

### Community contributions

- Financial Support (TWINT QR and Stripe Payment Link).
- Contributor acknowledgements (Made possible by).
- Research Wishlist with fulfilled-needs history.
- Wishlist status badges and light-surface hierarchy refinement (`79b865e`).

### Design and usability

- Refined global navigation and Programme contrast.
- Shared three-column footer with dynamic copyright.
- Canonical physical address (`src/content/site/location.md`).
- Responsive layouts across institutional pages.

### Documentation and operations

- Owner content management guide and Sheets contracts.
- Technical architecture, feed resilience, deployment and testing docs.
- Historical migration archive under `docs/archive/`.
- Automated Validate and Deploy on `main`.
- Migration branch `website-2027` retired after ancestry verification (fully contained in `main`).

Owner entry point: [docs/editorial/content-management.md](docs/editorial/content-management.md).

## Production Astro site (`main`)

### Documentation consolidation — `281608a`

- Documentation consolidation for Website 2027 handover: owner content guide, Sheets reference, reorganised `docs/`, archived migration material (`docs/archive/`), updated `AGENTS.md` and README.

### Research Wishlist — `c523a15`

- Sixth Google Sheets feed (`gid=20271129`) with validated snapshot `src/data/feeds/wishlist.json`.  
- Route `/collaborate/wishlist/`; Collaborate teaser; removed unused Markdown wishlist collection.  
- Client refresh and last-known-good fallback.

### Footer & canonical location — `c30d27f`

- Three-column footer with bottom bar; dynamic copyright year.  
- Canonical address in `src/content/site/location.md` shared by footer, homepage atelier and Atelier page.  
- Header CSS scoped to `#nav`.

### Contributors — `b53dd7a`

- Fifth Sheets feed (`gid=20271128`); Made possible by section on Collaborate.  
- Footer address work begun in this era of the site.

### Navigation & Programme — `769e5f1`, `6642cce`

- Programme contrast fixes; desktop navigation spacing.  
- Global navigation labels refined (About, Atelier, …); Collaborate as CTA.

### Astro production cutover — tag `v2.0.0` (`035d60a`)

- Institutional Astro site becomes production on `main`.  
- GitHub Pages via Actions; offline snapshot builds; domain `schoolai.linalopes.info`.  
- Markdown editorial architecture; gallery rates; financial support (TWINT / Stripe).  
- Feeds: hero, events, research archive, workstations (later contributors and wishlist).  
- Legacy HTML preserved separately (see below).

### Pre-cutover Astro work (selected)

- Resilient Sheets feeds and snapshots (`3f9bb44`).  
- Institutional pages: About, Research, Atelier, Programme, Inverted Gallery, Collaborate.  
- Homepage restructure; Phase 4A release candidate historically developed on `website-2027` (branch retired at `v2.1.0`).

## Legacy HTML website

- **Tag:** `v1.0.0-legacy`  
- **Branch:** `legacy-html-2026`  
- **Commit:** `0a84b8c`  
- Static HTML site with split hero, events sheet, Formspree, 3D tour and legacy programme pages. Rollback procedure: [docs/technical/deployment.md](docs/technical/deployment.md).
