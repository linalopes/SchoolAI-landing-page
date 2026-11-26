import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  loadArchiveSnapshot,
  loadEventsSnapshot,
  loadHeroSnapshot,
  loadWorkstationsSnapshot,
  selectUpcomingEvents,
  workstationTitles,
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
  assert.match(globalCss, /\.editorial-main/);
  assert.match(globalCss, /\.archive-grid/);
  assert.match(globalCss, /\.workstations-grid/);
});

test('homepage keeps the split hero, sheet carousel, atelier, and Formspree', () => {
  const hero = read('src/components/home/Hero.astro');
  const newsletter = read('src/components/home/Newsletter.astro');
  const atelier = read('src/components/home/Atelier.astro');
  const contract = read('src/lib/sheets/contract.ts');
  const homepage = read('src/scripts/homepage.ts');
  const indexPage = read('src/pages/index.astro');
  assert.match(hero, /id="hero-carousel"/);
  assert.match(hero, /Strange questions/);
  assert.match(hero, /site\.description/);
  assert.match(read('src/data/site.ts'), /independent atelier for experimental research/);
  assert.match(hero, /loadHeroSnapshot/);
  assert.match(newsletter, /https:\/\/formspree.io\/f\/mvgbznoe/);
  assert.match(contract, /https:\/\/formspree.io\/f\/mvgbznoe/);
  assert.match(atelier, /src="\/space3d\.html"/);
  assert.match(atelier, /id="atelier"/);
  assert.match(atelier, /Eight interconnected research workstations/);
  assert.match(atelier, /href="\/atelier\/"/);
  assert.doesNotMatch(atelier, /seven|later phase|planned route|snapshot/i);
  assert.match(contract, /gid=1398027263/);
  assert.match(contract, /gid=0/);
  assert.match(contract, /gid=20271126/);
  assert.match(contract, /gid=20271127/);
  assert.match(contract, /1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/);
  assert.match(homepage, /prefers-reduced-motion/);
  assert.match(homepage, /hero-carousel-pause|Pause/);
  assert.match(homepage, /refreshArchive/);
  assert.match(homepage, /refreshWorkstations/);
  assert.match(indexPage, /SchoolIntro/);
  assert.match(indexPage, /ArtificialEmotion/);
  assert.match(indexPage, /SelectedResearch/);
  assert.match(indexPage, /Programme/);
  assert.match(indexPage, /Gallery/);
});

test('Selected Research uses the archive feed without hardcoded project cards', () => {
  const selected = read('src/components/home/SelectedResearch.astro');
  const archiveComponent = read('src/components/research/ResearchArchive.astro');
  const contract = read('src/lib/sheets/contract.ts');
  assert.match(selected, /ResearchArchive/);
  assert.match(archiveComponent, /loadArchiveSnapshot/);
  assert.match(archiveComponent, /data-feed="archive"/);
  assert.match(archiveComponent, /Explore the Research Archive|archiveCta/);
  assert.match(contract, /Explore the Research Archive/);
  assert.match(contract, /blog\.linalopes\.info/);
  assert.doesNotMatch(archiveComponent, /Affective Atmosphere 2046|Mr\. Sonnet|Claw-Pilot/);
  assert.match(read('src/data/feeds/archive.json'), /affective-atmosphere-2046/);
});

test('navigation promotes all seven institutional routes while keeping homepage anchors', () => {
  const nav = read('src/data/navigation.ts');
  const view = read('src/components/navigation/SiteNav.astro');
  const footer = read('src/components/navigation/SiteFooter.astro');
  const hero = read('src/components/home/Hero.astro');
  const researchHome = read('src/components/home/ArtificialEmotion.astro');
  const atelierHome = read('src/components/home/Atelier.astro');
  const programmeHome = read('src/components/home/Programme.astro');
  const galleryHome = read('src/components/home/Gallery.astro');
  const collaborateHome = read('src/components/home/Collaborate.astro');
  for (const label of ['The School', 'Research', 'The Atelier', 'Programme', 'Inverted Gallery', 'Collaborate']) {
    assert.match(nav, new RegExp(label));
  }
  assert.match(nav, /href: '\/about\/'/);
  assert.match(nav, /href: '\/research\/'/);
  assert.match(nav, /href: '\/atelier\/'/);
  assert.match(nav, /href: '\/programme\/'/);
  assert.match(nav, /href: '\/inverted-gallery\/'/);
  assert.match(nav, /href: '\/collaborate\/'/);
  assert.match(nav, /plannedRoutes/);
  const planned = nav.slice(nav.indexOf('export const plannedRoutes'));
  assert.match(planned, /wishlist/);
  assert.match(planned, /contributors/);
  assert.doesNotMatch(planned, /href: '\/programme\/'/);
  assert.doesNotMatch(planned, /href: '\/inverted-gallery\/'/);
  assert.doesNotMatch(planned, /href: '\/collaborate\/'/);
  assert.doesNotMatch(nav, /href: '\/#programme'/);
  assert.doesNotMatch(nav, /href: '\/#gallery'/);
  assert.doesNotMatch(nav, /href: '\/#collaborate'/);
  assert.doesNotMatch(nav, /href: '\/#research'/);
  assert.doesNotMatch(nav, /href: '\/#atelier'/);
  assert.match(researchHome, /id="research"/);
  assert.match(atelierHome, /id="atelier"/);
  assert.match(programmeHome, /id="programme"/);
  assert.match(galleryHome, /id="gallery"/);
  assert.match(collaborateHome, /id="collaborate"/);
  assert.match(programmeHome, /href="\/programme\/"/);
  assert.match(galleryHome, /href="\/inverted-gallery\/"/);
  assert.match(collaborateHome, /href="\/collaborate\/"/);
  assert.match(hero, /href="\/research\/"/);
  assert.match(hero, /href="\/collaborate\/"/);
  assert.match(footer, /href="\/programme\/"/);
  assert.match(footer, /href="\/inverted-gallery\/"/);
  assert.match(footer, /href="\/collaborate\/"/);
  assert.match(view, /navItems/);
  assert.match(view, /homeHref/);
  assert.match(view, /id="nav-hamburger"/);
});

test('Research, Atelier, Programme, Gallery and Collaborate pages exist with approved content', () => {
  const research = read('src/pages/research/index.astro');
  const atelier = read('src/pages/atelier/index.astro');
  const programme = read('src/pages/programme/index.astro');
  const gallery = read('src/pages/inverted-gallery/index.astro');
  const collaborate = read('src/pages/collaborate/index.astro');
  const support = read('src/data/support.ts');
  assert.match(research, /Artificial Emotion/);
  assert.match(research, /Kinetic Studies/);
  assert.match(research, /Soft Mechanisms/);
  assert.match(research, /Bio-signals/);
  assert.match(research, /site\.researchNotebookUrl/);
  assert.match(read('src/data/site.ts'), /emotion\.linalopes\.info/);
  assert.match(research, /Open research and open source/);
  assert.match(research, /ResearchArchive/);
  assert.doesNotMatch(research, /PhD|phase 3|snapshot|planned route/i);
  assert.match(atelier, /WorkstationsDirectory/);
  assert.match(atelier, /space3d\.html/);
  assert.match(atelier, /Arrange a visit/);
  assert.match(atelier, /Propose a research collaboration/);
  assert.match(atelier, /not available for rental/);
  assert.doesNotMatch(atelier, /seven workstation|phase 3|snapshot|planned route|one-to-one correspondence|data model/i);
  assert.match(programme, /Open Research Studio/);
  assert.match(programme, /Research-based workshops/);
  assert.match(programme, /selectPastEventsPreview|Past events/);
  assert.match(programme, /room-for-interaction\.html/);
  assert.match(programme, /arduino-day-2026\.html/);
  assert.match(programme, /Newsletter/);
  assert.match(gallery, /Inverted Gallery/);
  assert.match(gallery, /Space rental|space rental/i);
  assert.match(gallery, /Cultural use/);
  assert.match(gallery, /Commercial use/);
  assert.match(gallery, /Curatorial collaboration/);
  assert.match(gallery, /Only Inverted Gallery is available for rental/);
  assert.match(gallery, /galleryImageUrl/);
  assert.doesNotMatch(gallery, /CHF|price|calendar|booking system|placeholder image/i);
  assert.match(collaborate, /Research grows through exchange/);
  assert.match(collaborate, /Research Collaboration/);
  assert.match(collaborate, /Student Research/);
  assert.match(collaborate, /Technology Partnerships/);
  assert.match(collaborate, /Commissioned Research/);
  assert.match(collaborate, /Hands-on Contributions/);
  assert.match(collaborate, /Financial Support/);
  assert.match(collaborate, /does not offer formal employment, residency programmes, internships/);
  assert.doesNotMatch(collaborate, /TWINT|Stripe|payment link|IBAN/i);
  assert.match(support, /wishlist/);
  assert.match(support, /contributors/);
  assert.match(support, /twintPersonalContactQrUrl/);
  assert.match(support, /stripePaymentLinks/);
  assert.deepEqual(
    readdirSync(join(root, 'src/content/wishlist')).filter((name) => name.endsWith('.md')),
    [],
  );
});

test('eight-workstation nomenclature is confirmed and seven-station copy is gone from public pages', () => {
  assert.deepEqual([...workstationTitles], [
    'BioLab',
    'Makerspace',
    'Dirty Workshop',
    'Electronics Bench',
    'Wearables Lab',
    'Craft Office',
    'Studio',
    'Saloon',
  ]);
  for (const path of [
    'src/components/home/Atelier.astro',
    'src/pages/atelier/index.astro',
    'src/pages/research/index.astro',
    'src/pages/index.astro',
    'src/components/home/Gallery.astro',
  ]) {
    const text = read(path);
    assert.doesNotMatch(text, /seven interconnected|seven stations|Electronics Bench & Wearables Lab|(?<!Craft )Office(?! of)/i);
  }
  const publicBundle = [
    read('src/components/home/Atelier.astro'),
    read('src/pages/atelier/index.astro'),
    read('src/components/atelier/WorkstationsDirectory.astro'),
  ].join('\n');
  for (const title of workstationTitles) {
    assert.match(publicBundle + read('src/data/feeds/workstations.json'), new RegExp(title));
  }
});

test('The School page is Markdown-backed and links to the founder site', () => {
  const aboutMd = read('src/content/pages/about.md');
  const aboutPage = read('src/pages/about/index.astro');
  assert.match(aboutMd, /September 2025/);
  assert.match(aboutMd, /Wetzikon/);
  assert.match(aboutMd, /tool, a medium, a material or a subject/);
  assert.match(aboutMd, /https:\/\/www\.linalopes\.info\//);
  assert.match(aboutPage, /getEntry\('pages', 'about'\)/);
  assert.match(aboutPage, /EditorialLayout/);
  assert.match(aboutPage, /\/imgs\/lina\.jpg/);
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

test('offline build can read all four committed snapshots without Google', () => {
  const hero = loadHeroSnapshot();
  const events = loadEventsSnapshot();
  const archive = loadArchiveSnapshot();
  const workstations = loadWorkstationsSnapshot();
  assert.equal(hero.items.length > 0, true);
  assert.equal(selectUpcomingEvents(events.items).length, 0);
  assert.equal(archive.items.length, 6);
  assert.equal(workstations.items.length, 8);
  assert.deepEqual(workstations.items.map((item) => item.title), [...workstationTitles]);
  assert.match(read('docs/feed-resilience.md'), /Last-known-good snapshots/);
  assert.match(read('docs/csv-parser.md'), /csv-parse/);
});
