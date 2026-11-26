import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('..', import.meta.url));

function dist(path) {
  return join(root, 'dist', path);
}

test('production build keeps seven institutional routes, anchors and legacy URLs', () => {
  const html = readFileSync(dist('index.html'), 'utf8');
  assert.match(html, /Strange questions/);
  assert.match(html, /independent atelier for experimental research/);
  assert.match(html, /id="hero-carousel"/);
  assert.match(html, /hero-carousel-pause|Pause/);
  assert.match(html, /Your Hand Is the Prompt/);
  assert.match(html, /id="school"/);
  assert.match(html, /id="research"/);
  assert.match(html, /Artificial Emotion/);
  assert.match(html, /id="selected-research"/);
  assert.match(html, /data-feed="archive"/);
  assert.match(html, /Explore the Research Archive/);
  assert.match(html, /Affective Atmosphere 2046|Mr\. Sonnet|Claw-Pilot/);
  assert.match(html, /id="atelier"/);
  assert.match(html, /href="\/atelier\/"/);
  assert.match(html, /id="programme"/);
  assert.match(html, /href="\/programme\/"/);
  assert.match(html, /id="gallery"/);
  assert.match(html, /Inverted Gallery/);
  assert.match(html, /href="\/inverted-gallery\/"/);
  assert.match(html, /id="collaborate"/);
  assert.match(html, /href="\/collaborate\/"/);
  assert.match(html, /No public events are scheduled right now/);
  assert.match(html, /https:\/\/formspree.io\/f\/mvgbznoe/);
  assert.match(html, /\/space3d\.html/);
  assert.match(html, /#22113E/i);
  assert.match(html, /href="\/about\/"/);
  assert.match(html, /href="\/research\/"/);
  assert.doesNotMatch(html, /stripe|twint/i);
  assert.doesNotMatch(html, /seven interconnected|later phase|planned route|Phase 3/i);
  assert.doesNotMatch(html, /wishlist|Made possible by/i);

  const about = readFileSync(dist('about/index.html'), 'utf8');
  assert.match(about, /The School/);
  assert.match(about, /September 2025/);
  assert.match(about, /https:\/\/www\.linalopes\.info\//);

  const research = readFileSync(dist('research/index.html'), 'utf8');
  assert.match(research, /Artificial Emotion/);
  assert.match(research, /Kinetic Studies/);
  assert.match(research, /Soft Mechanisms/);
  assert.match(research, /Bio-signals/);
  assert.match(research, /emotion\.linalopes\.info/);
  assert.match(research, /data-feed="archive"/);
  assert.match(research, /Explore the Research Archive/);
  assert.match(research, /Open research and open source/);
  assert.doesNotMatch(research, /PhD|phase 3|planned route/i);

  const atelier = readFileSync(dist('atelier/index.html'), 'utf8');
  assert.match(atelier, /The Atelier/);
  assert.match(atelier, /data-feed="workstations"/);
  assert.match(atelier, /BioLab/);
  assert.match(atelier, /Electronics Bench/);
  assert.match(atelier, /Wearables Lab/);
  assert.match(atelier, /Craft Office/);
  assert.match(atelier, /Saloon/);
  assert.match(atelier, /space3d\.html/);
  assert.match(atelier, /Arrange a visit/);
  assert.match(atelier, /not available for rental/);
  assert.doesNotMatch(atelier, /seven workstation|phase 3|planned route|one-to-one correspondence/i);

  const programme = readFileSync(dist('programme/index.html'), 'utf8');
  assert.match(programme, /Open Research Studio/);
  assert.match(programme, /Research-based workshops/);
  assert.match(programme, /Upcoming events/);
  assert.match(programme, /Past events/);
  assert.match(programme, /Arduino Day|Paper as Interface/);
  assert.match(programme, /Women Making with AI/);
  assert.match(programme, /arduino-day-2026\.html/);
  assert.doesNotMatch(programme, /#workshop-augmented-cinema/);
  assert.doesNotMatch(programme, /Singing to a Garden/);
  assert.match(programme, /formspree\.io\/f\/mvgbznoe/);
  assert.match(programme, /room-for-interaction\.html/);
  assert.doesNotMatch(programme, /stripe|twint|phase 3|planned route/i);

  const gallery = readFileSync(dist('inverted-gallery/index.html'), 'utf8');
  assert.match(gallery, /Inverted Gallery/);
  assert.match(gallery, /Space rental/);
  assert.match(gallery, /Cultural use/);
  assert.match(gallery, /Commercial use/);
  assert.match(gallery, /Curatorial collaboration/);
  assert.match(gallery, /Only Inverted Gallery is available for rental/);
  assert.match(gallery, /mailto:lilothink\.science@gmail\.com/);
  assert.doesNotMatch(gallery, /class="gallery-figure"|placeholder image|CHF|booking calendar/i);
  assert.doesNotMatch(gallery, /workstations are not rental spaces[\s\S]{0,40}atelier[\s\S]{0,40}for rental/i);

  const collaborate = readFileSync(dist('collaborate/index.html'), 'utf8');
  assert.match(collaborate, /Research grows through exchange/);
  assert.match(collaborate, /Research Collaboration/);
  assert.match(collaborate, /Student Research/);
  assert.match(collaborate, /Technology Partnerships/);
  assert.match(collaborate, /Commissioned Research/);
  assert.match(collaborate, /Hands-on Contributions/);
  assert.match(collaborate, /Financial Support/);
  assert.match(collaborate, /mailto:lilothink\.science@gmail\.com/);
  assert.doesNotMatch(collaborate, /stripe|twint|IBAN|payment link|wishlist|Made possible by/i);

  for (const path of [
    'space3d.html',
    'room-for-interaction.html',
    'room-for-interaction.json',
    'arduino-day-2026.html',
    'peppers-ghost.html',
    'imgs/space/entrance.gif',
    'imgs/sota-horizontal-bg-transparent-dark.svg',
    'history/space3d.html',
    'CNAME',
  ]) {
    assert.equal(statSync(dist(path)).isFile(), true, path);
  }
  assert.equal(readFileSync(dist('CNAME'), 'utf8').trim(), 'schoolai.linalopes.info');
  assert.equal(existsSync(dist('collaborate/wishlist/index.html')), false);
  assert.equal(existsSync(dist('collaborate/contributors/index.html')), false);
});
