# Legacy media

Phase 1 keeps every media file that was already on `main`, at the same public path. Removing one would change a live URL. New photographs, video, audio, and research documentation files are not added.

## What stays, and where

| Public path | Role | Later move |
|---|---|---|
| `/imgs/sota-horizontal-bg-transparent-dark.svg`, `/imgs/favicon.svg` | Brand mark and icon | May remain in the repository. They are interface assets, not editorial media. |
| `/imgs/pepper_ghost_pyramid_template_6cm.svg` | Download on the Pepper’s Ghost page | Keep with that legacy page. |
| `/imgs/lina.jpg` | Portrait on the homepage and the Arduino Day page | Replace the `src` with a stable HTTPS URL, then remove the file only after those pages no longer request it. |
| `/imgs/space/*.webp`, `/imgs/space/entrance.gif` | Photographs and the entrance animation used by `/space3d.html` | Host on the existing Nextcloud (Synology) or Cloudinary, or another public HTTPS URL. Point `space3d.html` at those URLs. Keep the old paths until the tour and any external links are checked. |
| `/imgs/space/IMG_*.webp` | Used by `/history/space3d-1.html` only | Same external-host step. The history page’s relative `imgs/` path already 404s because it resolves under `/history/`. Fixing that path is a separate compatibility change. |
| `/history/*.pdf` | Local and live screenshots from March 2026, about 58 MB | Not linked in the navigation. Leave them until the owner approves deletion. Do not treat them as archive content. |

Brand patterns already load from `https://raw.githubusercontent.com/linalopes/SchoolAI-brand-kit`. That reference stays.

## Future migration

1. Choose a stable HTTPS URL for each photograph. Nextcloud public previews and Cloudinary delivery URLs both qualify when they return the image directly and do not expire. The site must not assume either host. A URL is just `https`.
2. Update the page or the 3D tour to that URL. Do not copy the file into `src/` or run it through Astro’s image pipeline.
3. Request the old path and the new path. Remove the repository file only when nothing in this site, and no approved external page, still needs the old path.
4. Hero and archive images continue to come from the spreadsheet’s `image_url` cells. The Maze Circuit preview currently returns HTTP 404, and another Nextcloud preview is served with a private cache. Those cells need new URLs before they are treated as durable. Do not commit replacement files to fix them.

Signed, expiring, or private-share URLs are not acceptable for a new reference.
