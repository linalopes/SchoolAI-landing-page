# Technical architecture

## Phase 3A status, 26 November 2026
`website-2027` is an Astro static project with typed Google Sheets adapters, committed feed snapshots, offline builds, primary navigation for live destinations, Markdown `/about/`, and a restructured homepage. Production GitHub Pages still serves `main` at the repository root. Legacy pages and media remain in `public/`. `.github/workflows/validate.yml` typechecks, tests, and builds. It does not deploy. Feed behaviour is [feed resilience](feed-resilience.md). Confirmed names and boundaries are in [decisions](decisions-2026-11-26.md). The Research Archive snapshot remains available; the homepage shows a Selected Research teaser and external CTA only.

## Baseline and choices
Existing repository `linalopes/SchoolAI-landing-page` is a static HTML site. Root includes `index.html`, `space3d.html`, `room-for-interaction.html`, `room-for-interaction.json`, `arduino-day-2026.html`, `peppers-ghost.html`, `imgs/`, `history/`, `CNAME`. Homepage combines CSS, HTML and JS (approximately 73k characters). Existing split hero is a spreadsheet-driven carousel; events use a separate tab of the same public sheet; newsletter uses Formspree. Audit was limited to root listing and homepage code, not every integration or live sheet. Preserve current behavior before improvements.

Use Astro static output, TypeScript, native CSS, Markdown and content collections. Select supported stable dependency versions at implementation; commit lockfile. Prefer Astro components and lightweight vanilla JS for existing interaction; retain current 3D implementation initially. No React, Tailwind, database, CMS or server unless demonstrated need. Deploy with GitHub Actions to GitHub Pages (verify current hosting settings and custom domain). Independent research repos and personal sites remain independent, linked by HTTPS.

## Proposed layout
```text
src/
  components/{ui,navigation,home,research,atelier,programme,gallery,support}/
  layouts/{BaseLayout,EditorialLayout}.astro
  styles/{tokens,typography,global}.css
  pages/
  content/{pages,wishlist}/
  content.config.ts
  lib/{sheets,validation,links}/
  data/{site,navigation}.ts
public/              # legacy compatibility files, no new media binaries
.github/workflows/   # validation and deployment
.cursor/rules/
docs/
AGENTS.md
README.md
```
Only create needed directories and abstractions. Use content collections for Markdown; typed feed loaders for Sheets, with validation shared between build and browser where practical. Keep UI components independent of raw CSV formats. Site configuration references the external brand kit and public integrations.

## Design system
Existing tokens: deep purple #22113E, gray green #CAD8D8, pink #EA7DFF, turquoise #08F2DB, white #FFFFFF, magenta #A21CAF. Space Grotesk (display), Inter (body), Courier Prime (labels/mono). Source of truth: https://github.com/linalopes/SchoolAI-brand-kit. Extract actual semantic tokens and styles, not a new approximation. Preserve split hero, carousel transitions, desktop/mobile navigation, responsive behavior and pattern. Ensure readable contrast, keyboard controls, pause/autoplay control and reduced-motion behavior. Do not introduce new brand visuals. External media only; do not use Astro local image imports or build-time transformations that copy remote media into repository/output as default.

## Deployment
Use a migration branch; main/current site stays intact. Static build, preview locally, validate links and content, then deploy via an approved workflow. The Phase 1 workflow validates only. Preserve CNAME `schoolai.linalopes.info` after verifying actual value. Keep existing legacy routes and anchors where possible; test redirects/compatibility. Build failures must not replace production. Manual refresh action for content changes; optional schedule later. Client refresh for hero and events; graceful fallback to build snapshot. Document npm scripts (`dev`, `build`, `preview`, `check`, tests) and exact setup in implementation README. Use GitHub Actions permissions minimally. No secrets in code or public data.

## Quality
Semantic HTML, accessible navigation/carousel, keyboard support, image alt text, responsive layouts, page titles/descriptions, canonical URLs, sitemap, crawlable content and appropriate social metadata. Verify external images, mobile performance, newsletter success/error, event times, expired updates, legacy URLs and 3D view. No external tracking by default; verify applicable privacy disclosures and integrations before publishing. Use existing visual screenshots as regression baseline. Test feed parser with quoted commas, multiline strings, blank and invalid rows, failure and stale states. No synthetic examples in production.
