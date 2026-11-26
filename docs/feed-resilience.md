# Feed resilience

Phase 2 design. Phase 1 does not fetch the spreadsheet during `npm run build`. The homepage still requests the published CSV in the browser and, as today, hides the carousel or shows the events error sentence if that request fails.

## Why the build must not depend on Google

A content typo, a dependency bump, or any other deploy must succeed while the published CSV is temporarily unreachable, once a valid snapshot already exists. The earlier note that every unavailable feed fails the build applies only when there is no last-known-good snapshot to serve.

## Last-known-good snapshot

Store one validated JSON snapshot per public tab, produced from the current column contract in `src/lib/sheets/contract.ts`. Hero columns today are `type`, `title`, `tagline`, `image_url`, `cta_label`, `cta_url`, `accent`. Event columns today are `date`, `time`, `title`, `tagline`, `location`, `type`, `status`, `url`. Do not rename the live sheet to match the proposed future fields.

A snapshot is public editorial data, not a private export. It may be committed. Do not commit draft rows, private names, or anything that is not already on the published CSV.

## Refresh and build

`npm run refresh-feeds` (Phase 2) fetches the published CSV, parses it with a standards-compliant parser, and validates every required column and URL scheme.

- Valid feed: replace that tab’s snapshot atomically.
- Unavailable feed, and a valid snapshot exists: leave the snapshot untouched, print a warning, and exit successfully so an unrelated build can continue.
- Unavailable feed, and no valid snapshot exists: fail. Shipping an empty hero or an empty events list by accident is worse than stopping.
- Invalid feed: do not replace the snapshot. Fail the refresh command and leave the last good file in place. The normal site build keeps using that file.

`npm run build` reads the committed snapshots and does not call Google. It fails only if a required snapshot is missing or no longer matches the contract. That keeps a Google outage from blocking a deploy, and it keeps a broken CSV from overwriting the site.

Client-side refresh, added in Phase 2, requests the same CSV after load. On timeout, invalid rows, or an offline browser, it keeps the snapshot already rendered. It does not clear the hero or the events list.

Archive, workstations, and contributor credits, when those tabs exist, follow the same snapshot rule and stay out of the client refresh path. The archive renders at most six published rows.

## Phase 1 boundary

None of the refresh script, the snapshot files, or the client fallback is implemented yet. Introducing them now would change the homepage’s failure behaviour before the parser and the column contract are tested together.
