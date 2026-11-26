# School of Tomorrow’s AI

Institutional website for [schoolai.linalopes.info](https://schoolai.linalopes.info/). Development lives on `website-2027`. Production GitHub Pages still publishes `main` from the repository root. This branch does not change that.

## Read first

1. [Strategy](docs/strategy-2027.md)
2. [Editorial guidelines](docs/editorial-guidelines.md)
3. [Information architecture](docs/information-architecture.md)
4. [Website copy](docs/website-copy.md)
5. [Content model and Google Sheets](docs/content-model.md)
6. [Technical architecture](docs/technical-architecture.md)
7. [Implementation and acceptance](docs/implementation-plan.md)
8. [Research archive curation](docs/research-archive.md)
9. [Decisions confirmed on 26 November 2026](docs/decisions-2026-11-26.md)
10. [Feed resilience](docs/feed-resilience.md)
11. [Legacy media, and how it moves later](docs/legacy-media.md)

[AGENTS.md](AGENTS.md) is mandatory.

## Current branch

Astro 7 static output, TypeScript, and the SchoolAI brand CSS. Live pages include `/`, `/about/`, `/research/`, `/atelier/`, `/programme/`, `/inverted-gallery/` and `/collaborate/`. The homepage keeps the split hero and spreadsheet carousel, then School, Artificial Emotion, Selected Research (up to six archive cards), Atelier, Programme, Inverted Gallery, Collaborate, newsletter and footer. Editorial feeds use last-known-good snapshots in `src/data/feeds/` for hero, events, archive and workstations. Builds do not call Google Sheets. Wishlist, contributors and payments are prepared as extension points only.

```sh
npm ci
npm run refresh-feeds   # fetch and validate public CSV feeds
npm run dev             # http://localhost:4321
npm run check
npm test
npm run build           # offline against committed snapshots
npm run preview
npm run test:dist
```

Node 22.23.4 or newer. Astro 7 refuses older Node 22 releases. The lockfile is the dependency source. `.github/workflows/validate.yml` runs check, test, and build. It does not deploy.

Read [feed resilience](docs/feed-resilience.md) and [CSV parser](docs/csv-parser.md) before changing feed code.

## Still open

Public contact address confirmation, booking details for Inverted Gallery, wishlist publication, payments, and when HTTPS enforcement changes on GitHub Pages. Do not invent those answers in the page.
