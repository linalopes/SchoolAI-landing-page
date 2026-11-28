import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  loadArchiveSnapshot,
  loadContributorsSnapshot,
  loadEventsSnapshot,
  loadHeroSnapshot,
  loadWishlistSnapshot,
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
  assert.match(indexPage, /Publications/);
  assert.match(indexPage, /Gallery/);
  const homeOrder = ['Programme', 'Publications', 'Gallery', 'Collaborate'].map((token) =>
    indexPage.indexOf(token),
  );
  assert.ok(homeOrder.every((idx) => idx > -1));
  assert.deepEqual(homeOrder, [...homeOrder].sort((a, b) => a - b));
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

test('navigation promotes institutional routes while keeping homepage anchors', () => {
  const nav = read('src/data/navigation.ts');
  const view = read('src/components/navigation/SiteNav.astro');
  const footer = read('src/components/navigation/SiteFooter.astro');
  const homeMd = read('src/content/pages/home.md');
  const researchHome = read('src/components/home/ArtificialEmotion.astro');
  const atelierHome = read('src/components/home/Atelier.astro');
  const programmeHome = read('src/components/home/Programme.astro');
  const publicationsHome = read('src/components/home/Publications.astro');
  const galleryHome = read('src/components/home/Gallery.astro');
  const collaborateHome = read('src/components/home/Collaborate.astro');
  for (const label of [
    'About',
    'Research',
    'Atelier',
    'Programme',
    'Publications',
    'Inverted Gallery',
  ]) {
    assert.match(nav, new RegExp(`label: '${label}'`));
  }
  assert.match(nav, /collaborateHref = '\/collaborate\/'/);
  assert.match(nav, /collaborateLabel = 'Collaborate'/);
  assert.match(nav, /footerNavItems/);
  assert.doesNotMatch(nav.slice(0, nav.indexOf('export const footerNavItems')), /label: 'Collaborate'/);
  assert.match(nav, /href: '\/about\/'/);
  assert.match(nav, /href: '\/research\/'/);
  assert.match(nav, /href: '\/atelier\/'/);
  assert.match(nav, /href: '\/programme\/'/);
  assert.match(nav, /href: '\/publications\/'/);
  assert.match(nav, /href: '\/inverted-gallery\/'/);
  assert.match(nav, /wishlistHref = '\/collaborate\/wishlist\/'/);
  const navItemsBlock = nav.slice(nav.indexOf('export const navItems'), nav.indexOf('export const homeHref'));
  assert.doesNotMatch(navItemsBlock, /wishlist/i);
  assert.doesNotMatch(navItemsBlock, /peppers-ghost/i);
  assert.doesNotMatch(nav, /\/collaborate\/contributors\//);
  const navOrder = [
    "href: '/about/'",
    "href: '/research/'",
    "href: '/atelier/'",
    "href: '/programme/'",
    "href: '/publications/'",
    "href: '/inverted-gallery/'",
  ].map((token) => navItemsBlock.indexOf(token));
  assert.ok(navOrder.every((idx) => idx > -1));
  assert.deepEqual(navOrder, [...navOrder].sort((a, b) => a - b));
  assert.match(read('src/content/pages/collaborate.md'), /Made possible by/);
  assert.match(read('src/content/pages/collaborate.md'), /Research Wishlist/);
  assert.match(read('src/content/pages/wishlist.md'), /Help make things possible/);
  assert.match(read('src/pages/collaborate/index.astro'), /Contributors/);
  assert.match(read('src/pages/collaborate/index.astro'), /WishlistTeaser/);
  assert.match(read('src/pages/collaborate/wishlist/index.astro'), /WishlistDirectory/);
  assert.match(researchHome, /id="research"/);
  assert.match(atelierHome, /id="atelier"/);
  assert.match(programmeHome, /id="programme"/);
  assert.match(publicationsHome, /id="publications"/);
  assert.match(galleryHome, /id="gallery"/);
  assert.match(collaborateHome, /id="collaborate"/);
  assert.match(homeMd, /href: \/programme\//);
  assert.match(homeMd, /href: \/publications\//);
  assert.match(homeMd, /href: \/inverted-gallery\//);
  assert.match(homeMd, /href: \/collaborate\//);
  assert.match(homeMd, /href: \/research\//);
  assert.match(homeMd, /number: "06"/);
  assert.match(homeMd, /number: "07"/);
  assert.match(homeMd, /number: "08"/);
  assert.match(footer, /footerNavItems/);
  assert.match(view, /navItems/);
  assert.match(view, /nav-cta/);
  assert.match(view, /nav-mobile-cta/);
  assert.match(view, /id="nav-hamburger"/);
  assert.match(view, /class="button button--on-dark nav-cta"/);
  assert.doesNotMatch(view, /nav-links[\s\S]*Collaborate[\s\S]*nav-hamburger/);
});

test('institutional editorial content is sourced from Markdown', () => {
  for (const name of [
    'home.md',
    'about.md',
    'research.md',
    'atelier.md',
    'programme.md',
    'publications.md',
    'inverted-gallery.md',
    'collaborate.md',
  ]) {
    assert.equal(statSync(join(root, 'src/content/pages', name)).isFile(), true, name);
  }
  assert.equal(statSync(join(root, 'src/content/publications/peppers-ghost.md')).isFile(), true);
  assert.equal(statSync(join(root, 'src/content/publications/paper-as-interface.md')).isFile(), true);
  assert.equal(statSync(join(root, 'src/content/publications/draft-reserved.md')).isFile(), true);
  assert.equal(statSync(join(root, 'src/content/gallery/rental-rates.md')).isFile(), true);
  assert.equal(statSync(join(root, 'src/content/support/financial-support.md')).isFile(), true);
  assert.equal(statSync(join(root, 'src/content/site/footer.md')).isFile(), true);
  assert.equal(statSync(join(root, 'src/content/site/location.md')).isFile(), true);

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
  assert.match(collaborateMd, /Made possible by/);
  assert.match(collaborateMd, /Let's start a conversation/);
  assert.doesNotMatch(collaborateMd, /formal employment|residency programmes|internships/);
  const footerMd = read('src/content/site/footer.md');
  const locationMd = read('src/content/site/location.md');
  assert.match(locationMd, /Schönaustrasse 13/);
  assert.match(locationMd, /8620 Wetzikon, Switzerland/);
  assert.match(locationMd, /maps\.google\.com/);
  assert.match(locationMd, /Wetzikon-Zürich/);
  assert.match(footerMd, /Get directions/);
  assert.match(footerMd, /Explore/);
  assert.match(footerMd, /Elsewhere/);
  assert.match(footerMd, /Research Blog/);
  assert.match(footerMd, /github\.com\/linalopes/);
  assert.doesNotMatch(footerMd, /Schönaustrasse 13/);
  assert.doesNotMatch(footerMd, /lilothink\.science@gmail\.com/);
  assert.doesNotMatch(read('src/content/pages/home.md'), /maps_url:/);
  assert.doesNotMatch(read('src/content/pages/atelier.md'), /maps_url:/);

  const researchPage = read('src/pages/research/index.astro');
  const atelierPage = read('src/pages/atelier/index.astro');
  const programmePage = read('src/pages/programme/index.astro');
  const programmeMd = read('src/content/pages/programme.md');
  const galleryPage = read('src/pages/inverted-gallery/index.astro');
  const collaboratePage = read('src/pages/collaborate/index.astro');
  assert.match(researchPage, /requirePage\('research'\)/);
  assert.match(atelierPage, /requirePage\('atelier'\)/);
  assert.match(programmePage, /requirePage\('programme'\)/);
  assert.match(programmeMd, /current:/);
  assert.match(programmeMd, /January – June 2027/);
  assert.match(programmeMd, /Artificial Emotion/);
  assert.match(programmeMd, /past_programmes:/);
  assert.match(programmeMd, /Room for Interaction/);
  assert.match(programmeMd, /href: \/room-for-interaction\.html/);
  assert.match(programmePage, /id="current-programme"/);
  assert.match(programmePage, /id="past-programmes"/);
  const programmeOrder = [
    'id="current-programme"',
    'upcoming-events-heading',
    'activity-formats-heading',
    'id="past-programmes"',
    'past-events-heading',
  ].map((token) => programmePage.indexOf(token));
  assert.ok(programmeOrder.every((idx) => idx > -1));
  assert.deepEqual(programmeOrder, [...programmeOrder].sort((a, b) => a - b));
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
    'public/CNAME',
    'public/imgs/favicon.svg',
    'public/imgs/lina.jpg',
    'public/imgs/contact-twint.png',
    'public/imgs/stripe.png',
    'public/imgs/pepper_ghost_pyramid_template_6cm.svg',
    'public/imgs/space/biolab.webp',
    'public/history/space3d.html',
  ]) {
    assert.equal(statSync(join(root, path)).isFile(), true, path);
  }
  assert.equal(read('public/CNAME').trim(), 'schoolai.linalopes.info');
  assert.equal(existsSync(join(root, 'public/arduino-day-2026.html')), false);
  assert.equal(existsSync(join(root, 'public/room-for-interaction.html')), false);
  assert.equal(existsSync(join(root, 'public/room-for-interaction.json')), false);
  assert.equal(existsSync(join(root, 'public/peppers-ghost.html')), false);
  assert.equal(statSync(join(root, 'src/pages/arduino-day-2026.astro')).isFile(), true);
  assert.equal(statSync(join(root, 'src/content/pages/arduino-day-2026.md')).isFile(), true);
  assert.equal(statSync(join(root, 'src/pages/room-for-interaction.astro')).isFile(), true);
  assert.equal(statSync(join(root, 'src/pages/room-for-interaction.json.ts')).isFile(), true);
  assert.equal(statSync(join(root, 'src/content/pages/room-for-interaction.md')).isFile(), true);
  assert.equal(statSync(join(root, 'src/pages/peppers-ghost.astro')).isFile(), true);
  assert.equal(statSync(join(root, 'src/content/pages/peppers-ghost.md')).isFile(), true);
  assert.equal(statSync(join(root, 'src/scripts/peppers-ghost.ts')).isFile(), true);
  assert.equal(statSync(join(root, 'src/components/experiments/PeppersGhostPage.astro')).isFile(), true);
  assert.match(read('scripts/flatten-html-routes.mjs'), /arduino-day-2026/);
  assert.match(read('scripts/flatten-html-routes.mjs'), /room-for-interaction/);
  assert.match(read('scripts/flatten-html-routes.mjs'), /peppers-ghost/);
  assert.match(read('package.json'), /flatten-html-routes/);
});

test('publications collection is Markdown-driven without a Sheets feed', () => {
  const pageMd = read('src/content/pages/publications.md');
  const page = read('src/pages/publications/index.astro');
  const helpers = read('src/lib/content.ts');
  const config = read('src/content.config.ts');
  const css = read('src/styles/global.css');
  const peppers = read('src/content/publications/peppers-ghost.md');
  const paper = read('src/content/publications/paper-as-interface.md');
  const draft = read('src/content/publications/draft-reserved.md');
  assert.match(pageMd, /Knowledge in different forms/);
  assert.match(pageMd, /Knowledge does not always take the form of a text/);
  assert.match(page, /getPublishedPublications/);
  assert.match(page, /canonicalPath="\/publications\/"/);
  assert.match(helpers, /getPublishedPublications/);
  assert.match(helpers, /publicationCoverUrl/);
  assert.match(config, /publications/);
  assert.match(peppers, /primary_url: \/peppers-ghost\.html/);
  assert.match(peppers, /Explore the experiment/);
  assert.match(peppers, /published: true/);
  assert.match(paper, /school-ai-paper-as-interface\.vercel\.app/);
  assert.match(paper, /github\.com\/linalopes\/SchoolAI-paper-as-interface/);
  assert.match(paper, /related_activity_url: \/arduino-day-2026\.html/);
  assert.match(paper, /Explore the board/);
  assert.match(draft, /published: false/);
  assert.doesNotMatch(config, /gid=.*publications/i);
  assert.doesNotMatch(page, /loadEventsSnapshot|refresh-feeds|sheets/i);
  const twoCol = css.indexOf('.publications-grid {\n    display: grid;\n    grid-template-columns: repeat(2');
  const oneColOverride = css.indexOf(
    '@media (max-width: 900px) {\n    .publications-grid {\n      grid-template-columns: 1fr;',
  );
  assert.ok(twoCol > -1, 'base two-column publications grid');
  assert.ok(oneColOverride > twoCol, 'mobile single-column override must follow the base grid');
  assert.match(css, /\.publication-meta\s*\{[^}]*color:\s*var\(--color-link\)/s);
  assert.doesNotMatch(css, /\.publication-cover-fallback\s*\{[^}]*linear-gradient/s);
  assert.match(css, /@media \(max-width: 1279px\)/);
});

test('Arduino Day 2026 editorial content is Markdown-backed', () => {
  const md = read('src/content/pages/arduino-day-2026.md');
  assert.match(md, /Paper as Interface/);
  assert.match(md, /arduino_day:/);
  assert.match(md, /related_publication:/);
  assert.match(md, /school-ai-paper-as-interface\.vercel\.app/);
  assert.match(md, /href: "\/publications\/"/);
  assert.match(md, /28 March 2026/);
  assert.match(md, /twitch\.tv\/lina_lopes/);
  assert.match(md, /#timeline/);
  assert.match(md, /#details/);
  assert.match(md, /#faq/);
  assert.doesNotMatch(md, /retrospective|documentation of the outcome/i);
  assert.match(read('src/components/programme/ArduinoDayPage.astro'), /arduino-day/);
  assert.match(read('src/components/programme/ArduinoDayPage.astro'), /related-publication/);
});

test('Arduino Day hero keeps #hero fragment while isolating homepage #hero CSS', () => {
  const page = read('src/components/programme/ArduinoDayPage.astro');
  const css = read('src/styles/global.css');
  assert.match(page, /id="hero"/);
  assert.match(page, /class="ad-hero"/);
  assert.match(page, /\.arduino-day #hero\.ad-hero/);
  assert.match(css, /#hero:not\(\.ad-hero\):not\(\.rfi-hero\)/);
  assert.doesNotMatch(css, /(?:^|\n)\s*#hero\s*\{/);
  assert.match(read('src/components/home/Hero.astro'), /id="hero"/);
  assert.doesNotMatch(read('src/components/home/Hero.astro'), /ad-hero/);
});

test("Pepper's Ghost is Markdown-backed with preserved experiment contracts", () => {
  const md = read('src/content/pages/peppers-ghost.md');
  const page = read('src/components/experiments/PeppersGhostPage.astro');
  const script = read('src/scripts/peppers-ghost.ts');
  const route = read('src/pages/peppers-ghost.astro');
  const baseLayout = read('src/layouts/BaseLayout.astro');
  const editorialLayout = read('src/layouts/EditorialLayout.astro');
  assert.match(md, /peppers_ghost:/);
  assert.match(md, /Open studio experiment/);
  assert.match(md, /Make your own ghost/);
  assert.match(md, /John Henry Pepper/);
  assert.match(md, /Henry Dircks/);
  assert.match(md, /pepper_ghost_pyramid_template_6cm\.svg/);
  for (const id of ['orb', 'creature', 'particles', 'text']) {
    assert.match(md, new RegExp(`id: ${id}`));
    assert.match(script, new RegExp(`${id}:`));
  }
  for (const anchor of ['#studio', '#use', '#template', '#calibrate', '#how', '#history']) {
    assert.match(page, new RegExp(`id="${anchor.slice(1)}"`));
  }
  assert.match(page, /sandbox|startPeppersGhost/);
  assert.match(page, /\.peppers-ghost section\s*\{[^}]*padding:\s*0/s);
  assert.match(page, /body:has\(\.peppers-ghost\):not\(\.ghost-mode\) #nav/);
  assert.match(page, /body:has\(\.peppers-ghost\):not\(\.ghost-mode\) footer/);
  assert.match(page, /body:has\(\.peppers-ghost\) \.editorial-main/);
  assert.match(page, /safe-area-inset-top/);
  assert.match(page, /safe-area-inset-bottom/);
  assert.match(
    page,
    /#ghost-stage\s*\{[^}]*padding:\s*0|body\.ghost-mode[\s\S]*?#ghost-stage\s*\{[^}]*padding:\s*0/s,
  );
  assert.doesNotMatch(
    page,
    /body\.ghost-mode[\s\S]*?#ghost-stage\s*\{[^}]*padding:[^;]*safe-area-inset/s,
  );
  assert.match(script, /sandbox', 'allow-scripts'|sandbox", "allow-scripts"/);
  assert.doesNotMatch(script, /allow-same-origin/);
  assert.match(script, /peppers-ghost-code/);
  assert.match(script, /peppers-ghost-example/);
  assert.match(script, /peppers-ghost-scale-v2/);
  assert.match(script, /peppers-ghost-distance-v2/);
  assert.match(script, /p5@1\.11\.3/);
  assert.match(script, /scale: 0\.85/);
  assert.match(script, /imageDistance: 0\.35/);
  assert.match(script, /runGeneration|cancelActiveRun|abortActiveRun/);
  assert.match(script, /took too long to start/);
  assert.doesNotMatch(
    script,
    /keepPreviousOnError && currentIframe\) \{\s*finishFail[\s\S]*?\} else \{\s*finishOk/,
  );
  assert.match(script, /isGhostFrameMessage/);
  assert.match(script, /settleFullscreenCall/);
  assert.match(route, /canonicalPath="\/peppers-ghost\.html"/);
  assert.match(route, /viewportFitCover=\{true\}/);
  assert.match(editorialLayout, /viewportFitCover/);
  assert.match(baseLayout, /viewport-fit=cover/);
  assert.match(baseLayout, /viewportFitCover/);
  assert.match(page, /SiteNav|EditorialLayout|peppers-ghost/);
  assert.match(page, /data-peppers-ghost/);
});

test('Room for Interaction is Markdown-backed, archived, and hero-isolated', () => {
  const md = read('src/content/pages/room-for-interaction.md');
  const page = read('src/components/programme/RoomForInteractionPage.astro');
  const css = read('src/styles/global.css');
  const workshops = [
    'Augmented Cinema',
    'Maze Circuit',
    'Singing to a Garden',
    'Marble Machine Orchestra',
    'From Gesture to Pen',
    'Room as Instrument',
    'Embroidering Light',
  ];
  for (const title of workshops) {
    assert.match(md, new RegExp(title));
  }
  assert.match(md, /status: completed/);
  assert.match(md, /28–29 August 2026|28-29 August 2026/);
  assert.match(md, /status: cancelled/);
  assert.match(md, /status_label: "Proposal"/);
  assert.match(md, /Glitch Lab/);
  assert.match(md, /Archived programme/);
  assert.match(md, /icon: "zap"/);
  assert.match(md, /historical_luma_embed_url:/);
  assert.doesNotMatch(md, /Events snapshot|Events feed/i);
  assert.doesNotMatch(md, /Cancelled proposal/);
  assert.doesNotMatch(md, /Next workshop/i);
  assert.doesNotMatch(md, /View registration page/i);
  assert.doesNotMatch(page, /Next workshop/i);
  assert.doesNotMatch(page, /View registration page|luma\.com/i);
  assert.match(page, /id="hero"/);
  assert.match(page, /class="rfi-hero"/);
  assert.match(page, /id={`workshop-\$\{workshop\.id\}`}|id="workshop-/);
  assert.match(page, /#workshop-/);
  assert.match(page, /id="cta"/);
  assert.doesNotMatch(page, /id="contact"/);
  assert.match(css, /#hero:not\(\.ad-hero\):not\(\.rfi-hero\)/);
  assert.match(page, /\.room-for-interaction #hero\.rfi-hero/);
  assert.match(read('src/pages/room-for-interaction.astro'), /canonicalPath="\/room-for-interaction\.html"/);
  assert.match(md, /id: maze-circuit/);
  assert.doesNotMatch(md, /May 23, 2026/);
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

test('offline build can read all six committed snapshots without Google', () => {
  const hero = loadHeroSnapshot();
  const events = loadEventsSnapshot();
  const archive = loadArchiveSnapshot();
  const workstations = loadWorkstationsSnapshot();
  const contributors = loadContributorsSnapshot();
  const wishlist = loadWishlistSnapshot();
  assert.equal(hero.items.length > 0, true);
  assert.equal(selectUpcomingEvents(events.items).length, 0);
  assert.equal(archive.items.length, 6);
  assert.equal(workstations.items.length, 8);
  assert.deepEqual(workstations.items.map((item) => item.title), [...workstationTitles]);
  assert.equal(contributors.items.length, 7);
  assert.equal(contributors.items.every((item) => item.published), true);
  assert.equal(wishlist.items.length, 11);
  assert.equal(wishlist.items.every((item) => item.published), true);
  assert.match(read('docs/technical/feed-resilience.md'), /last-known-good/i);
  assert.match(read('docs/technical/feed-resilience.md'), /csv\.ts/);
});

test('README includes the editorial administration guide', () => {
  const readme = read('README.md');
  assert.match(readme, /docs\/editorial\/content-management\.md/);
  assert.match(readme, /docs\/editorial\/google-sheets\.md/);
  assert.match(readme, /schoolai\.linalopes\.info/);
  assert.match(readme, /six Google Sheets|Google Sheets/);
  assert.match(readme, /legacy-html-2026/);
  assert.match(readme, /v1\.0\.0-legacy/);
  assert.match(readme, /v2\.0\.0/);
  assert.match(readme, /GitHub Actions/);
  assert.match(readme, /do \*\*not\*\* require a local `npm run refresh-feeds`/i);

  const guide = read('docs/editorial/content-management.md');
  assert.match(guide, /1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/);
  assert.match(guide, /gid=1398027263|Hero tab/);
  assert.match(guide, /gid=20271129|Wishlist tab/);
  assert.match(guide, /src\/content\/pages\/wishlist\.md/);
  assert.match(guide, /src\/content\/site\/footer\.md/);
  assert.match(guide, /src\/content\/site\/location\.md/);
  assert.match(guide, /06:00 UTC/);

  const sheets = read('docs/editorial/google-sheets.md');
  assert.match(sheets, /gid=20271126/);
  assert.match(sheets, /gid=20271127/);
  assert.match(sheets, /gid=20271128/);
  assert.match(sheets, /gid=20271129/);
  assert.match(sheets, /target_amount_chf/);
  assert.match(sheets, /not a confidentiality mechanism/i);
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
  assert.doesNotMatch(validate, /website-2027/);
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
  assert.match(read('docs/technical/deployment.md'), /legacy-html-2026/);
  assert.match(read('docs/technical/deployment.md'), /Deploy from a branch/);
  assert.match(read('docs/technical/deployment.md'), /does \*\*not\*\* restore/);
  assert.match(read('docs/technical/architecture.md'), /Astro/);
  assert.match(read('docs/technical/testing.md'), /npm test/);
  assert.match(read('docs/archive/README.md'), /Archival notice|historical/i);
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
