# School of Tomorrow’s AI

Institutional website for [schoolai.linalopes.info](https://schoolai.linalopes.info/). Phase 1 lives on `website-2027`. Production GitHub Pages still publishes `main` from the repository root. This branch does not change that.

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
10. [Feed resilience for Phase 2](docs/feed-resilience.md)
11. [Legacy media, and how it moves later](docs/legacy-media.md)

[AGENTS.md](AGENTS.md) is mandatory.

## Phase 1

Astro 7 static output, TypeScript, and the current homepage CSS. The homepage reproduces the live page: split hero, spreadsheet carousel, events list, Formspree, and the Three.js atelier. Legacy HTML, JSON, photographs, and `CNAME` are in `public/` at their existing URLs. Wishlist and archive collections exist and publish nothing.

```sh
npm ci
npm run dev       # http://localhost:4321
npm run check
npm test
npm run build
npm run preview
npm run test:dist
```

Node 22.23.4 or newer. Astro 7 refuses older Node 22 releases. The lockfile is the dependency source. `.github/workflows/validate.yml` runs check, test, and build. It does not deploy.

## Still open

Public contact address, booking, which photographed rooms match the seven stations, archive selection, and when HTTPS enforcement changes on GitHub Pages. Do not invent those answers in the page.
