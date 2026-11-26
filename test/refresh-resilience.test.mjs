import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import test from 'node:test';
import {
  FeedValidationError,
  createSnapshot,
  loadHeroSnapshot,
  parseHeroCsv,
  parseHeroSnapshot,
  readSnapshotFile,
  snapshotExists,
  writeSnapshotAtomic,
} from '../src/lib/sheets/index.ts';

test('invalid CSV does not replace a valid in-memory snapshot contract', () => {
  const original = readFileSync(new URL('../src/data/feeds/hero.json', import.meta.url), 'utf8');
  const parsed = parseHeroSnapshot(JSON.parse(original));
  assert.equal(parsed.items.length, 3);

  assert.throws(
    () => parseHeroCsv('wrong,headers\n1,2'),
    /headers do not match/i,
  );

  // Refresh keeps the previous file when validation fails before writeSnapshotAtomic.
  assert.equal(snapshotExists('hero'), true);
  assert.equal(JSON.parse(readSnapshotFile('hero')).items.length, 3);
});

test('atomic snapshot write round-trips and loadHeroSnapshot requires a file', () => {
  const original = readFileSync(new URL('../src/data/feeds/hero.json', import.meta.url), 'utf8');
  const parsed = parseHeroSnapshot(JSON.parse(original));
  writeSnapshotAtomic(createSnapshot('hero', parsed.sourceUrl, parsed.items, parsed.fetchedAt));
  const loaded = loadHeroSnapshot();
  assert.equal(loaded.items.length, parsed.items.length);
  writeFileSync(new URL('../src/data/feeds/hero.json', import.meta.url), original);

  assert.throws(
    () => parseHeroSnapshot({ feed: 'events', fetchedAt: new Date().toISOString(), sourceUrl: 'https://example.com', items: [] }),
    /feed id mismatch/i,
  );
  assert.throws(
    () => parseHeroSnapshot({ feed: 'hero', fetchedAt: 'not-a-date', sourceUrl: 'https://example.com', items: [] }),
    FeedValidationError,
  );
});

test('offline builds fail closed when a required snapshot body is missing items array', () => {
  assert.throws(
    () => parseHeroSnapshot({
      feed: 'hero',
      fetchedAt: new Date().toISOString(),
      sourceUrl: 'https://example.com',
      items: null,
    }),
    /items must be an array/i,
  );
});
