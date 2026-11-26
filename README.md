# School of Tomorrow’s AI

Institutional website for [schoolai.linalopes.info](https://schoolai.linalopes.info/).

**Production** is the Astro static site on `main`, deployed to [schoolai.linalopes.info](https://schoolai.linalopes.info/) via GitHub Actions. Release tag: `v2.0.0`. Legacy HTML is preserved as `legacy-html-2026` / `v1.0.0-legacy` (`0a84b8c`). Migration branch `website-2027` is retained until the owner confirms.

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
12. [Production release and rollback](docs/production-release.md)

[AGENTS.md](AGENTS.md) is mandatory.

## Production architecture

- **Stack:** Astro 7 static output, TypeScript, native CSS (SchoolAI Brand Kit).
- **Editorial Markdown:** `src/content/` for institutional pages, homepage copy, gallery rates/photos, financial support.
- **Google Sheets feeds:** hero, events, research archive, workstations, contributors, wishlist — validated snapshots in `src/data/feeds/`.
- **Builds:** offline against committed snapshots. Production deploy never calls Google Sheets.
- **Hosting:** GitHub Pages via `.github/workflows/deploy.yml` on `refs/heads/main` only (push or manual dispatch).
- **Domain:** `schoolai.linalopes.info` (no repository-name base path).
- **Routes:** `/`, `/about/`, `/research/`, `/atelier/`, `/programme/`, `/inverted-gallery/`, `/collaborate/`, `/collaborate/wishlist/`, plus legacy HTML under `public/`.
- **Legacy preservation:** `legacy-html-2026` / `v1.0.0-legacy` at `0a84b8c`. Rollback uses temporary branch-root publishing of that branch — merging an ancestor does not restore its tree. See [docs/production-release.md](docs/production-release.md).

### Local development

```sh
npm ci
npm run refresh-feeds   # fetch and validate public CSV feeds (skips write if editorial data unchanged)
npm run dev             # http://localhost:4321
npm run check
npm test
npm run build           # offline against committed snapshots
npm run preview
npm run test:dist
```

Node **22.23.4** or newer. The lockfile is the dependency source.

### GitHub Actions

| Workflow | Purpose | Triggers |
|---|---|---|
| `validate.yml` | Check, test, offline build | Push to `website-2027` / `main`, pull requests |
| `deploy.yml` | Validate, build, deploy `dist/` to Pages | Push to `main`, manual `workflow_dispatch` on `main` only |
| `refresh-snapshots.yml` | Refresh feed snapshots; commit + dispatch Deploy when editorial data changes | Daily 06:00 UTC + manual `workflow_dispatch` on `main` |

`refresh-snapshots.yml` commits with `GITHUB_TOKEN` (push events do not chain Deploy) and **explicitly dispatches** `deploy.yml` when public editorial payload changes. Timestamp-only `fetchedAt` updates do not create commits.

### GitHub Pages (active)

- Source: **GitHub Actions** (`.github/workflows/deploy.yml`)
- Custom domain: **schoolai.linalopes.info**
- HTTPS enforced

Release and rollback: [docs/production-release.md](docs/production-release.md).

## How to update website content

### Two kinds of updates

| Source | What it controls | How changes appear |
|---|---|---|
| **Markdown** in `src/content/` | Institutional text, homepage copy, gallery rates, gallery photos, financial support, CTAs, SEO descriptions | Requires a new **build and deployment** |
| **Google Sheets** (public CSV) | Hero carousel, events, selected research archive, workstations, contributors, wishlist | After `npm run refresh-feeds` and deploy for snapshots; live pages also refresh once in the browser and keep the last good content if the request fails |

Do **not** edit `.astro` or `.ts` files to change institutional wording, prices, payment labels or photograph URLs.

### Content directory

```text
src/content/
  pages/
    home.md                 # Homepage sections, hero, marquee, newsletter
    about.md                # The School
    research.md             # Artificial Emotion + archive intro
    atelier.md              # Atelier page + workstation intro
    programme.md            # Programme offerings + event labels
    inverted-gallery.md     # Gallery narrative, rental CTAs, optional photos
    collaborate.md          # Pathways, wishlist teaser, Made possible by copy, contact
    wishlist.md             # Research Wishlist page copy, labels and CTAs
  gallery/
    rental-rates.md         # Dimensions, category copy, CHF rate table
  support/
    financial-support.md    # TWINT / Stripe copy, images, Payment Link, enabled flags
  site/
    location.md             # Canonical physical address + maps URL
    footer.md               # Footer labels, Explore/Elsewhere links, social
```

### Google Sheets

Canonical spreadsheet (do not edit from the website):

https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit

Published CSV endpoints:

| Feed | GID | URL |
|---|---|---|
| Events | `0` | https://docs.google.com/spreadsheets/d/e/2PACX-1vSpM1GYZ-ohq9jHkppGkz4hCx_p3vuCDjekln1apcu1nV2KILUmDeoT3xeLTSprREAXWjiWY8AovP4y/pub?gid=0&single=true&output=csv |
| Hero carousel | `1398027263` | https://docs.google.com/spreadsheets/d/e/2PACX-1vSpM1GYZ-ohq9jHkppGkz4hCx_p3vuCDjekln1apcu1nV2KILUmDeoT3xeLTSprREAXWjiWY8AovP4y/pub?gid=1398027263&single=true&output=csv |
| Research Archive | `20271126` | https://docs.google.com/spreadsheets/d/e/2PACX-1vSpM1GYZ-ohq9jHkppGkz4hCx_p3vuCDjekln1apcu1nV2KILUmDeoT3xeLTSprREAXWjiWY8AovP4y/pub?gid=20271126&single=true&output=csv |
| Workstations | `20271127` | https://docs.google.com/spreadsheets/d/e/2PACX-1vSpM1GYZ-ohq9jHkppGkz4hCx_p3vuCDjekln1apcu1nV2KILUmDeoT3xeLTSprREAXWjiWY8AovP4y/pub?gid=20271127&single=true&output=csv |
| Contributors | `20271128` | https://docs.google.com/spreadsheets/d/e/2PACX-1vSpM1GYZ-ohq9jHkppGkz4hCx_p3vuCDjekln1apcu1nV2KILUmDeoT3xeLTSprREAXWjiWY8AovP4y/pub?gid=20271128&single=true&output=csv |
| Wishlist | `20271129` | https://docs.google.com/spreadsheets/d/e/2PACX-1vSpM1GYZ-ohq9jHkppGkz4hCx_p3vuCDjekln1apcu1nV2KILUmDeoT3xeLTSprREAXWjiWY8AovP4y/pub?gid=20271129&single=true&output=csv |

After sheet edits, run `npm run refresh-feeds`, commit the updated files under `src/data/feeds/`, then deploy when approved.

**Important:** A public CSV is not a privacy mechanism. Rows in the public spreadsheet are public even when unpublished. The published checkbox controls website visibility, not confidentiality. Only information authorised for public disclosure may be stored in the published spreadsheet.

### Common editorial tasks

**Change institutional text (The School, Research, Atelier, Programme, Gallery, Collaborate)**  
Edit the matching file in `src/content/pages/`. Frontmatter holds titles, ledes, CTAs and structured lists; the Markdown body (where present) holds longer prose.

**Edit homepage content**  
Edit `src/content/pages/home.md` — hero, marquee, each numbered section, and newsletter copy.

**Update carousel slides**  
Edit the Hero tab in Google Sheets → `npm run refresh-feeds`.

**Add or edit events**  
Edit the Events tab → `npm run refresh-feeds`. Past events with status `past` appear on `/programme/`; cancelled rows are omitted.

**Change featured research projects**  
Edit the Research Archive tab (`featured`, `published`, `order`). At most six published featured rows appear. → `npm run refresh-feeds`.

**Update workstation descriptions and images**  
Edit the Workstations tab. Use public HTTPS image URLs only. → `npm run refresh-feeds`.

**Add or update public contributors (Made possible by)**  
Edit the Contributors tab (`id`, `name`, `category`, optional `url`, `year`, `order`, `published`). Categories:

| Sheet value | Label on the site |
|---|---|
| `supporter` | Individual Supporters |
| `institutional-support` | Institutional Support |
| `research-collaborator` | Research Collaborators |
| `technology-partner` | Technology Partners |

Set `published` to TRUE only for authorised public acknowledgements. Order with the `order` column. Empty rows and unchecked-only rows are ignored. Section titles and category labels live in `src/content/pages/collaborate.md`. → `npm run refresh-feeds`.

**Edit the institutional address**  
Edit `src/content/site/location.md` — venue, street, locality and maps URL. Homepage, Atelier, footer and Maps CTAs read this file. Keep Wetzikon-Zürich narrative wording in page Markdown where needed.

**Edit footer labels and external links**  
Edit `src/content/site/footer.md` — Explore/Elsewhere headings, Get directions label, external links (Lina Lopes, Research Blog, GitHub) and social links. Copyright year is generated at build time. Do not put the contact email in the footer.

**Add gallery photographs**  
In `src/content/pages/inverted-gallery.md`, add items under `photos:`:

```yaml
photos:
  - url: https://example.com/gallery-01.jpg
    alt: Visitors entering Inverted Gallery
    caption: Optional caption
    credit: Optional credit
    order: 1
```

Leave `photos: []` to hide the photo section. Do not commit gallery image files to Git.

**Change gallery rental rates**  
Edit `src/content/gallery/rental-rates.md` — dimensions, category descriptions and the `rates` list (`cultural_chf` / `regular_chf`). Rebuild to publish.

**Update financial support copy**  
Edit `src/content/support/financial-support.md`.

**Change or disable a payment option**  
In the same file, set `twint.enabled` or `stripe.enabled` to `false`. Update `stripe.payment_url`, labels, descriptions or image paths as needed. QR assets are:

- `/imgs/contact-twint.png` (personal-contact QR)
- `/imgs/stripe.png` (official Stripe QR)

**Add or update Research Wishlist items**  
Edit the Wishlist tab in Google Sheets. Columns:

| Column | Field | Notes |
|---|---|---|
| A | `id` | Required unique kebab-case id |
| B | `title` | Required |
| C | `category` | `equipment` · `material` · `access` · `expertise` · `time` · `financial` |
| D | `description` | Required |
| E | `quantity` | Optional text |
| F | `image_url` | Optional public HTTPS URL |
| G | `image_alt` | Required when an image is supplied |
| H | `reference_url` | Optional HTTPS product or reference link (not a checkout) |
| I | `target_amount_chf` | Optional positive amount; displayed as CHF |
| J | `status` | `open` · `in-progress` · `fulfilled` · `paused` |
| K | `fulfilled_by` | Optional authorised public credit |
| L | `fulfilled_year` | Optional year |
| M | `order` | Editorial display order |
| N | `published` | TRUE to show on the site |

Category labels on the site:

| Sheet value | Label |
|---|---|
| `equipment` | Equipment |
| `material` | Materials |
| `access` | Technology & Research Access |
| `expertise` | Expertise |
| `time` | Time & Assistance |
| `financial` | Financial Support |

- Current needs show published `open` and `in-progress` rows, grouped by category.
- Made possible together shows published `fulfilled` rows. Set `fulfilled_by` and `fulfilled_year` when acknowledging a contribution publicly.
- Paused rows stay in the sheet for later reactivation but are not shown in Current needs or contribution CTAs.
- Empty rows and unchecked-only `published` rows are ignored.
- Page introductions, section headings, status labels and CTA labels live in `src/content/pages/wishlist.md`. The Collaborate teaser lives in `src/content/pages/collaborate.md`.
- Route: `/collaborate/wishlist/`. Not linked from the primary navigation.
- → `npm run refresh-feeds`.

### Media rules

- Editorial photographs and research documentation: **external HTTPS URLs only** (Nextcloud, Cloudinary, or other stable public hosts).
- Authorised functional exceptions in Git: `public/imgs/contact-twint.png`, `public/imgs/stripe.png`.
- Legacy media already under `public/imgs/` and `public/history/` remains for compatibility.

## Non-blocking editorial limitations

Workstation photographs remain open and do not block production. Wishlist records and public contributor acknowledgements are managed through Google Sheets.
