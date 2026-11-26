import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('..', import.meta.url));

function dist(path) {
  return join(root, 'dist', path);
}

test('production build keeps the homepage and legacy URLs', () => {
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
  assert.match(html, /Explore the Research Archive/);
  assert.match(html, /id="atelier"/);
  assert.match(html, /id="programme"/);
  assert.match(html, /id="gallery"/);
  assert.match(html, /Inverted Gallery/);
  assert.match(html, /id="collaborate"/);
  assert.match(html, /No public events are scheduled right now/);
  assert.match(html, /https:\/\/formspree.io\/f\/mvgbznoe/);
  assert.match(html, /\/space3d\.html/);
  assert.match(html, /#22113E/i);
  assert.match(html, /href="\/about\/"/);
  assert.doesNotMatch(html, /stripe|twint/i);
  assert.doesNotMatch(html, /data-feed="archive"/);
  assert.doesNotMatch(html, /Mr\. Sonnet|Claw-Pilot|Drawing Machines/);

  const about = readFileSync(dist('about/index.html'), 'utf8');
  assert.match(about, /The School/);
  assert.match(about, /September 2025/);
  assert.match(about, /https:\/\/www\.linalopes\.info\//);
  assert.match(about, /\/imgs\/lina\.jpg/);
  assert.match(about, /href="\/"/);

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
});
