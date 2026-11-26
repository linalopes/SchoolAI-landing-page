# Content model and Google Sheets

## Source of truth
Markdown is canonical for long-form institutional text and the Research Wishlist. Google Sheets is canonical for frequently updated public editorial metadata, external media references, hero updates, events, archive and contributor credits. Never copy full external research articles. Configuration holds feed URLs, public contact links and site-wide metadata. No private records in public sheets or Git.

Canonical spreadsheet, do not edit it from the site: `https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit`

The Research Archive, when published, shows at most six selected rows from its sheet. The wishlist is Markdown and stays empty until a later phase. Donations will later use a TWINT personal-contact QR code and Stripe Payment Links. Neither is implemented now.

## Existing integrations (preserved)
- Published Google Sheets CSV base: `https://docs.google.com/spreadsheets/d/e/2PACX-1vSpM1GYZ-ohq9jHkppGkz4hCx_p3vuCDjekln1apcu1nV2KILUmDeoT3xeLTSprREAXWjiWY8AovP4y/pub`
- Events: `?gid=0&single=true&output=csv`
- Hero carousel: `?gid=1398027263&single=true&output=csv`
- Research Archive: `?gid=20271126&single=true&output=csv`
- Workstations: `?gid=20271127&single=true&output=csv`
- Newsletter form action: `https://formspree.io/f/mvgbznoe`

Live Events and Hero columns are unchanged. Research Archive columns are `id`, `title`, `year`, `category`, `description`, `image_url`, `image_alt`, `url`, `github_url`, `featured`, `published`, `order`. Workstations columns are `id`, `title`, `tagline`, `description`, `image_url`, `image_alt`, `order`, `published`. Snapshots and adapters are documented in [feed resilience](feed-resilience.md).

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
Store narrative documents in `src/content/pages/` and wishlist items in `src/content/wishlist/`. Use schema-validated frontmatter. For a wishlist item: title, id, contribution_type (material/equipment/access/time/expertise/financial), status (open/fulfilled/paused), optional target_amount_chf, quantity, external_url, updated_at, published, and optional external image URL with alt. Body explains purpose and contribution instructions. No payment processing, booking system or progress automation. Only confirmed needs; amounts not implied to be tax deductible.

## Media policy
No new photographs, videos, audio, or other editorial media binaries in the repository. Use external, stable, public HTTPS URLs, with permissions and descriptive alt text. The current hosts are Nextcloud on Synology NAS and Cloudinary; the site accepts any stable public HTTPS URL and does not bind itself to one provider. No expiring signed URLs or private share links. Test direct image response, CORS where relevant, caching and performance. Legacy files already in the repository stay at their public paths for Phase 1. See [legacy media](legacy-media.md). Do not download remote images into Git or bundle them into generated source assets; use remote URLs and optionally provider-side variants. Existing brand graphics can be referenced from the authoritative external brand kit; inline SVG/CSS are code, not media libraries. Audit legacy `imgs/` and references before removing anything; preserve public legacy URLs during migration. New binary media must never be committed.

## Refresh and failure handling
Build a validated snapshot from the sheets for SEO and no-JS rendering. Hero, events, archive and workstations refresh client-side from the same CSV endpoints, keeping the last rendered snapshot on timeout, invalid data or offline state; avoid emptying the UI. Contributors remain rebuild-only when introduced. Google publication/cache delays may apply. Feed refresh and last-known-good snapshots are specified in [feed resilience](feed-resilience.md). A temporary CSV outage must not block an unrelated build once a valid snapshot exists. A missing snapshot still fails the build, so the site is not deployed empty. Do not commit downloaded snapshots of private or unapproved data. Builds read committed snapshots in `src/data/feeds/`. Diagnostics cover missing required columns. No credentials in browser code.
