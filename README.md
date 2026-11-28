# School of Tomorrow’s AI

Independent research atelier website for **School of Tomorrow’s AI** (Wetzikon-Zürich).

**Production:** [schoolai.linalopes.info](https://schoolai.linalopes.info/)  
**Repository purpose:** Institutional static website — editorial content, programme feeds, publications and collaboration pathways.  
**Production branch:** `main`  
**Current tagged release:** [`v2.2.0`](https://github.com/linalopes/SchoolAI-landing-page/releases/tag/v2.2.0) — School of Tomorrow’s AI — Website 2027: Publications & Legacy Consolidation  
**Previous institutional baseline:** [`v2.1.0`](https://github.com/linalopes/SchoolAI-landing-page/releases/tag/v2.1.0)  
**Original Astro cutover:** [`v2.0.0`](https://github.com/linalopes/SchoolAI-landing-page/releases/tag/v2.0.0) (`035d60a`)  
**Legacy HTML archive:** branch `legacy-html-2026` / tag `v1.0.0-legacy` (`0a84b8c`)

Website 2027 structural development is **complete**. Continuous maintenance continues on `main`. Do not restart migration phases. Historical planning lives under [`docs/archive/`](docs/archive/) for context only.

## Stack

Astro 7 static output · TypeScript · native CSS (SchoolAI Brand Kit) · Markdown content collections · six Google Sheets CSV feeds with committed JSON snapshots · GitHub Actions → GitHub Pages · Node ≥ 22.23.4

## Editorial architecture

| Source | Controls |
|---|---|
| **Markdown** (`src/content/`) | Institutional pages, publication records, programme features, historical/experiment pages, rates, payments, footer, address, wishlist labels |
| **Google Sheets** | Hero, events, research archive, workstations, contributors, wishlist records |

Astro components present content; they are not the source of editorial wording. Publications do not use a Sheets feed. Independent destination apps are hyperlinked, not imported.

## Maintain the website

- **Owner guide (start here):** [docs/editorial/content-management.md](docs/editorial/content-management.md)  
- **Sheets contracts:** [docs/editorial/google-sheets.md](docs/editorial/google-sheets.md)  
- **Media policy:** [docs/editorial/media-policy.md](docs/editorial/media-policy.md)

Ordinary spreadsheet edits do **not** require a local `npm run refresh-feeds`. Live pages refresh once in the browser; snapshots update daily at 06:00 UTC (or via Actions → Refresh editorial snapshots).

## Technical documentation

| Topic | Document |
|---|---|
| Architecture | [docs/technical/architecture.md](docs/technical/architecture.md) |
| Feed resilience | [docs/technical/feed-resilience.md](docs/technical/feed-resilience.md) |
| Deployment & rollback | [docs/technical/deployment.md](docs/technical/deployment.md) |
| Testing | [docs/technical/testing.md](docs/technical/testing.md) |
| Information architecture | [docs/strategy/information-architecture.md](docs/strategy/information-architecture.md) |
| Strategy & voice | [docs/strategy/](docs/strategy/) |
| Agent rules | [AGENTS.md](AGENTS.md) |
| Changelog | [CHANGELOG.md](CHANGELOG.md) |
| Migration history | [docs/archive/](docs/archive/) |

## Local development

```sh
npm ci
npm run refresh-feeds   # optional: update snapshots from published CSVs
npm run dev             # http://localhost:4321
npm run check
npm test
npm run build
npm run preview
npm run test:dist
```

## Deployment overview

- Push / merge to `main` → Validate + Deploy.  
- Daily snapshot refresh at 06:00 UTC; meaningful changes commit and dispatch Deploy.  
- Offline builds never call Google Sheets or external publication apps.  
- Details: [deployment.md](docs/technical/deployment.md)

## Media summary

No new editorial photographs, research binaries or QA screenshots in Git. Use public HTTPS URLs (including publication covers). Typographic cover fallback when no cover URL is set. Authorised QR exceptions: `public/imgs/contact-twint.png`, `public/imgs/stripe.png`.

## Routes

`/` · `/about/` · `/research/` · `/atelier/` · `/programme/` · `/publications/` · `/inverted-gallery/` · `/collaborate/` · `/collaborate/wishlist/` · flattened legacy `.html` routes (Arduino Day, Room for Interaction, Pepper’s Ghost) · intentional standalone `/space3d.html` and `/history/` under `public/`
