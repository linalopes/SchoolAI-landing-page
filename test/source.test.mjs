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
import { authorisedFunctionalMedia } from '../src/data/site.ts';

const root = fileURLToPath(new URL('..', import.meta.url));

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

function listAstroAndTs() {
  const files = [];
  const skip = new Set(['node_modules', 'dist', '.git', '.astro']);
  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      if (skip.has(entry)) continue;
      const full = join(dir, entry);
      const info = statSync(full);
      if (info.isDirectory()) {
        walk(full);
        continue;
      }
      if (/\.(astro|ts)$/.test(entry) && !full.includes(`${join('src', 'data', 'feeds')}`)) {
        files.push(relative(root, full));
      }
    }
  }
  walk(join(root, 'src'));
  return files;
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
  assert.match(globalCss, /\.support-methods/);
  assert.match(globalCss, /\.rental-table/);
});

test('homepage keeps the split hero, sheet carousel, atelier, and Formspree', () => {
  const hero = read('src/components/home/Hero.astro');
  const newsletter = read('src/components/home/Newsletter.astro');
  const atelier = read('src/components/home/Atelier.astro');
  const homeMd = read('src/content/pages/home.md');
  const contract = read('src/lib/sheets/contract.ts');
  const homepage = read('src/scripts/homepage.ts');
  const indexPage = read('src/pages/index.astro');
  assert.match(hero, /id="hero-carousel"/);
  assert.match(hero, /requirePage\('home'\)/);
  assert.match(hero, /loadHeroSnapshot/);
  assert.match(homeMd, /Strange questions/);
  assert.match(homeMd, /independent atelier for experimental research/);
  assert.match(newsletter, /formspreeAction/);
  assert.match(contract, /https:\/\/formspree.io\/f\/mvgbznoe/);
  assert.match(atelier, /src="\/space3d\.html"/);
  assert.match(atelier, /id="atelier"/);
  assert.match(homeMd, /Eight interconnected research workstations/);
  assert.match(homeMd, /href: \/atelier\//);
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
  const homeMd = read('src/content/pages/home.md');
  assert.match(selected, /ResearchArchive/);
  assert.match(archiveComponent, /loadArchiveSnapshot/);
  assert.match(archiveComponent, /data-feed="archive"/);
  assert.match(homeMd, /Explore the Research Archive/);
  assert.match(homeMd, /blog\.linalopes\.info/);
  assert.doesNotMatch(archiveComponent, /Affective Atmosphere 2046|Mr\. Sonnet|Claw-Pilot/);
  assert.match(read('src/data/feeds/archive.json'), /affective-atmosphere-2046/);
});

test('navigation promotes all seven institutional routes while keeping homepage anchors', () => {
  const nav = read('src/data/navigation.ts');
  const view = read('src/components/navigation/SiteNav.astro');
  const footer = read('src/components/navigation/SiteFooter.astro');
  const homeMd = read('src/content/pages/home.md');
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
  const planned = nav.slice(nav.indexOf('export const plannedRoutes'));
  assert.match(planned, /wishlist/);
  assert.match(planned, /contributors/);
  assert.doesNotMatch(planned, /href: '\/programme\/'/);
  assert.match(researchHome, /id="research"/);
  assert.match(atelierHome, /id="atelier"/);
  assert.match(programmeHome, /id="programme"/);
  assert.match(galleryHome, /id="gallery"/);
  assert.match(collaborateHome, /id="collaborate"/);
  assert.match(homeMd, /href: \/programme\//);
  assert.match(homeMd, /href: \/inverted-gallery\//);
  assert.match(homeMd, /href: \/collaborate\//);
  assert.match(homeMd, /href: \/research\//);
  assert.match(footer, /href="\/programme\/"/);
  assert.match(view, /navItems/);
  assert.match(view, /id="nav-hamburger"/);
});

test('institutional editorial content is sourced from Markdown', () => {
  for (const name of [
    'home.md',
    'about.md',
    'research.md',
    'atelier.md',
    'programme.md',
    'inverted-gallery.md',
    'collaborate.md',
  ]) {
    assert.equal(statSync(join(root, 'src/content/pages', name)).isFile(), true, name);
  }
  assert.equal(statSync(join(root, 'src/content/gallery/rental-rates.md')).isFile(), true);
  assert.equal(statSync(join(root, 'src/content/support/financial-support.md')).isFile(), true);

  const researchMd = read('src/content/pages/research.md');
  assert.match(researchMd, /Artificial Emotion/);
  assert.match(researchMd, /Kinetic Studies/);
  assert.match(researchMd, /Soft Mechanisms/);
  assert.match(researchMd, /Bio-signals/);

  const galleryMd = read('src/content/pages/inverted-gallery.md');
  assert.match(galleryMd, /Only Inverted Gallery is available for rental/);
  assert.match(galleryMd, /inverted-gallery-1\.jpg/);
  assert.match(galleryMd, /inverted-gallery-2\.jpg/);
  assert.match(galleryMd, /before its planned transformation/);

  const collaborateMd = read('src/content/pages/collaborate.md');
  assert.match(collaborateMd, /Research Collaboration/);
  assert.match(collaborateMd, /Student Research/);
  assert.match(collaborateMd, /Technology Partnerships/);
  assert.match(collaborateMd, /Commissioned Research/);
  assert.match(collaborateMd, /Hands-on Contributions/);
  assert.match(collaborateMd, /Financial Support/);

  const researchPage = read('src/pages/research/index.astro');
  const atelierPage = read('src/pages/atelier/index.astro');
  const programmePage = read('src/pages/programme/index.astro');
  const galleryPage = read('src/pages/inverted-gallery/index.astro');
  const collaboratePage = read('src/pages/collaborate/index.astro');
  assert.match(researchPage, /requirePage\('research'\)/);
  assert.match(atelierPage, /requirePage\('atelier'\)/);
  assert.match(programmePage, /requirePage\('programme'\)/);
  assert.match(galleryPage, /requirePage\('inverted-gallery'\)/);
  assert.match(collaboratePage, /requirePage\('collaborate'\)/);
  assert.match(collaboratePage, /FinancialSupport/);
  assert.match(galleryPage, /GalleryRentalRates/);
  assert.match(galleryPage, /GalleryPhotos/);
  assert.doesNotMatch(researchPage, /PhD|phase 3|planned route/i);
  assert.doesNotMatch(atelierPage, /seven workstation|phase 3|planned route/i);
});

test('rental rates live in Markdown and are not hardcoded in Astro or TypeScript', () => {
  const ratesMd = read('src/content/gallery/rental-rates.md');
  assert.match(ratesMd, /area_m2: 63/);
  assert.match(ratesMd, /width_m: 7/);
  assert.match(ratesMd, /length_m: 9/);
  assert.match(ratesMd, /cultural_chf: 20/);
  assert.match(ratesMd, /regular_chf: 35/);
  assert.match(ratesMd, /cultural_chf: 900/);
  assert.match(ratesMd, /regular_chf: 1400/);
  assert.match(ratesMd, /Cultural rate/);
  assert.match(ratesMd, /Regular rate/);

  for (const file of listAstroAndTs()) {
    const text = read(file);
    assert.doesNotMatch(text, /cultural_chf:\s*20|regular_chf:\s*1400/);
    assert.doesNotMatch(text, /Half day \(4 hours\)/);
  }
});

test('financial support is Markdown-driven with authorised QR assets', () => {
  const supportMd = read('src/content/support/financial-support.md');
  assert.match(supportMd, /twint:/);
  assert.match(supportMd, /stripe:/);
  assert.match(supportMd, /enabled: true/);
  assert.match(supportMd, /\/imgs\/contact-twint\.png/);
  assert.match(supportMd, /\/imgs\/stripe\.png/);
  assert.match(supportMd, /https:\/\/buy\.stripe\.com\/4gMfZg6gLchX71P2wRcwg01/);
  assert.match(supportMd, /Make a contribution/);
  assert.match(supportMd, /not presented as tax-deductible/);
  assert.match(supportMd, /personal-contact QR code/);

  for (const path of authorisedFunctionalMedia) {
    assert.equal(statSync(join(root, path)).isFile(), true, path);
  }

  const component = read('src/components/support/FinancialSupport.astro');
  assert.match(component, /requireSupportDoc\('financial-support'\)/);
  assert.match(component, /twint\.enabled/);
  assert.match(component, /stripe\.enabled/);
  assert.doesNotMatch(component, /buy\.stripe\.com/);
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
    'src/content/pages/home.md',
    'src/content/pages/atelier.md',
    'src/pages/atelier/index.astro',
    'src/pages/research/index.astro',
    'src/pages/index.astro',
  ]) {
    const text = read(path);
    assert.doesNotMatch(text, /seven interconnected|seven stations|Electronics Bench & Wearables Lab|(?<!Craft )Office(?! of)/i);
  }
  const publicBundle = [
    read('src/content/pages/home.md'),
    read('src/content/pages/atelier.md'),
    read('src/data/feeds/workstations.json'),
  ].join('\n');
  for (const title of workstationTitles) {
    assert.match(publicBundle, new RegExp(title));
  }
});

test('The School page is Markdown-backed and links to the founder site', () => {
  const aboutMd = read('src/content/pages/about.md');
  const aboutPage = read('src/pages/about/index.astro');
  assert.match(aboutMd, /September 2025/);
  assert.match(aboutMd, /Wetzikon/);
  assert.match(aboutMd, /tool, a medium, a material or a subject/);
  assert.match(aboutMd, /https:\/\/www\.linalopes\.info\//);
  assert.match(aboutPage, /requirePage\('about'\)/);
  assert.match(aboutPage, /EditorialLayout/);
  assert.match(aboutMd, /portrait_src: \/imgs\/lina\.jpg/);
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
    'public/imgs/contact-twint.png',
    'public/imgs/stripe.png',
    'public/imgs/space/biolab.webp',
    'public/history/space3d.html',
  ]) {
    assert.equal(statSync(join(root, path)).isFile(), true, path);
  }
  assert.equal(read('public/CNAME').trim(), 'schoolai.linalopes.info');
});

test('no unauthorised editorial media was added outside preserved and functional paths', () => {
  const allowedPrefixes = ['public/imgs/', 'public/history/'];
  const allowedExact = new Set(authorisedFunctionalMedia);
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
      if (allowedExact.has(rel)) continue;
      if (allowedPrefixes.some((prefix) => rel.startsWith(prefix))) continue;
      unexpected.push(rel);
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

test('README includes the editorial administration guide', () => {
  const readme = read('README.md');
  assert.match(readme, /## How to update website content/);
  assert.match(readme, /src\/content\/pages\//);
  assert.match(readme, /src\/content\/gallery\/rental-rates\.md/);
  assert.match(readme, /src\/content\/support\/financial-support\.md/);
  assert.match(readme, /1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/);
  assert.match(readme, /gid=1398027263/);
  assert.match(readme, /gid=20271126/);
  assert.match(readme, /gid=20271127/);
  assert.match(readme, /refresh once in the browser|Requires a new \*\*build and deployment\*\*/i);
  assert.match(readme, /Deploy production site|deploy\.yml/);
  assert.match(readme, /legacy-html-2026/);
  assert.match(readme, /v1\.0\.0-legacy/);
  assert.match(readme, /GitHub Actions/);
});

test('production workflows deploy only from main and keep validation separate', () => {
  const deploy = read('.github/workflows/deploy.yml');
  const validate = read('.github/workflows/validate.yml');
  const refresh = read('.github/workflows/refresh-snapshots.yml');
  assert.match(deploy, /branches:\s*\n\s*-\s*main/);
  assert.match(deploy, /workflow_dispatch/);
  assert.match(deploy, /github\.ref == 'refs\/heads\/main'/);
  assert.match(deploy, /actions\/upload-pages-artifact@v3/);
  assert.match(deploy, /actions\/deploy-pages@v4/);
  assert.match(deploy, /github-pages/);
  assert.match(deploy, /npm run build/);
  assert.match(deploy, /npm run test:dist/);
  assert.doesNotMatch(deploy, /website-2027/);
  assert.match(validate, /website-2027/);
  assert.match(validate, /main/);
  assert.doesNotMatch(validate, /deploy-pages|upload-pages-artifact/);
  assert.match(refresh, /workflow_dispatch/);
  assert.match(refresh, /cron:\s*'0 6 \* \* \*'/);
  assert.match(refresh, /github\.ref == 'refs\/heads\/main'/);
  assert.match(refresh, /npm run refresh-feeds/);
  assert.match(refresh, /actions:\s*write/);
  assert.match(refresh, /createWorkflowDispatch/);
  assert.match(refresh, /deploy\.yml/);
  assert.match(refresh, /github-actions\[bot\]/);
  assert.match(read('docs/production-release.md'), /legacy-html-2026/);
  assert.match(read('docs/production-release.md'), /Deploy from a branch/);
  assert.match(read('docs/production-release.md'), /does \*\*not\*\* restore/);
});

test('archive snapshot includes Drawing Machines and Maze Circuit image URLs', () => {
  const archive = JSON.parse(read('src/data/feeds/archive.json'));
  const drawing = archive.items.find((item) => item.id === 'drawing-machines');
  const maze = archive.items.find((item) => item.id === 'maze-circuit');
  assert.equal(Boolean(drawing?.imageUrl), true);
  assert.equal(Boolean(maze?.imageUrl), true);
  assert.match(drawing.imageUrl, /^https:\/\//);
  assert.match(maze.imageUrl, /^https:\/\//);
});
