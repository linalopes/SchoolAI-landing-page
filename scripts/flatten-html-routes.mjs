#!/usr/bin/env node
/**
 * Emit selected Astro directory routes as root-level `.html` files so legacy
 * public URLs (for example /arduino-day-2026.html) stay unchanged without
 * switching the whole site to build.format = 'file'.
 */
import { mkdir, rename, rm, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const dist = join(root, 'dist');

/** @type {readonly string[]} */
const flatHtmlRoutes = ['arduino-day-2026', 'room-for-interaction', 'peppers-ghost'];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

for (const slug of flatHtmlRoutes) {
  const indexPath = join(dist, slug, 'index.html');
  const targetPath = join(dist, `${slug}.html`);
  if (!(await exists(indexPath))) {
    throw new Error(`Expected Astro output missing: ${indexPath}`);
  }
  if (await exists(targetPath)) {
    await rm(targetPath, { force: true });
  }
  await mkdir(dirname(targetPath), { recursive: true });
  await rename(indexPath, targetPath);
  await rm(join(dist, slug), { recursive: true, force: true });
  console.log(`flattened ${slug}/index.html → ${slug}.html`);
}
