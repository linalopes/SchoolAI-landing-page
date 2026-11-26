# Content management guide

Practical guide for maintaining [schoolai.linalopes.info](https://schoolai.linalopes.info/) without opening a local development environment.

All public website copy is English. Two systems control content:

| System | What you change | How it reaches the site |
|---|---|---|
| **Google Sheets** | Hero, events, research archive, workstations, contributors, wishlist records | Browser refresh soon after save; daily snapshot at 06:00 UTC; optional manual snapshot refresh |
| **Markdown on GitHub** | Institutional pages, rates, payments, footer, address, wishlist page labels | Commit to `main` → automatic deploy |

Never put private names, private emails, donation amounts or draft-only secrets into the published spreadsheet. The sheet is public even when `published` is FALSE.

Full column contracts: [Google Sheets reference](google-sheets.md).

---

## Publication timing

1. **Browser-side refresh** — After you save a published sheet row, open pages that use that feed may update once in the visitor’s browser. Google’s published CSV can lag.  
2. **Daily snapshot** — Every day at **06:00 UTC**, GitHub Actions refreshes validated snapshots. If editorial data changed, it commits and **deploys** automatically.  
3. **Manual snapshot refresh** — GitHub → **Actions** → **Refresh editorial snapshots** → Run workflow on `main` when you want an immediate static rebuild without waiting for the daily job.  
4. **Markdown on `main`** — Editing a file under `src/content/` and committing to `main` triggers **Deploy production site**.  
5. You do **not** need to run `npm run refresh-feeds` locally for ordinary spreadsheet work.

---

## Google Sheets tasks

Canonical spreadsheet:  
https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit

### Update Hero slides

1. Open the [Hero tab](https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit#gid=1398027263).  
2. Edit `type`, `title`, `tagline`, optional `image_url`, `cta_label`, optional `cta_url`, and `accent` (`pink` / `white` / `turquoise`).  
3. Use a stable public HTTPS image URL.  
4. Save. Homepage carousel updates via browser refresh and the next snapshot.

**Common mistakes:** Relative image paths; unsafe `javascript:` links; leaving a broken image URL.

### Create, edit or cancel events

1. Open the [Events tab](https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit#gid=0).  
2. Fill `date`, `time`, `title`, `tagline`, `location`, `type`, `status`, optional `url`.  
3. For a past listing use status `past`. To hide a cancelled event, use the cancelled status convention already in the sheet (cancelled rows are omitted from the site).  
4. Save. Homepage and `/programme/` update from the feed.

**Common mistakes:** Putting a bare `#` fragment as the only URL; expecting cancelled events to remain visible.

### Select featured Research Archive projects

1. Open the [Research Archive tab](https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit#gid=20271126).  
2. Set `published` and `featured` to TRUE for projects that should appear.  
3. Set `order` for display sequence. At most **six** published featured rows appear.  
4. Provide `url` (and optional `github_url`, `image_url` / `image_alt`).

**Common mistakes:** Featuring more than six rows and wondering why some are missing from the snapshot; missing `id`.

### Update workstation descriptions and photographs

1. Open the [Workstations tab](https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit#gid=20271127).  
2. Edit `title`, `tagline`, `description`, optional `image_url` / `image_alt`, `order`, `published`.  
3. Keep the eight confirmed workstation titles. Do not add Inverted Gallery as a workstation.

**Example:** `image_url` = a Nextcloud or Cloudinary HTTPS preview; `image_alt` = short plain-language description.

### Add authorised contributor names (Made possible by)

1. Open the [Contributors tab](https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit#gid=20271128).  
2. Add `id`, `name`, `category`, optional `url`, `year`, `order`, `published`.  
3. Categories: `supporter`, `institutional-support`, `research-collaborator`, `technology-partner`.  
4. Set `published` TRUE only with permission for a public credit.

**Common mistakes:** Publishing a name without authorisation; inventing anonymity wording for blank credits.

### Manage Research Wishlist records

1. Open the [Wishlist tab](https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit#gid=20271129).  
2. Required: `id`, `title`, `category`, `description`, `status`, `order`, `published`.  
3. Optional: `quantity`, `image_url` (+ **required** `image_alt` if image), `reference_url`, `target_amount_chf`.  
4. Categories: `equipment`, `material`, `access`, `expertise`, `time`, `financial`.  
5. Statuses: `open`, `in-progress`, `fulfilled`, `paused`.

Page labels and CTAs (not the item list) live in Markdown:  
https://github.com/linalopes/SchoolAI-landing-page/blob/main/src/content/pages/wishlist.md

### Mark a Wishlist need as fulfilled

1. Set `status` to `fulfilled`.  
2. Optionally set `fulfilled_by` (authorised public name) and `fulfilled_year`.  
3. Keep `published` TRUE to show it under **Made possible together**.  
4. Contribution CTAs are hidden for fulfilled items.

**Example:** Projection screen — `fulfilled`, `fulfilled_by` = Nina Judge, `fulfilled_year` = 2026.

### Hide a Wishlist item without deleting it

Set `published` to FALSE, or set `status` to `paused` (paused items are not shown in Current needs even if published).

---

## Markdown tasks (edit on GitHub)

You can edit files in the browser:

1. Open the file link below.  
2. Click the pencil (**Edit this file**).  
3. Change the text. Keep YAML frontmatter structure intact.  
4. Choose **Commit changes** directly to `main` (or open a pull request if you prefer review).  
5. Wait for **Deploy production site** under the Actions tab to finish.  
6. Hard-refresh the live page.

| Content | File |
|---|---|
| Homepage | [home.md](https://github.com/linalopes/SchoolAI-landing-page/blob/main/src/content/pages/home.md) |
| About | [about.md](https://github.com/linalopes/SchoolAI-landing-page/blob/main/src/content/pages/about.md) |
| Research | [research.md](https://github.com/linalopes/SchoolAI-landing-page/blob/main/src/content/pages/research.md) |
| Atelier | [atelier.md](https://github.com/linalopes/SchoolAI-landing-page/blob/main/src/content/pages/atelier.md) |
| Programme | [programme.md](https://github.com/linalopes/SchoolAI-landing-page/blob/main/src/content/pages/programme.md) |
| Inverted Gallery | [inverted-gallery.md](https://github.com/linalopes/SchoolAI-landing-page/blob/main/src/content/pages/inverted-gallery.md) |
| Collaborate | [collaborate.md](https://github.com/linalopes/SchoolAI-landing-page/blob/main/src/content/pages/collaborate.md) |
| Research Wishlist page copy | [wishlist.md](https://github.com/linalopes/SchoolAI-landing-page/blob/main/src/content/pages/wishlist.md) |
| Gallery rental rates | [rental-rates.md](https://github.com/linalopes/SchoolAI-landing-page/blob/main/src/content/gallery/rental-rates.md) |
| Financial support (TWINT / Stripe) | [financial-support.md](https://github.com/linalopes/SchoolAI-landing-page/blob/main/src/content/support/financial-support.md) |
| Footer labels and links | [footer.md](https://github.com/linalopes/SchoolAI-landing-page/blob/main/src/content/site/footer.md) |
| Physical address | [location.md](https://github.com/linalopes/SchoolAI-landing-page/blob/main/src/content/site/location.md) |

Do **not** edit `.astro` or `.ts` files to change wording, prices or photograph URLs.

Gallery and research photographs belong as **HTTPS URLs** in Markdown or Sheets — not as new files uploaded into this repository (except the authorised TWINT and Stripe QR assets).

---

## Troubleshooting

| Symptom | What to check |
|---|---|
| New sheet item missing | `published` TRUE? Required fields filled? Google CSV cache delay? Wait for daily refresh or run **Refresh editorial snapshots**. |
| Photograph not loading | URL must be public HTTPS and return the image directly. No signed/expiring links. |
| Event missing | Status cancelled? Date/status wrong? Check Programme vs homepage upcoming filter. |
| Contributor missing | `published` TRUE? Valid `category` enum? Empty row ignored? |
| Wishlist item still visible | Set `published` FALSE or `status` `paused`. Fulfilled items intentionally remain under Made possible together while published. |
| Snapshot refresh failed | Open the failed Actions run. Network failures keep the last good snapshot; invalid rows fail that feed until fixed. |
| Deploy failed | Open **Deploy production site** in Actions. Fix the failing check, then re-run or push a corrective commit on `main`. |

Further technical detail: [Deployment](../technical/deployment.md), [Feed resilience](../technical/feed-resilience.md).
