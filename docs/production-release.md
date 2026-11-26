# Production release and rollback

## Production architecture

- **Official production branch:** `main` (Astro static site).
- **Verified production commit / tag:** `v2.0.0` → `035d60a`.
- **Production URL:** https://schoolai.linalopes.info/
- **Hosting:** GitHub Pages via `.github/workflows/deploy.yml` (artifact = `dist/`). Deploy runs only on `refs/heads/main` (push or manual dispatch).
- **Builds:** offline from committed validated snapshots in `src/data/feeds/`. Production deploy never calls Google Sheets.
- **Snapshot automation:** `.github/workflows/refresh-snapshots.yml` daily at 06:00 UTC + manual `workflow_dispatch` on `main`. Meaningful editorial changes are committed; the workflow then **dispatches** Deploy (GITHUB_TOKEN pushes do not re-trigger push-based workflows). Timestamp-only `fetchedAt` updates do not create commits.
- **Legacy website:** permanently preserved as branch `legacy-html-2026` and tag `v1.0.0-legacy` at commit `0a84b8c`.
- **Migration branch:** `website-2027` retained until the owner confirms production is satisfactory.

Do not introduce a repository-name base path. Assets remain root-relative.

## GitHub Pages settings

1. **Settings → Pages → Build and deployment → Source:** GitHub Actions.
2. **Custom domain:** `schoolai.linalopes.info`.
3. **Enforce HTTPS:** enabled.

## Snapshot refresh and deploy interaction

- Daily schedule: `0 6 * * *` (06:00 UTC) on `main`.
- Manual: Actions → Refresh editorial snapshots → Run workflow (must target `main`).
- Refresh validates CSV feeds; network failures keep last-known-good snapshots; invalid data does not replace valid files.
- After a meaningful snapshot commit, the refresh workflow dispatches `deploy.yml` via the Actions API (`actions: write`).

## Rollback

### Roll back to legacy HTML (`v1.0.0-legacy` / `legacy-html-2026`)

Merging an ancestor branch into `main` does **not** restore that branch’s previous file tree. Git keeps the current tip’s content when histories already share ancestry. For a true HTML rollback:

1. In **Settings → Pages → Build and deployment → Source**, switch temporarily to **Deploy from a branch**.
2. Select branch **`legacy-html-2026`**, folder **`/ (root)`**.
3. Confirm the custom domain `schoolai.linalopes.info` and re-enable **Enforce HTTPS** when available.
4. Verify https://schoolai.linalopes.info/ serves the legacy HTML site.
5. Leave `legacy-html-2026` and `v1.0.0-legacy` permanently available. Do not force-push or delete them.

To return to Astro later: switch Pages Source back to **GitHub Actions** and re-run **Deploy production site** on the desired `main` commit (or push a new commit on `main`).

### Roll back a bad Astro release

1. Identify the last good Astro commit (for example `v2.0.0` or a previous green deploy).
2. On `main`, `git revert` the bad merge or commits (no force push).
3. Push `main` and let Deploy run, or re-run **Deploy production site** for the known-good commit via the GitHub UI where supported.
4. Verify critical routes and feeds.

## Non-goals

- No force push to `main`.
- No deletion of `legacy-html-2026` or `v1.0.0-legacy`.
- No deletion of `website-2027` without explicit owner approval.
- No repository-name base path.
