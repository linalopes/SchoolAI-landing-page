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
- Eight institutional routes including `/collaborate/wishlist/`  
- Six feed snapshots load offline  
- CSV validation, enums, empty rows, duplicate IDs, unsafe URLs  
- Published filtering and editorial ordering  
- Wishlist open / in-progress / fulfilled / paused behaviour  
- Contributors grouping and Markdown labels  
- Footer composition and canonical location  
- TWINT / Stripe assets and Payment Link  
- Legacy public HTML paths  
- Sitemap and robots  
- Canonical / Open Graph metadata  

Automated tests do **not** certify full WCAG compliance.

## Manual regression checklist

Use after substantive UI or feed changes:

- [ ] Primary navigation and Collaborate CTA  
- [ ] Desktop and mobile layouts  
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

The owner completed the final visual review of the institutional website (including footer, workstation photographs and Research Wishlist) on 26 November 2026. QA screenshots must not be committed to Git.
