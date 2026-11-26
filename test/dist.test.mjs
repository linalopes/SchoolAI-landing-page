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
  assert.match(html, /id="hero-carousel"/);
  assert.match(html, /https:\/\/formspree.io\/f\/mvgbznoe/);
  assert.match(html, /space3d\.html/);
  assert.match(html, /#22113E/i);
  assert.doesNotMatch(html, /stripe|twint/i);

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
