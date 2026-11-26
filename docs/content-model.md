# Content model and Google Sheets

## Source of truth
Markdown under `src/content/` is canonical for institutional pages, homepage editorial copy, gallery narrative, rental rates, financial support, footer address, wishlist page copy, CTAs, SEO descriptions and optional gallery photograph URLs. Google Sheets is canonical for hero updates, events, archive metadata, workstations, contributor credits and wishlist records. Never copy full external research articles. Site configuration (`src/data/site.ts`) holds domain, contact email and stable public integration URLs — not narrative copy. No private records in public sheets or Git.

Canonical spreadsheet, do not edit it from the site: `https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit`

The Research Archive shows at most six selected rows from its sheet. Wishlist records come from the Wishlist sheet (`gid=20271129`); page introductions and labels live in `src/content/pages/wishlist.md`. Financial support is Markdown in `src/content/support/financial-support.md` (TWINT and Stripe, individually enable/disable). Gallery rental rates are Markdown in `src/content/gallery/rental-rates.md`.

## Existing integrations (preserved)
- Published Google Sheets CSV base: `https://docs.google.com/spreadsheets/d/e/2PACX-1vSpM1GYZ-ohq9jHkppGkz4hCx_p3vuCDjekln1apcu1nV2KILUmDeoT3xeLTSprREAXWjiWY8AovP4y/pub`
- Events: `?gid=0&single=true&output=csv`
- Hero carousel: `?gid=1398027263&single=true&output=csv`
- Research Archive: `?gid=20271126&single=true&output=csv`
- Workstations: `?gid=20271127&single=true&output=csv`
- Contributors: `?gid=20271128&single=true&output=csv`
- Wishlist: `?gid=20271129&single=true&output=csv`
- Newsletter form action: `https://formspree.io/f/mvgbznoe`

Live Events and Hero columns are unchanged. Research Archive columns are `id`, `title`, `year`, `category`, `description`, `image_url`, `image_alt`, `url`, `github_url`, `featured`, `published`, `order`. Workstations columns are `id`, `title`, `tagline`, `description`, `image_url`, `image_alt`, `order`, `published`. Contributors columns are `id`, `name`, `category`, `url`, `year`, `order`, `published` with categories `supporter`, `institutional-support`, `research-collaborator`, `technology-partner`. Wishlist columns are `id`, `title`, `category`, `description`, `quantity`, `image_url`, `image_alt`, `reference_url`, `target_amount_chf`, `status`, `fulfilled_by`, `fulfilled_year`, `order`, `published` with categories `equipment`, `material`, `access`, `expertise`, `time`, `financial` and statuses `open`, `in-progress`, `fulfilled`, `paused`. Snapshots and adapters are documented in [feed resilience](feed-resilience.md).

Inspect actual sheet headers and the existing parser before mapping or changing them. Retain existing feeds and compatibility. Do not change live sheets without owner approval. The following schemas are proposed canonical internal models, not claims about existing columns.

## Proposed public tabs / normalized models
| Tab | Fields | Render strategy |
|---|---|---|
| Hero | id, title, category, summary, image_url, image_alt, link_url, link_label, priority, published, starts_at, ends_at | Build snapshot + client refresh |
| Events | id, title, summary, start_at, end_at, venue, category, image_url, image_alt, link_url, link_label, status, published | Build snapshot + client refresh |
| ResearchArchive | id, title, year, category, summary, tags, workstations, image_url, image_alt, image_credit, primary_url, github_url, priority, published | Build snapshot; manual/scheduled rebuild |
| Workstations | id, name, summary, image_url, image_alt, image_credit, priority, published | Build snapshot; manual/scheduled rebuild |
| Contributors | id, display_name, category, public_url, year, project_id, published, priority | Build snapshot; manual/scheduled rebuild |

Use stable slug IDs, lowercase enumerations, ISO dates and ISO 8601 offsets for times (Europe/Zurich display). CSV booleans accept explicit TRUE/FALSE only; empty optional cells map to null. Multi-value cells use a documented separator (proposed semicolon). Use a standards-compliant CSV parser for commas, multiline fields and escaped quotes. Trim values; validate types and allowed URL schemes. Treat sheet content as untrusted; render plain text by default, never raw HTML. Published rows only; drafts and expired hero entries excluded. Unknown categories and invalid rows generate clear diagnostics; avoid silently publishing partial or broken records.

Archive category proposal: institutional-research, artistic-practice, research-tool, material-study, infrastructure. Contributor category proposal: research-collaborator, institutional-partner, technology-partner, supporter. Do not store authorization evidence, private names, emails, personal donation amounts or contacts in public sources; keep approval records privately. Publish only approved names. Public spreadsheets are public even if a row is not rendered; do not use draft flags to hide sensitive data.

## Markdown
Store institutional pages and homepage copy in `src/content/pages/`, gallery rates in `src/content/gallery/`, financial support in `src/content/support/`, and footer/location copy in `src/content/site/`. Wishlist records live in Google Sheets; wishlist page copy lives in `src/content/pages/wishlist.md`. Use schema-validated frontmatter. Page frontmatter carries titles, ledes, CTAs, structured lists (pathways, offerings, threads, photos) and SEO descriptions. No booking system, checkout, shopping cart or fundraising progress bars without verified contribution data. Only confirmed needs; amounts not implied to be tax deductible.

## Media policy
No new editorial photographs, videos, audio, or research documentation binaries in the repository. Use external, stable, public HTTPS URLs, with permissions and descriptive alt text. The current hosts are Nextcloud on Synology NAS and Cloudinary; the site accepts any stable public HTTPS URL and does not bind itself to one provider. No expiring signed URLs or private share links. Legacy files already in the repository stay at their public paths. See [legacy media](legacy-media.md). **Authorised functional exceptions:** `public/imgs/contact-twint.png` and `public/imgs/stripe.png` (payment/contact QR codes). Do not download remote editorial images into Git. Existing brand graphics can be referenced from the authoritative external brand kit; inline SVG/CSS are code, not media libraries.

## Refresh and failure handling
Build a validated snapshot from the sheets for SEO and no-JS rendering. Hero, events, archive, workstations, contributors and wishlist refresh client-side from the same CSV endpoints, keeping the last rendered snapshot on timeout, invalid data or offline state; avoid emptying the UI. Google publication/cache delays may apply. Feed refresh and last-known-good snapshots are specified in [feed resilience](feed-resilience.md). A temporary CSV outage must not block an unrelated build once a valid snapshot exists. A missing snapshot still fails the build, so the site is not deployed empty. Do not commit downloaded snapshots of private or unapproved data. Builds read committed snapshots in `src/data/feeds/`. Diagnostics cover missing required columns. No credentials in browser code.
