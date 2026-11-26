# Changelog

Verified against Git history and release tags. Intermediate commits that were never tagged are summarised without inventing version numbers. **`v2.0.0`** remains the original Astro production release tag.

## Unreleased documentation

- Documentation consolidation for Website 2027 handover: owner content guide, Sheets reference, reorganised `docs/`, archived migration material (`docs/archive/`), updated `AGENTS.md` and README.

## Production Astro site (`main`)

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
- Homepage restructure; Phase 4A release candidate on `website-2027`.

## Legacy HTML website

- **Tag:** `v1.0.0-legacy`  
- **Branch:** `legacy-html-2026`  
- **Commit:** `0a84b8c`  
- Static HTML site with split hero, events sheet, Formspree, 3D tour and legacy programme pages. Rollback procedure: [docs/technical/deployment.md](docs/technical/deployment.md).
