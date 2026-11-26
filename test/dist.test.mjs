import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('..', import.meta.url));

function dist(path) {
  return join(root, 'dist', path);
}

test('production build keeps seven routes, Markdown-driven copy, payments and rental rates', () => {
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
  assert.doesNotMatch(html, /later phase|planned route|Phase 3/i);
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

  const atelier = readFileSync(dist('atelier/index.html'), 'utf8');
  assert.match(atelier, /The Atelier/);
  assert.match(atelier, /data-feed="workstations"/);
  assert.match(atelier, /BioLab/);
  assert.match(atelier, /Craft Office/);
  assert.match(atelier, /space3d\.html/);
  assert.match(atelier, /Arrange a visit/);
  assert.match(atelier, /not available for rental/);

  const programme = readFileSync(dist('programme/index.html'), 'utf8');
  assert.match(programme, /Open Research Studio/);
  assert.match(programme, /Upcoming events/);
  assert.match(programme, /Past events/);
  assert.match(programme, /Arduino Day|Paper as Interface/);
  assert.doesNotMatch(programme, /#workshop-augmented-cinema/);
  assert.doesNotMatch(programme, /Singing to a Garden/);
  assert.match(programme, /formspree\.io\/f\/mvgbznoe/);

  const gallery = readFileSync(dist('inverted-gallery/index.html'), 'utf8');
  assert.match(gallery, /Inverted Gallery/);
  assert.match(gallery, /Space rental/);
  assert.match(gallery, /Cultural rate/);
  assert.match(gallery, /Regular rate/);
  assert.match(gallery, /63/);
  assert.match(gallery, /rental-table/);
  assert.match(gallery, />20</);
  assert.match(gallery, /1(?:'|’|&#39;)400/);
  assert.match(gallery, /Only Inverted Gallery is available for rental/);
  assert.match(gallery, /mailto:lilothink\.science@gmail\.com/);
  assert.match(gallery, /class="gallery-figure"/);
  assert.match(gallery, /inverted-gallery-1\.jpg/);
  assert.match(gallery, /inverted-gallery-2\.jpg/);
  assert.match(gallery, /og:image/);
  assert.doesNotMatch(gallery, /booking calendar/i);

  const collaborate = readFileSync(dist('collaborate/index.html'), 'utf8');
  assert.match(collaborate, /Research grows through exchange/);
  assert.match(collaborate, /Research Collaboration/);
  assert.match(collaborate, /Financial Support/);
  assert.match(collaborate, /id="financial-support"/);
  assert.match(collaborate, /TWINT/);
  assert.match(collaborate, /Stripe/);
  assert.match(collaborate, /\/imgs\/contact-twint\.png/);
  assert.match(collaborate, /\/imgs\/stripe\.png/);
  assert.match(collaborate, /https:\/\/buy\.stripe\.com\/4gMfZg6gLchX71P2wRcwg01/);
  assert.match(collaborate, /Make a contribution/);
  assert.match(collaborate, /not presented as tax-deductible/);
  assert.doesNotMatch(collaborate, /wishlist|Made possible by/i);

  assert.equal(statSync(dist('imgs/contact-twint.png')).isFile(), true);
  assert.equal(statSync(dist('imgs/stripe.png')).isFile(), true);
  assert.equal(statSync(dist('robots.txt')).isFile(), true);
  assert.equal(statSync(dist('sitemap.xml')).isFile(), true);
  assert.match(readFileSync(dist('robots.txt'), 'utf8'), /Sitemap: https:\/\/schoolai\.linalopes\.info\/sitemap\.xml/);
  assert.match(readFileSync(dist('sitemap.xml'), 'utf8'), /https:\/\/schoolai\.linalopes\.info\/inverted-gallery\//);
  assert.match(readFileSync(dist('404.html'), 'utf8'), /Page not found/);
  assert.match(html, /og:title/);
  assert.match(html, /canonical/);

  for (const path of [
    'space3d.html',
    'room-for-interaction.html',
    'arduino-day-2026.html',
    'peppers-ghost.html',
    'CNAME',
  ]) {
    assert.equal(statSync(dist(path)).isFile(), true, path);
  }
  assert.equal(existsSync(dist('collaborate/wishlist/index.html')), false);
  assert.equal(existsSync(dist('collaborate/contributors/index.html')), false);
});
