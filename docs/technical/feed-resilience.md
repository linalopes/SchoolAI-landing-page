# Feed resilience

Normal production builds read committed snapshots and do not call Google Sheets.

## Feeds

| Feed | GID | Snapshot | Client refresh |
|---|---|---|---|
| Hero | `1398027263` | `src/data/feeds/hero.json` | Yes, once after load |
| Events | `0` | `src/data/feeds/events.json` | Yes, once after load |
| Research Archive | `20271126` | `src/data/feeds/archive.json` | Yes, once after load |
| Workstations | `20271127` | `src/data/feeds/workstations.json` | Yes, once after load |
| Contributors | `20271128` | `src/data/feeds/contributors.json` | Yes, once after load |
| Wishlist | `20271129` | `src/data/feeds/wishlist.json` | Yes, once after load |

Canonical spreadsheet: https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit  

Column contracts: `src/lib/sheets/contract.ts` · owner-facing detail: [google-sheets.md](../editorial/google-sheets.md)

## Pipeline

1. **Fetch** published CSV (Node refresh: 15s timeout; browser: `feedClientTimeoutMs` = 8s).  
2. **Parse** with shared `src/lib/sheets/csv.ts` (UTF-8 BOM, CRLF/LF, quoted commas, escaped quotes, multiline fields, header validation). No `csv-parse` dependency — one parser serves Node and the browser.  
3. **Validate / normalise** in typed adapters (booleans, integers, optional HTTPS URLs, enums).  
4. **Filter** unpublished rows; apply feed-specific rules (archive featured+limit; events cancel/past; wishlist status presentation).  
5. **Snapshot** — atomic write of public JSON under `src/data/feeds/`.  
6. **Meaningful-change detection** — refresh skips commit when `sourceUrl` + `items` are unchanged (ignores mere `fetchedAt` churn).  
7. **SSR** renders from the snapshot.  
8. **Client refresh** replaces markup when the live CSV parses successfully; on failure the existing DOM stays (last-known-good snapshots remain on screen).

## Failure modes

| Situation | Behaviour |
|---|---|
| Network failure, snapshot exists | Keep snapshot; warn; overall refresh may exit 0 if no invalid feeds |
| Network failure, no snapshot | Fail that feed |
| Invalid editorial data | Do **not** replace snapshot; fail refresh (exit 1) |
| Valid empty feed (e.g. no upcoming events, empty wishlist) | Success — empty is not a failure |
| Missing snapshot at build time | Build fails — site is not deployed empty |

Distinguish **network** failures from **invalid data**. Temporary Google outages must not block unrelated deploys once a valid snapshot exists.

## Feed-specific behaviour

- **Hero** — carousel slides; accent enum; optional imagery.  
- **Events** — upcoming on homepage; Programme shows upcoming + past preview; cancelled omitted.  
- **Archive** — published + featured, `order`, max six.  
- **Workstations** — published, `order`; optional images (alt recommended).  
- **Contributors** — published, grouped by category labels from Markdown.  
- **Wishlist** — published snapshot; UI shows open/in-progress vs fulfilled; paused hidden from those sections.  

## Refresh commands and automation

```sh
npm run refresh-feeds
```

Daily CI: `.github/workflows/refresh-snapshots.yml` at 06:00 UTC on `main`, plus manual dispatch. Meaningful snapshot commits dispatch Deploy (GITHUB_TOKEN pushes do not chain Deploy automatically).

```sh
npm run build
```

Reads committed snapshots only.

## Media

External image URLs stay as HTTPS references. Refresh and build never download editorial media into the repository.
