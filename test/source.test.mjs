import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { isVisibleEvent, parseCSV, sortEvents } from '../src/scripts/homepage.ts';

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
});

test('homepage keeps the split hero, sheet carousel, atelier, and Formspree', () => {
  const hero = read('src/components/home/Hero.astro');
  const newsletter = read('src/components/home/Newsletter.astro');
  const atelier = read('src/components/home/Atelier.astro');
  const contract = read('src/lib/sheets/contract.ts');
  assert.match(hero, /id="hero-carousel"/);
  assert.match(hero, /Strange questions/);
  assert.match(newsletter, /https:\/\/formspree.io\/f\/mvgbznoe/);
  assert.match(contract, /https:\/\/formspree.io\/f\/mvgbznoe/);
  assert.match(atelier, /src="space3d.html"/);
  assert.match(contract, /gid=1398027263/);
  assert.match(contract, /gid=0/);
  assert.match(contract, /1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/);
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
  assert.deepEqual(Object.keys(pkg.devDependencies).sort(), ['@astrojs/check', 'typescript']);
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

test('parser keeps quoted commas and the current event filter', () => {
  const csv = [
    'type,title,tagline,image_url,cta_label,cta_url,accent',
    'event,Your Hand Is the Prompt,A workshop,"https://images.example/a,b.png",Register,https://luma.com/example,turquoise',
    '',
    'reading,"Quoted ""title""",From text,https://example.com/c.webp,See,https://blog.example/post,pink',
  ].join('\n');
  const rows = parseCSV(csv);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].image_url, 'https://images.example/a,b.png');
  assert.equal(rows[1].title, 'Quoted "title"');

  const events = parseCSV([
    'date,time,title,tagline,location,type,status,url',
    '2026-03-28,13:00,Paper,Lab,Wetzikon,event,past,arduino-day-2026.html',
    '2026-11-21,10:00,Light,Embroidery,Wetzikon,workshop,cancel,#workshop-embroidering-light',
    '2026-12-02,19:00,Open studio,Visit,Wetzikon,event,upcoming,https://example.com/event',
    '2026-01-05,10:00,Earlier,Visit,Wetzikon,event,open,https://example.com/earlier',
  ].join('\n')).filter(isVisibleEvent);
  const sorted = sortEvents(events);
  assert.deepEqual(sorted.map((row) => row.title), ['Earlier', 'Open studio']);
});
