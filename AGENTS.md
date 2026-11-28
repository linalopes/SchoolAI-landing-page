# Agent instructions — SchoolAI website

## Authority hierarchy

1. **Current user instructions** and approved task scope.  
2. **This file (`AGENTS.md`)**.  
3. **Active documentation** under `docs/strategy/`, `docs/editorial/`, `docs/technical/`, plus `README.md`.  
4. **Actual implementation** and validated editorial sources (`src/content/`, `src/data/feeds/`, `src/lib/sheets/`).  
5. **`docs/archive/`** — historical Website 2027 material for context only. Never treat archived documents as current requirements.

## Production status

The institutional Astro website is **live on `main`**. Website 2027 structural development is **complete** and formally closed (Astro cutover `v2.0.0`, institutional baseline `v2.1.0`, Publications and legacy consolidation **`v2.2.0`**).

- Do **not** restart migration phases or describe production as unfinished.  
- Temporary migration branch `website-2027` was retired; treat `docs/archive/` as historical context only.  
- Prefer focused maintenance or feature branches, small reviewable commits, validation, and **owner review** before merging to `main`.

## Institutional dimensions

| Dimension | Role |
|---|---|
| About | Institutional identity and philosophy |
| Research | Ongoing investigations (Artificial Emotion flagship) |
| Atelier | Physical infrastructure and experimental making |
| Programme | Thematic public programmes and encounters |
| Publications | Selected authored knowledge and artefacts beyond their original context |
| Inverted Gallery | Cultural exchange; only space offered for rental |
| Collaborate | Collaboration and contribution pathways |

Publications are a permanent Markdown-driven dimension — not a course platform, resource directory, academic journal or shop. Destination applications (for example Paper as Interface) may remain independently hosted; hyperlink only. Offline builds must not depend on those external apps.

## Hard constraints

- **English** public content. Wetzikon-Zürich explicit. Artificial Emotion singular. Inverted Gallery is the English name; only that space is offered for rental.  
- **Preserve** SchoolAI Brand Kit, split hero and shared footer composition unless redesign is explicitly approved.  
- **Editorial separation:** institutional copy, CTAs, SEO, rates, payments, footer, location, wishlist labels, programme features, publication records and historical/experiment page copy live in Markdown under `src/content/`. Hero, events, archive, workstations, contributors and wishlist **records** live in Google Sheets (six feeds only). Astro/TypeScript present and validate — do not hardcode editable copy.  
- **Media:** no new editorial photographs, video, audio or research documentation binaries in Git. External public HTTPS URLs only. Authorised exceptions: `public/imgs/contact-twint.png`, `public/imgs/stripe.png`. Publication covers follow the same rule; typographic fallback when no cover URL is set. Audit legacy media before removal; preserve URLs. Do not commit QA screenshots.  
- **No invented** partners, research outcomes, names, images, licenses or claims. No private data in Git or published spreadsheets (including draft rows). No implication of nonprofit status, tax deductibility, formal programs or unrestricted access.  
- **Contributors / wishlist credits:** only authorised public names. Do not invent anonymity claims for blank credits.  
- **Independent** research repositories, personal sites and publication destination apps — hyperlink; never import full projects or blog articles.  
- **Payments:** TWINT + Stripe Payment Link via `src/content/support/financial-support.md` only. No Stripe SDK, API keys, webhooks or custom checkout.  
- **Feeds:** validate and normalise; HTML-escape sheet text; never use raw HTML from Sheets. Client refresh with last-known-good fallback. Offline builds must not depend on Google or other external editorial services.  
- **URLs:** preserve existing public routes and compatibility contracts (flattened `.html` legacy pages, `/room-for-interaction.json`, `/space3d.html`, `/history/`).  
- **Safe deployment:** no production deploy, destructive Git operations, live sheet edits or payment changes without approval. Validate with `npm test`, `npm run check`, `npm run build`, `npm run test:dist` before publishing.  
- **No unrelated redesign** or new dependencies without justification and approval. Preserve Formspree and the 3D tour pending explicit change requests.  
- Report blockers, assumptions and documentation gaps. Update active docs when architecture changes.

## Key paths

| Concern | Path |
|---|---|
| Owner content guide | `docs/editorial/content-management.md` |
| Sheets contracts | `docs/editorial/google-sheets.md` |
| Media policy | `docs/editorial/media-policy.md` |
| Architecture | `docs/technical/architecture.md` |
| Feed resilience | `docs/technical/feed-resilience.md` |
| Deployment | `docs/technical/deployment.md` |
| Testing | `docs/technical/testing.md` |
| Information architecture | `docs/strategy/information-architecture.md` |
| Address | `src/content/site/location.md` |
| Footer | `src/content/site/footer.md` |
| Wishlist page copy | `src/content/pages/wishlist.md` |
| Publications page copy | `src/content/pages/publications.md` |
| Publication records | `src/content/publications/` |
| Feed adapters | `src/lib/sheets/` |
