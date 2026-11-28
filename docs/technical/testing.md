# Testing and quality assurance

## Commands

| Command | Responsibility |
|---|---|
| `npm test` | Source, feed adapters, client-refresh contracts, refresh resilience |
| `npm run check` | Astro / TypeScript diagnostics |
| `npm run build` | Offline static build from committed snapshots |
| `npm run test:dist` | Assertions against `dist/` (routes, Markdown-driven copy, feeds, payments, sitemap) |

Node **≥ 22.23.4**. Prefer `npm ci` for a clean install.

## Automated coverage (representative)

- Navigation labels and Collaborate CTA  
- Institutional routes including `/publications/` and `/collaborate/wishlist/`  
- Publications Markdown collection, published filtering, primary/secondary links  
- Homepage Publications teaser placement (after Programme, before Gallery)  
- Six feed snapshots load offline  
- CSV validation, enums, empty rows, duplicate IDs, unsafe URLs  
- Published filtering and editorial ordering  
- Wishlist open / in-progress / fulfilled / paused behaviour  
- Contributors grouping and Markdown labels  
- Footer composition and canonical location  
- TWINT / Stripe assets and Payment Link  
- Legacy public HTML paths (3D tour) and functional fabrication SVG  
- Astro-generated `/arduino-day-2026.html`, `/room-for-interaction.html` and `/peppers-ghost.html` (flattened routes; Markdown-backed)  
- Pepper’s Ghost section anchors, iframe sandbox, localStorage key names, example sketch ids, `viewport-fit=cover`, page-scoped safe-area chrome  
- Room for Interaction JSON compatibility endpoint and archived workshop statuses  
- Homepage `#hero` isolation from Arduino Day / Room for Interaction heroes  
- Programme section order and Markdown-driven Current / Past Programme CTAs  
- Responsive navigation breakpoint (hamburger at max-width 1279px)  
- Sitemap and robots  
- Canonical / Open Graph metadata  

Automated tests do **not** certify full WCAG compliance.

## Manual regression checklist

Use after substantive UI or feed changes:

- [ ] Primary navigation (including Publications) and Collaborate CTA  
- [ ] Desktop and mobile layouts; nav does not overflow at intermediate widths  
- [ ] Publications covers, typography and external destinations  
- [ ] Text contrast on light and dark bands  
- [ ] Keyboard access (nav, carousel pause, links, forms)  
- [ ] Optional images absent without empty placeholders  
- [ ] All six editorial feeds render  
- [ ] Snapshot fallback when CSV is blocked  
- [ ] External links (`rel` / new tab where expected)  
- [ ] Gallery rental rates  
- [ ] Financial support  
- [ ] Newsletter Formspree success path  
- [ ] Three.js tour (`/space3d.html`)  
- [ ] Legacy routes  
- [ ] Canonical URLs, sitemap, robots.txt, custom 404  

## Visual review

The owner completed the final visual review of the institutional website (including footer, workstation photographs and Research Wishlist) on 26 November 2026. Project closure release: **`v2.1.0`**. QA screenshots must not be committed to Git (`tmp/` is gitignored). Automated tests do not certify full WCAG compliance.

### Pepper’s Ghost (2026-11-28)

Owner approved PR #3 after successful testing on a **physical mobile device** (application UI, Ghost Mode chrome, and interactive editor behaviour). That confirmation does **not** certify the physical optical illusion with a transparent pyramid unless separately stated by the owner. Primary discovery is via Publications (`/publications/`).

### Publications (2026-11-28)

Owner approved PR #4 after visual review and production smoke tests on merge. Typographic publication covers remain until the owner provides public HTTPS cover images (media policy unchanged; fallback is intentional). Cursor Bugbot was unavailable for this PR because of the Cursor usage limit; a focused manual code review was completed instead. Automated `Check, test, and build` passed before merge.
