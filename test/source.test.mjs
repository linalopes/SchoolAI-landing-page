import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  loadEventsSnapshot,
  loadHeroSnapshot,
  selectUpcomingEvents,
} from '../src/lib/sheets/index.ts';

const root = fileURLToPath(new URL('..', import.meta.url));

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

test('brand tokens match the SchoolAI kit', () => {
  const tokens = read('src/styles/tokens.css');
  for (const hex of ['#22113E', '#CAD8D8', '#EA7DFF', '#08F2DB', '#FFFFFF', '#A21CAF']) {
    assert.match(tokens, new RegExp(hex, 'i'));
  }
  const type = read('src/styles/typography.css');
  assert.match(type, /Space Grotesk/);
  assert.match(type, /Courier Prime/);
  const globalCss = read('src/styles/global.css');
  assert.match(globalCss, /font-family: 'Inter'/);
  assert.match(globalCss, /prefers-reduced-motion/);
  assert.match(globalCss, /hero-carousel-pause/);
});

test('homepage keeps the split hero, sheet carousel, atelier, and Formspree', () => {
  const hero = read('src/components/home/Hero.astro');
  const newsletter = read('src/components/home/Newsletter.astro');
  const atelier = read('src/components/home/Atelier.astro');
  const contract = read('src/lib/sheets/contract.ts');
  const homepage = read('src/scripts/homepage.ts');
  assert.match(hero, /id="hero-carousel"/);
  assert.match(hero, /Strange questions/);
  assert.match(hero, /loadHeroSnapshot/);
  assert.match(newsletter, /https:\/\/formspree.io\/f\/mvgbznoe/);
  assert.match(contract, /https:\/\/formspree.io\/f\/mvgbznoe/);
  assert.match(atelier, /src="space3d.html"/);
  assert.match(contract, /gid=1398027263/);
  assert.match(contract, /gid=0/);
  assert.match(contract, /gid=20271126/);
  assert.match(contract, /1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/);
  assert.match(homepage, /prefers-reduced-motion/);
  assert.match(homepage, /hero-carousel-pause|Pause/);
});

test('research archive infrastructure exists but is not published on the homepage', () => {
  const indexPage = read('src/pages/index.astro');
  const contract = read('src/lib/sheets/contract.ts');
  assert.doesNotMatch(indexPage, /loadArchiveSnapshot|archive\.json/);
  assert.doesNotMatch(indexPage, /<section[^>]+id=["']research["']/);
  assert.match(contract, /Explore the Research Archive/);
  assert.match(contract, /blog\.linalopes\.info/);
  assert.match(read('src/data/feeds/archive.json'), /affective-atmosphere-2046/);
});

test('navigation labels match the current site', () => {
  const nav = read('src/data/navigation.ts');
  const view = read('src/components/navigation/SiteNav.astro');
  for (const label of ['The School', 'Research', 'Programs', 'Events', 'The Base', 'Lina', 'Blog']) {
    assert.match(nav, new RegExp(label));
  }
  assert.match(nav, /blog\.linalopes\.info\/schoolai\.html/);
  assert.match(nav, /#collaborate/);
  assert.match(view, /navItems/);
  assert.match(view, /id="nav-hamburger"/);
});

test('dependency set stays Astro, TypeScript, and native CSS', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.deepEqual(Object.keys(pkg.dependencies), ['astro']);
  assert.deepEqual(Object.keys(pkg.devDependencies).sort(), ['@astrojs/check', '@types/node', 'typescript']);
  assert.match(pkg.scripts['refresh-feeds'], /refresh-feeds/);
  assert.match(pkg.engines.node, /22\.23\.4/);
});

test('validation workflow does not deploy', () => {
  const workflow = read('.github/workflows/validate.yml');
  assert.match(workflow, /npm run build/);
  assert.doesNotMatch(workflow, /deploy-pages|peaceiris|github-pages-deploy|git push|actions\/upload-pages-artifact/);
});

test('legacy public paths remain', () => {
  for (const path of [
    'public/space3d.html',
    'public/room-for-interaction.html',
    'public/room-for-interaction.json',
    'public/arduino-day-2026.html',
    'public/peppers-ghost.html',
    'public/CNAME',
    'public/imgs/favicon.svg',
    'public/imgs/lina.jpg',
    'public/imgs/space/biolab.webp',
    'public/history/space3d.html',
  ]) {
    assert.equal(statSync(join(root, path)).isFile(), true, path);
  }
  assert.equal(read('public/CNAME').trim(), 'schoolai.linalopes.info');
});

test('no editorial media was added outside the preserved legacy paths', () => {
  const allowed = ['public/imgs', 'public/history'];
  const media = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.mp4', '.mov', '.webm', '.mp3', '.wav', '.pdf']);
  const skip = new Set(['node_modules', 'dist', '.git', '.astro']);
  const unexpected = [];

  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      if (skip.has(entry)) continue;
      const full = join(dir, entry);
      const info = statSync(full);
      if (info.isDirectory()) {
        walk(full);
        continue;
      }
      const ext = extname(entry).toLowerCase();
      if (!media.has(ext)) continue;
      const rel = relative(root, full);
      if (!allowed.some((prefix) => rel.startsWith(prefix))) unexpected.push(rel);
    }
  }

  walk(root);
  assert.deepEqual(unexpected, []);
});

test('offline build can read committed snapshots without Google', () => {
  const hero = loadHeroSnapshot();
  const events = loadEventsSnapshot();
  assert.equal(hero.items.length > 0, true);
  assert.equal(selectUpcomingEvents(events.items).length, 0);
  assert.match(read('docs/feed-resilience.md'), /Last-known-good snapshots/);
  assert.match(read('docs/csv-parser.md'), /csv-parse/);
});
