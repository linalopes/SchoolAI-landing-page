# Production release and rollback

## Production architecture (after Phase 4B)

- **Official production branch:** `main` (Astro static site).
- **Production URL:** https://schoolai.linalopes.info/
- **Hosting:** GitHub Pages via `.github/workflows/deploy.yml` (artifact = `dist/`).
- **Builds:** offline from committed validated snapshots in `src/data/feeds/`. Production deploy never calls Google Sheets.
- **Snapshot automation:** `.github/workflows/refresh-snapshots.yml` daily at 06:00 UTC + manual `workflow_dispatch` on `main`. When editorial data changes, the workflow commits snapshots and explicitly dispatches Deploy (GITHUB_TOKEN pushes do not re-trigger push-based workflows).
- **Legacy website:** permanently preserved as branch `legacy-html-2026` and tag `v1.0.0-legacy` at commit `0a84b8c`.
- **Astro release tag:** `v2.0.0` on the verified production commit.
- **Migration branch:** `website-2027` retained until the owner confirms production is satisfactory. Do not delete it during Phase 4B.

Do not introduce a repository-name base path. Assets remain root-relative.

## Owner GitHub Pages settings

Required before the first Astro push to `main`:

1. **Settings → Pages → Build and deployment → Source:** GitHub Actions.
2. **Custom domain:** `schoolai.linalopes.info`.
3. **Enforce HTTPS:** enabled when the certificate is available.
4. Preserve existing DNS unless a verified issue requires a change.

Do **not** push Astro source into `main` while Pages still publishes from the branch root of `main`.

## Phase 4B release procedure

Preserve history. Do not force-push. Do not rewrite or delete history.

1. **Preserve legacy production** (exact commit `0a84b8c`)
   ```sh
   git fetch origin
   git branch legacy-html-2026 0a84b8c
   git push -u origin legacy-html-2026
   git tag v1.0.0-legacy 0a84b8c
   git push origin v1.0.0-legacy
   ```

2. **Switch Pages source** to GitHub Actions (see above). Confirm `build_type` is workflow-based before promoting.

3. **Promote the reviewed Astro branch into `main`**
   ```sh
   git checkout main
   git pull origin main
   git merge --no-ff website-2027 -m "Release Astro institutional website as production."
   git push origin main
   ```
   Pushing to `main` runs Deploy. Optionally trigger **Actions → Deploy production site → Run workflow** on `main`.

4. **Verify production** at https://schoolai.linalopes.info/  
   Check home, `/about/`, `/research/`, `/atelier/`, `/programme/`, `/inverted-gallery/`, `/collaborate/`, legacy HTML routes, 3D tour, newsletter, TWINT/Stripe assets, sitemap, robots, 404, HTTPS.

5. **Tag the verified Astro release**
   ```sh
   git tag v2.0.0
   git push origin v2.0.0
   ```

6. **Retain `website-2027`** until the owner confirms. Delete only with explicit approval.

## Snapshot refresh and deploy interaction

- Daily schedule: `0 6 * * *` (06:00 UTC) on `main`.
- Manual: Actions → Refresh editorial snapshots → Run workflow (must target `main`).
- Refresh validates CSV feeds; network failures keep last-known-good snapshots; invalid data does not replace valid files.
- Commits occur only when public editorial payload changes (items / source URL), not when only `fetchedAt` would change.
- After a meaningful snapshot commit, the refresh workflow **dispatches** `deploy.yml` via the Actions API (`actions: write`). Do not rely on `GITHUB_TOKEN` push events to chain Deploy.
- Production builds remain independent of Google Sheets availability.

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
- No deletion of `website-2027` during Phase 4B.
- No repository-name base path.
