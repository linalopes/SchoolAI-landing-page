# Agent instructions — SchoolAI website

## Authority hierarchy

1. **Current user instructions** and approved task scope.  
2. **This file (`AGENTS.md`)**.  
3. **Active documentation** under `docs/strategy/`, `docs/editorial/`, `docs/technical/`, plus `README.md`.  
4. **Actual implementation** and validated editorial sources (`src/content/`, `src/data/feeds/`, `src/lib/sheets/`).  
5. **`docs/archive/`** — historical Website 2027 material for context only. Never treat archived documents as current requirements.

## Production status

The institutional Astro website is **live on `main`**. Do not restart completed migration phases or describe production as unfinished. Historical branch `website-2027` is not the active architecture.

## Hard constraints

- **English** public content. Wetzikon-Zürich explicit. Artificial Emotion singular. Inverted Gallery is the English name; only that space is offered for rental.  
- **Preserve** SchoolAI brand identity, split hero and shared footer composition unless redesign is explicitly approved.  
- **Editorial separation:** institutional copy, CTAs, SEO, rates, payments, footer, location and wishlist labels live in Markdown under `src/content/`. Hero, events, archive, workstations, contributors and wishlist **records** live in Google Sheets. Astro/TypeScript present and validate — do not hardcode editable copy.  
- **Media:** no new editorial photographs, video, audio or research documentation binaries in Git. External public HTTPS URLs only. Authorised exceptions: `public/imgs/contact-twint.png`, `public/imgs/stripe.png`. Audit legacy media before removal; preserve URLs.  
- **No invented** partners, research outcomes, names, images or claims. No private data in Git or published spreadsheets (including draft rows). No implication of nonprofit status, tax deductibility, formal programs or unrestricted access.  
- **Contributors / wishlist credits:** only authorised public names. Do not invent anonymity claims for blank credits.  
- **Independent** research repositories and personal sites — hyperlink; never import full projects or blog articles.  
- **Payments:** TWINT + Stripe Payment Link via `src/content/support/financial-support.md` only. No Stripe SDK, API keys, webhooks or custom checkout.  
- **Feeds:** validate and normalise; HTML-escape sheet text; never use raw HTML from Sheets. Client refresh with last-known-good fallback. Offline builds must not depend on Google.  
- **Safe deployment:** no production deploy, destructive Git operations, live sheet edits or payment changes without approval. Prefer small reviewable commits. Validate with `npm test`, `npm run check`, `npm run build`, `npm run test:dist` before publishing.  
- **No unrelated redesign** or new dependencies without justification and approval. Preserve Formspree and 3D tour pending explicit change requests.  
- Report blockers, assumptions and documentation gaps. Update active docs when architecture changes.

## Key paths

| Concern | Path |
|---|---|
| Owner content guide | `docs/editorial/content-management.md` |
| Sheets contracts | `docs/editorial/google-sheets.md` |
| Architecture | `docs/technical/architecture.md` |
| Feed resilience | `docs/technical/feed-resilience.md` |
| Deployment | `docs/technical/deployment.md` |
| Address | `src/content/site/location.md` |
| Footer | `src/content/site/footer.md` |
| Wishlist page copy | `src/content/pages/wishlist.md` |
| Feed adapters | `src/lib/sheets/` |
