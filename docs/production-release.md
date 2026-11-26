# Production release and rollback (Phase 4)

Do **not** execute this procedure until Phase 4B is explicitly approved.

## Current state (Phase 4A)

- Development branch: `website-2027` (Astro release candidate).
- Production branch: `main` at legacy HTML commit `0a84b8c`.
- GitHub Pages still publishes from the repository root of `main` until settings are switched to **GitHub Actions**.

## Manual GitHub settings (owner)

Before the first Astro production deployment:

1. **Settings → Pages → Build and deployment → Source:** GitHub Actions.
2. **Custom domain:** `schoolai.linalopes.info`.
3. **Enforce HTTPS:** enabled.
4. Confirm the `github-pages` environment exists (created automatically on first Actions deploy if needed).

Do not introduce a repository-name base path. The Astro `site` is `https://schoolai.linalopes.info` with root-relative assets.

## Phase 4B release procedure

Preserve history. Do not force-push. Do not delete history.

1. **Preserve legacy production**
   ```sh
   git fetch origin
   git branch legacy-html-2026 0a84b8c
   git push -u origin legacy-html-2026
   git tag v1.0.0-legacy 0a84b8c
   git push origin v1.0.0-legacy
   ```

2. **Promote the reviewed Astro branch into `main`**
   ```sh
   git checkout main
   git pull origin main
   git merge --no-ff website-2027 -m "Release Astro institutional website as production."
   git push origin main
   ```
   Prefer a reviewed merge (PR into `main`) if the owner wants GitHub review history. The merge must preserve Git history of both lines of work.

3. **Switch Pages source** to GitHub Actions (if not already switched).

4. **First Astro production deployment**  
   Pushing to `main` runs `.github/workflows/deploy.yml`. Optionally trigger **Actions → Deploy production site → Run workflow**.

5. **Verify production** at https://schoolai.linalopes.info/  
   Check home, `/about/`, `/research/`, `/atelier/`, `/programme/`, `/inverted-gallery/`, `/collaborate/`, legacy HTML routes, 3D tour, newsletter, TWINT/Stripe assets, CNAME.

6. **Tag the verified Astro release**
   ```sh
   git tag v2.0.0
   git push origin v2.0.0
   ```

7. **Retire `website-2027` only after successful verification**  
   Leave the branch available for a short period; delete only when the owner confirms.

## Snapshot refresh and deploy interaction

- `.github/workflows/refresh-snapshots.yml` can refresh feed JSON via `workflow_dispatch`.
- Daily schedule is **commented out** until approved.
- Commits made with `GITHUB_TOKEN` by GitHub Actions **do not** re-trigger the Deploy workflow. After a bot snapshot commit on `main`, run Deploy manually (or push a normal human commit) if the live site must rebuild from new snapshots.
- Production builds always use **committed** snapshots. They do not call Google Sheets at build time.

## Rollback

### Roll back to legacy HTML (`v1.0.0-legacy`)

1. Switch Pages source temporarily to **Deploy from a branch** → `legacy-html-2026` / `/ (root)`, **or** reset `main` via a forward merge/revert that restores the legacy tree without rewriting history (preferred: redeploy from `legacy-html-2026` with a temporary branch-based Pages config).
2. Safer alternative: merge `legacy-html-2026` into a new release commit on `main` that restores the HTML root layout, push `main`, and keep Actions deploy only if that commit still builds as Astro — for a true HTML rollback, switch Pages back to branch-root publishing of `legacy-html-2026`.
3. Verify https://schoolai.linalopes.info/.

### Roll back a bad Astro release

1. Identify the last good Astro commit (for example `v2.0.0` or the previous green deploy).
2. Revert the bad merge/commit on `main` with `git revert` (no force push).
3. Push `main` and let Deploy run, or re-run the workflow for the known-good commit via GitHub UI where supported.
4. Verify critical routes and feeds.

## Non-goals

- No force push to `main`.
- No deletion of `legacy-html-2026` or `v1.0.0-legacy` during rollback planning.
- No production deploy or Pages settings changes in Phase 4A.
