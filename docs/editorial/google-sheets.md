# Google Sheets reference

Six published CSV feeds drive live editorial records. Column contracts are defined in `src/lib/sheets/contract.ts` and enforced by typed adapters.

**Canonical spreadsheet (edit):**  
https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit

**Published CSV base:**  
`https://docs.google.com/spreadsheets/d/e/2PACX-1vSpM1GYZ-ohq9jHkppGkz4hCx_p3vuCDjekln1apcu1nV2KILUmDeoT3xeLTSprREAXWjiWY8AovP4y/pub`

Pattern: `{base}?gid={GID}&single=true&output=csv`

## Privacy

Published spreadsheets and CSV files are **public data sources**. The `published` checkbox controls website visibility only. It is not a confidentiality mechanism and not a privacy mechanism. Store only information authorised for public disclosure.

## Feeds overview

| Feed | GID | Edit tab | Snapshot | Client refresh |
|---|---|---|---|---|
| Events | `0` | [Open](https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit#gid=0) | `src/data/feeds/events.json` | Yes |
| Hero | `1398027263` | [Open](https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit#gid=1398027263) | `src/data/feeds/hero.json` | Yes |
| Research Archive | `20271126` | [Open](https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit#gid=20271126) | `src/data/feeds/archive.json` | Yes |
| Workstations | `20271127` | [Open](https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit#gid=20271127) | `src/data/feeds/workstations.json` | Yes |
| Contributors | `20271128` | [Open](https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit#gid=20271128) | `src/data/feeds/contributors.json` | Yes |
| Wishlist | `20271129` | [Open](https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit#gid=20271129) | `src/data/feeds/wishlist.json` | Yes |

## Shared rules

- Booleans: explicit `TRUE` / `FALSE` only.  
- Empty optional cells → `null` / omitted presentation.  
- Empty rows and rows with only an unchecked `published` checkbox are ignored.  
- URLs must be absolute `http`/`https` (unsafe schemes rejected).  
- Editorial photographs: public HTTPS only; never commit binaries for sheet images.  
- Snapshots store **published** rows only (archive: published **and** featured, max six).  
- Valid empty feeds are allowed (for example no upcoming events, empty wishlist).  

## Events (`gid=0`)

**CSV:** [Download](https://docs.google.com/spreadsheets/d/e/2PACX-1vSpM1GYZ-ohq9jHkppGkz4hCx_p3vuCDjekln1apcu1nV2KILUmDeoT3xeLTSprREAXWjiWY8AovP4y/pub?gid=0&single=true&output=csv)

| Column | Required | Notes |
|---|---|---|
| `date` | Yes | Editorial date string used for ordering and display |
| `time` | Yes | May be empty string in sheet; normalised |
| `title` | Yes | |
| `tagline` | Yes | |
| `location` | Yes | |
| `type` | Yes | |
| `status` | Yes | Visible upcoming vs `past`; cancelled omitted |
| `url` | Optional | Public link; bare `#` fragments omitted |

Homepage shows a small upcoming set; Programme shows upcoming and a past preview.

## Hero (`gid=1398027263`)

**CSV:** [Download](https://docs.google.com/spreadsheets/d/e/2PACX-1vSpM1GYZ-ohq9jHkppGkz4hCx_p3vuCDjekln1apcu1nV2KILUmDeoT3xeLTSprREAXWjiWY8AovP4y/pub?gid=1398027263&single=true&output=csv)

| Column | Required | Notes |
|---|---|---|
| `type` | Yes | Eyebrow / category label |
| `title` | Yes | |
| `tagline` | Yes | |
| `image_url` | Optional | Public HTTPS |
| `cta_label` | Yes | |
| `cta_url` | Optional | Absolute or site-relative editorial link |
| `accent` | Yes | `pink` · `white` · `turquoise` |

## Research Archive (`gid=20271126`)

**CSV:** [Download](https://docs.google.com/spreadsheets/d/e/2PACX-1vSpM1GYZ-ohq9jHkppGkz4hCx_p3vuCDjekln1apcu1nV2KILUmDeoT3xeLTSprREAXWjiWY8AovP4y/pub?gid=20271126&single=true&output=csv)

| Column | Required | Notes |
|---|---|---|
| `id` | Yes | Stable kebab-case |
| `title` | Yes | |
| `year` | Yes | Integer |
| `category` | Yes | Free text category label |
| `description` | Yes | |
| `image_url` | Optional | Public HTTPS |
| `image_alt` | Recommended with image | |
| `url` | Yes | Primary documentation URL |
| `github_url` | Optional | |
| `featured` | Yes | Boolean |
| `published` | Yes | Boolean |
| `order` | Yes | Integer sort key |

**Filter:** `published` and `featured`, sorted by `order`, **maximum six** items in the snapshot.

## Workstations (`gid=20271127`)

**CSV:** [Download](https://docs.google.com/spreadsheets/d/e/2PACX-1vSpM1GYZ-ohq9jHkppGkz4hCx_p3vuCDjekln1apcu1nV2KILUmDeoT3xeLTSprREAXWjiWY8AovP4y/pub?gid=20271127&single=true&output=csv)

| Column | Required | Notes |
|---|---|---|
| `id` | Yes | Stable kebab-case |
| `title` | Yes | Confirmed eight titles |
| `tagline` | Yes | |
| `description` | Yes | |
| `image_url` | Optional | Public HTTPS |
| `image_alt` | Recommended with image | Missing alt yields a warning |
| `order` | Yes | |
| `published` | Yes | |

**Filter:** published only, sorted by `order`. Inverted Gallery is not a workstation.

## Contributors (`gid=20271128`)

**CSV:** [Download](https://docs.google.com/spreadsheets/d/e/2PACX-1vSpM1GYZ-ohq9jHkppGkz4hCx_p3vuCDjekln1apcu1nV2KILUmDeoT3xeLTSprREAXWjiWY8AovP4y/pub?gid=20271128&single=true&output=csv)

| Column | Required | Notes |
|---|---|---|
| `id` | Yes | Stable kebab-case |
| `name` | Yes | Authorised public credit only |
| `category` | Yes | See enums |
| `url` | Optional | HTTPS |
| `year` | Yes | Integer |
| `order` | Yes | |
| `published` | Yes | |

**Categories:** `supporter` · `institutional-support` · `research-collaborator` · `technology-partner`  
Display labels live in `src/content/pages/collaborate.md`.

## Wishlist (`gid=20271129`)

**CSV:** [Download](https://docs.google.com/spreadsheets/d/e/2PACX-1vSpM1GYZ-ohq9jHkppGkz4hCx_p3vuCDjekln1apcu1nV2KILUmDeoT3xeLTSprREAXWjiWY8AovP4y/pub?gid=20271129&single=true&output=csv)

| Column | Required | Notes |
|---|---|---|
| `id` | Yes | Stable kebab-case |
| `title` | Yes | |
| `category` | Yes | See enums |
| `description` | Yes | |
| `quantity` | Optional | Free text |
| `image_url` | Optional | Public HTTPS |
| `image_alt` | **Required if image** | Validation error if missing |
| `reference_url` | Optional | Product/reference link — not checkout |
| `target_amount_chf` | Optional | Positive number; displayed as CHF |
| `status` | Yes | See enums |
| `fulfilled_by` | Optional | Authorised public credit |
| `fulfilled_year` | Optional | Valid year |
| `order` | Yes | |
| `published` | Yes | |

**Categories:** `equipment` · `material` · `access` · `expertise` · `time` · `financial`  
**Statuses:** `open` · `in-progress` · `fulfilled` · `paused`  

**Presentation:** Current needs = published `open` + `in-progress` (grouped by category). Made possible together = published `fulfilled`. Paused published rows stay in the snapshot but are hidden from those sections.

Page copy and CTA labels: `src/content/pages/wishlist.md`.

## After sheet edits

1. Browser-side refresh may update live visitors within seconds to minutes (Google cache delays apply).  
2. Daily snapshot refresh at **06:00 UTC** commits meaningful changes and deploys.  
3. For an immediate static rebuild, run **Actions → Refresh editorial snapshots** on `main`, or ask a developer to refresh locally and commit.

Owners do **not** need to run `npm run refresh-feeds` for ordinary spreadsheet edits.
