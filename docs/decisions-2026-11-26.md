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
- Phase 2 feed behaviour, including last-known-good snapshots, is specified in [feed resilience](feed-resilience.md). Phase 1 still loads the hero and events in the browser.
