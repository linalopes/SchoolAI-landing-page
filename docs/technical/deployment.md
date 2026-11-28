# Deployment and recovery

## Production

| Item | Value |
|---|---|
| Official branch | `main` |
| Production URL | https://schoolai.linalopes.info/ |
| Static output | `dist/` |
| Hosting | GitHub Pages via GitHub Actions |
| Domain / HTTPS | `schoolai.linalopes.info`, HTTPS enforced |
| Current tagged release | `v2.1.0` — School of Tomorrow’s AI — Website 2027 |
| Prepared next release | `v2.2.0` — Publications & Legacy Consolidation (see CHANGELOG; publish GitHub release only with owner approval) |
| Original Astro cutover | `v2.0.0` → commit `035d60a` |
| Legacy HTML archive | Branch `legacy-html-2026`, tag `v1.0.0-legacy`, commit `0a84b8c` |
| Migration branch | `website-2027` retired at `v2.1.0` (history preserved in `main`) |

Builds are offline from committed snapshots in `src/data/feeds/`. Production deploy never calls Google Sheets. External publication destinations are not build dependencies. Do not introduce a repository-name base path.

## Workflows

| Workflow | File | Triggers | Role |
|---|---|---|---|
| Validate static site | `validate.yml` | Push to `main`, pull requests | `check`, `test`, offline `build` |
| Deploy production site | `deploy.yml` | Push to `main`, manual `workflow_dispatch` (gated to `main`) | Validate, build, upload Pages artifact, deploy |
| Refresh editorial snapshots | `refresh-snapshots.yml` | Cron `0 6 * * *` (06:00 UTC), manual dispatch (gated to `main`) | `npm run refresh-feeds`; commit meaningful changes; dispatch Deploy |

### Permissions and concurrency

- Refresh workflow: `contents: write`, `actions: write`.  
- Deploy: standard Pages permissions as configured in the workflow.  
- Refresh concurrency group `refresh-snapshots` does not cancel in-progress runs.  

### GITHUB_TOKEN and Deploy

Commits created with `GITHUB_TOKEN` do **not** automatically trigger ordinary push-based Deploy workflows. The refresh workflow **explicitly dispatches** `deploy.yml` when public editorial snapshot payloads change. Timestamp-only `fetchedAt` updates do not create commits.

## GitHub Pages settings

1. **Settings → Pages → Build and deployment → Source:** GitHub Actions.  
2. **Custom domain:** `schoolai.linalopes.info`.  
3. **Enforce HTTPS:** enabled.

## Verification after deploy

Confirm:

- https://schoolai.linalopes.info/  
- Key institutional routes including `/collaborate/wishlist/`  
- Actions run green for Validate and Deploy  
- Canonical URLs and HTTPS  

## Rollback

### Legacy HTML (`v1.0.0-legacy` / `legacy-html-2026`)

Merging an ancestor into `main` does **not** restore that branch’s previous file tree.

1. **Settings → Pages → Source:** temporarily **Deploy from a branch**.  
2. Branch **`legacy-html-2026`**, folder **`/ (root)`**.  
3. Confirm domain and HTTPS.  
4. Verify the legacy site.  
5. Keep `legacy-html-2026` and `v1.0.0-legacy` permanently. Do not force-push or delete them.

Return to Astro: switch Pages Source back to **GitHub Actions** and re-run **Deploy production site** on the desired `main` commit.

### Bad Astro release

1. Identify the last good commit (for example `v2.0.0` or a prior green deploy).  
2. On `main`, `git revert` the bad commits (no force push).  
3. Push `main` or re-run Deploy for the known-good commit.  
4. Verify critical routes and feeds.

## Non-goals

- No force push to `main`.  
- No deletion of `legacy-html-2026`, `v1.0.0-legacy`, or `v2.0.0`.  
- Do not recreate `website-2027`; it was retired after ancestry verification at `v2.1.0`.  
- No repository-name base path.

## Maintenance notes

- GitHub Actions may warn that some actions still declare Node.js 20 while runners prefer Node 24. This does not block validation or deploy; track as routine workflow maintenance, not a release blocker.  
