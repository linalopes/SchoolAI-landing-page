# Decisions confirmed on 26 November 2026

These decisions amend the planning baseline. Phase 1 records them and does not turn them into new public pages.

- The official English name of the cultural space is Inverted Gallery.
- Only the Inverted Gallery is available for rental. The research atelier and its workstations are not rental spaces.
- The website is English.
- Research projects, personal websites, documentation, and GitHub repositories stay independent. The site links to them.
- The Research Archive will show at most six selected projects, managed in Google Sheets. It is not published in Phase 1.
- The Research Wishlist is Markdown in `src/content/wishlist/`. It stays empty until a later phase.
- Donations will later use a TWINT personal-contact QR code and Stripe Payment Links. Phase 1 has no payment UI, endpoint, or script.
- Editorial media URLs are provider-independent. The current hosts are Nextcloud on the Synology NAS and Cloudinary. New photographs, video, and research documentation media are not committed. Brand SVG logos and interface icons may stay in the repository.
- Existing legacy media paths stay through Phase 1. Their later move is described in [legacy media](legacy-media.md).
- The canonical editorial spreadsheet is <https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit>. The published CSV endpoints, sheet names, and column contracts stay as they are. Do not edit the live spreadsheet from the site.
- Phase 2 feed behaviour, including last-known-good snapshots, is specified in [feed resilience](feed-resilience.md). Builds read committed snapshots. Hero and events also refresh once in the browser and keep the snapshot if that request fails.
- Research Archive GID `20271126` is active. The public CTA label is “Explore the Research Archive”, linking to https://blog.linalopes.info/. The archive section is not published in Phase 2.
- CSV parsing uses the shared `src/lib/sheets/csv.ts` parser (no `csv-parse`). See [csv-parser.md](csv-parser.md).
- Node runtime for this branch is 22.23.4 or newer (`engines.node`).
- Navigation labels are The School, Research, The Atelier, Programme, Inverted Gallery, Collaborate. Live routes: Research → `/research/`; The Atelier → `/atelier/`; Programme → `/programme/`; Inverted Gallery → `/inverted-gallery/`; Collaborate → `/collaborate/`.
- The School institutional page is `/about/`, sourced from Markdown in `src/content/pages/about.md`.
- Founder biography and portfolio remain on https://www.linalopes.info/.
- Artificial Emotion notebook remains on https://emotion.linalopes.info/.
- There are eight editorial research workstations: BioLab, Makerspace, Dirty Workshop, Electronics Bench, Wearables Lab, Craft Office, Studio, Saloon. Electronics Bench and Wearables Lab are separate entries sharing a physical area. Craft Office replaces the former Office label. Inverted Gallery is not a workstation.
- Workstations sheet GID `20271127` is active. Archive and workstations refresh once in the browser and keep snapshot markup on failure.
- Programme past-event history shows status `past` only, excludes cancelled rows, sorts descending, and omits bare fragment URLs from public links.
- Wishlist (`src/content/wishlist/`) and contributors credits remain unpublished until approved content and permissions exist.
- **Editorial separation (permanent):** institutional copy, homepage sections, gallery narrative, rental rates, financial support, CTAs, SEO text and editorial image URLs live in Markdown under `src/content/`. Astro presents; TypeScript validates feeds and logic. Do not hardcode editable editorial content in `.astro` or `.ts`.
- Approved Inverted Gallery rental rates and dimensions are stored in `src/content/gallery/rental-rates.md` (63 m², 7 × 9 m; cultural and regular CHF tables).
- Approved financial support: TWINT personal-contact QR at `/imgs/contact-twint.png` and Stripe Payment Link `https://buy.stripe.com/4gMfZg6gLchX71P2wRcwg01` with `/imgs/stripe.png`, configured in `src/content/support/financial-support.md`. Those two PNG files are authorised functional media exceptions.
- Gallery photographs are optional external URLs in `src/content/pages/inverted-gallery.md` frontmatter; empty lists hide the photo section.
