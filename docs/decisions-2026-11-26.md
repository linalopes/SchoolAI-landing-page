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
- Phase 3A navigation labels are The School, Research, The Atelier, Programme, Inverted Gallery, Collaborate. Only implemented destinations are linked.
- The School institutional page is `/about/`, sourced from Markdown in `src/content/pages/about.md`.
- Founder biography and portfolio remain on https://www.linalopes.info/.
- Artificial Emotion notebook remains on https://emotion.linalopes.info/.
