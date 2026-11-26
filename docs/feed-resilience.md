# Feed resilience

Phase 2 implementation. Normal builds read committed snapshots and do not call Google Sheets.

## Feeds

| Feed | Published GID | Snapshot | Client refresh |
|---|---|---|---|
| Hero | `1398027263` | `src/data/feeds/hero.json` | Yes, once after load |
| Events | `0` | `src/data/feeds/events.json` | Yes, once after load |
| Research Archive | `20271126` | `src/data/feeds/archive.json` | No |

Canonical spreadsheet: <https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit>

Do not edit the live spreadsheet from the site. Column contracts live in `src/lib/sheets/contract.ts`.

## Why the build must not depend on Google

A content typo, dependency bump, or unrelated deploy must succeed while the published CSV is temporarily unreachable, once a valid snapshot already exists.

## Last-known-good snapshots

Snapshots are public, validated JSON. They may be committed under `src/data/feeds/`. They must not contain private spreadsheet material or unpublished archive rows. The archive snapshot stores only published and featured entries, sorted by `order`, limited to six. Loaders resolve that directory from `process.cwd()` so offline builds and Astro prerender do not depend on Google or on `import.meta.url` after bundling.

## Refresh and build

```sh
npm run refresh-feeds
```

Fetches each published CSV, parses it with the shared CSV parser, validates the typed adapter, and replaces that feed’s snapshot atomically.

- Valid feed: replace the snapshot.
- Network failure, and a valid snapshot exists: leave the snapshot, print a warning, exit 0 for that condition across feeds that only had network issues.
- Network failure, and no valid snapshot exists: fail.
- Invalid feed: do not replace the snapshot, print a failure, exit 1. The previous file remains for builds.

```sh
npm run build
```

Reads the committed snapshots only. It fails if a required snapshot is missing or no longer matches the contract. It does not fetch Google.

Client-side hero and events refresh request the same CSV once after load, with a timeout. On timeout, invalid data, or an offline browser, the already rendered snapshot stays on screen. The archive feed is not refreshed in the browser and is not published on the homepage in Phase 2.

## Parser

See [csv-parser.md](csv-parser.md). External image URLs stay as HTTPS references. Refresh and build never download editorial media into the repository.
