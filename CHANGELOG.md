# Changelog

Verified against Git history and release tags. Intermediate commits that were never tagged are summarised without inventing version numbers.

Git release tags (`v2.0.0`, `v2.1.0`, `v2.2.0`) are distinct from the npm package version (`2027.1.0`), which tracks the Website 2027 product line.

## [v2.2.0] — 2026-11-28 — School of Tomorrow’s AI — Website 2027: Publications & Legacy Consolidation

**Status:** Published. Closes the Website 2027 structural development cycle after PRs #1–#5.

### Summary

Closes the Website 2027 structural development cycle after the `v2.1.0` institutional baseline by consolidating legacy public pages into Astro, introducing Publications as a permanent institutional dimension, and aligning active documentation for ongoing maintenance.

### Included work

- **Arduino Day 2026** — migrated `/arduino-day-2026.html` to Markdown + Astro; public URL preserved via flatten script (PR #1).  
- **Room for Interaction** — migrated `/room-for-interaction.html` (+ JSON compatibility endpoint) to Markdown + Astro; archived programme presentation (PR #2).  
- **Programme** — Markdown-driven Current Programme (Artificial Emotion, January–June 2027) and Past Programmes; section order preserved (PR #2).  
- **Pepper’s Ghost** — migrated to Markdown + Astro + dedicated TypeScript logic; Ghost Mode reliability and safe-area chrome; owner mobile-device UI approval (PR #3). Physical optical pyramid validation was not claimed beyond owner confirmation scope.  
- **Publications** — `/publications/` Markdown collection; Pepper’s Ghost and Paper as Interface launch entries; nav/footer/sitemap; homepage teaser; Arduino Day contextual publication link (PR #4).  
- **Paper as Interface** — remains an independently hosted research board; linked, not migrated into Astro.  
- **Navigation / homepage** — About · Research · Atelier · Programme · Publications · Inverted Gallery (+ Collaborate CTA); homepage sections 06–08 renumbered for Publications.  
- **Documentation consolidation** — strategy, IA, editorial, architecture, testing, AGENTS and README updated to match production; stale implementation-reference hashes removed.

### Intentional limitations / future editorial work

- Typographic publication covers until the owner supplies public HTTPS cover images (media policy).  
- No Publications Google Sheets feed.  
- `/space3d.html` and `/history/` remain intentional standalone/historical exceptions.  
- Six Sheets feed contracts unchanged.  
- Cursor Bugbot unavailable for PR #4 (usage limit); focused manual review recorded.

### Pepper’s Ghost — technical notes

- Preserved CodeMirror / textarea editor, four examples, sandboxed p5.js iframe, Ghost Mode, calibration, original `localStorage` keys, fabrication SVG URL and fragment anchors.  
- Follow-ups shipped with the migration: section padding isolation, `viewport-fit=cover`, race/timeout hardening, page-scoped safe-area chrome (Ghost Mode canvas unpadded).  
- Discovery via Publications only.

### Programme / Room for Interaction — technical notes

- Programme periods frame the public semester; Artificial Emotion research remains on `/research/`.  
- Room for Interaction: no active registration CTAs; Maze Circuit completed dates from Events snapshot; other proposals documented without claiming delivery.

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
