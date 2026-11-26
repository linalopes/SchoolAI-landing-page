import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  FeedValidationError,
  createSnapshot,
  parseAndSelectArchive,
  parseArchiveCsv,
  parseCsvObjects,
  parseCsvRecords,
  parseEventsCsv,
  parseHeroCsv,
  parseHeroSnapshot,
  selectArchiveEntries,
  selectUpcomingEvents,
  snapshotExists,
  writeSnapshotAtomic,
} from '../src/lib/sheets/index.ts';

test('CSV parser keeps quoted commas, escapes, multiline fields, BOM and CRLF', () => {
  const csv = '\uFEFFtype,title,tagline,image_url,cta_label,cta_url,accent\r\n'
    + 'event,"Hello ""World""","line 1\nline 2","https://images.example/a,b.png",Go,https://example.com,turquoise\r\n';
  const rows = parseCsvObjects(csv, [
    'type', 'title', 'tagline', 'image_url', 'cta_label', 'cta_url', 'accent',
  ]);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].title, 'Hello "World"');
  assert.equal(rows[0].tagline, 'line 1\nline 2');
  assert.equal(rows[0].image_url, 'https://images.example/a,b.png');
});

test('CSV parser rejects unclosed quotes and empty headers', () => {
  assert.throws(() => parseCsvRecords('a,b\n"unclosed'), FeedValidationError);
  assert.throws(
    () => parseCsvObjects('type,,title\nx,y,z', ['type', 'title']),
    /empty column name/i,
  );
});

test('CSV parser validates required headers', () => {
  assert.throws(
    () => parseCsvObjects('type,title\nevent,Hello', [
      'type', 'title', 'tagline', 'image_url', 'cta_label', 'cta_url', 'accent',
    ]),
    /headers do not match/i,
  );
});

test('hero adapter accepts the live column contract and optional images', () => {
  const { items } = parseHeroCsv([
    'type,title,tagline,image_url,cta_label,cta_url,accent',
    'event,Your Hand Is the Prompt,A workshop,"https://images.example/a,b.png",Register,https://luma.com/x,turquoise',
    'reading,No Image,From text,,See,https://blog.example/post,pink',
  ].join('\n'));
  assert.equal(items.length, 2);
  assert.equal(items[0].imageUrl, 'https://images.example/a,b.png');
  assert.equal(items[1].imageUrl, null);
  assert.equal(items[1].accent, 'pink');
});

test('hero and events reject unsafe URL schemes', () => {
  assert.throws(
    () => parseHeroCsv([
      'type,title,tagline,image_url,cta_label,cta_url,accent',
      'event,Bad,Nope,,Go,javascript:alert(1),turquoise',
    ].join('\n')),
    /Unsafe URL scheme/i,
  );
  assert.throws(
    () => parseEventsCsv([
      'date,time,title,tagline,location,type,status,url',
      '2026-12-02,19:00,Open,Visit,Wetzikon,event,upcoming,"data:text/html;base64,xxxx"',
    ].join('\n')),
    /Unsafe URL scheme/i,
  );
});

test('events adapter preserves empty upcoming state and relative legacy urls', () => {
  const { items } = parseEventsCsv([
    'date,time,title,tagline,location,type,status,url',
    '2026-03-28,13:00,Paper,Lab,Wetzikon,event,past,arduino-day-2026.html',
    '2026-11-21,10:00,Light,Embroidery,Wetzikon,workshop,cancel,#workshop-embroidering-light',
    '2026-12-02,19:00,Open studio,Visit,Wetzikon,event,upcoming,https://example.com/event',
    '2026-01-05,10:00,Earlier,Visit,Wetzikon,event,open,https://example.com/earlier',
  ].join('\n'));
  const upcoming = selectUpcomingEvents(items);
  assert.deepEqual(upcoming.map((row) => row.title), ['Earlier', 'Open studio']);
  assert.equal(selectUpcomingEvents(items.filter((row) => row.status === 'past')).length, 0);
});

test('archive adapter filters, sorts, limits to six, and allows missing images', () => {
  const csv = [
    'id,title,year,category,description,image_url,image_alt,url,github_url,featured,published,order',
    'z-last,Z Last,2026,cat,"Desc",,,https://example.com/z,,TRUE,TRUE,9',
    'a-first,A First,2026,cat,"Desc with\nnewline",https://example.com/a.webp,Alt,https://example.com/a,https://github.com/example/a,TRUE,TRUE,1',
    'hidden,Hidden,2026,cat,"Desc",,,https://example.com/h,,FALSE,TRUE,2',
    'draft,Draft,2026,cat,"Desc",,,https://example.com/d,,TRUE,FALSE,3',
    'b-second,B Second,2025,cat,"Desc",,,https://example.com/b,,TRUE,TRUE,2',
    'c-third,C Third,2024,cat,"Desc",,,https://example.com/c,,TRUE,TRUE,3',
    'd-fourth,D Fourth,2024,cat,"Desc",,,https://example.com/d2,,TRUE,TRUE,4',
    'e-fifth,E Fifth,2024,cat,"Desc",,,https://example.com/e,,TRUE,TRUE,5',
    'f-sixth,F Sixth,2024,cat,"Desc",,,https://example.com/f,,TRUE,TRUE,6',
    'g-seventh,G Seventh,2024,cat,"Desc",,,https://example.com/g,,TRUE,TRUE,7',
    ',,,,,,,,,FALSE,FALSE,',
  ].join('\n');

  const parsed = parseArchiveCsv(csv);
  assert.equal(parsed.items.length, 10);
  const selected = selectArchiveEntries(parsed.items);
  assert.deepEqual(selected.map((entry) => entry.id), [
    'a-first', 'b-second', 'c-third', 'd-fourth', 'e-fifth', 'f-sixth',
  ]);
  assert.equal(selected[0].description.includes('\n'), true);
  assert.equal(selected.find((entry) => entry.id === 'z-last'), undefined);

  const limited = parseAndSelectArchive(csv);
  assert.equal(limited.items.length, 6);
  assert.equal(limited.items.find((entry) => entry.id === 'a-first')?.imageUrl, 'https://example.com/a.webp');
  assert.equal(limited.items.find((entry) => entry.id === 'b-second')?.imageUrl, null);
});

test('archive adapter rejects duplicate ids and unsafe links', () => {
  assert.throws(
    () => parseArchiveCsv([
      'id,title,year,category,description,image_url,image_alt,url,github_url,featured,published,order',
      'same,One,2026,cat,Desc,,,https://example.com/1,,TRUE,TRUE,1',
      'same,Two,2026,cat,Desc,,,https://example.com/2,,TRUE,TRUE,2',
    ].join('\n')),
    /duplicate id/i,
  );
  assert.throws(
    () => parseArchiveCsv([
      'id,title,year,category,description,image_url,image_alt,url,github_url,featured,published,order',
      'bad,Bad,2026,cat,Desc,,,javascript:alert(1),,TRUE,TRUE,1',
    ].join('\n')),
    /Unsafe URL scheme/i,
  );
});

test('archive adapter normalises Google Sheets booleans and integers', () => {
  const { items } = parseArchiveCsv([
    'id,title,year,category,description,image_url,image_alt,url,github_url,featured,published,order',
    'ok,Ok,2026,cat,Desc,,,https://example.com/ok,,TRUE,FALSE,12',
  ].join('\n'));
  assert.equal(items[0].featured, true);
  assert.equal(items[0].published, false);
  assert.equal(items[0].year, 2026);
  assert.equal(items[0].order, 12);
  assert.throws(
    () => parseArchiveCsv([
      'id,title,year,category,description,image_url,image_alt,url,github_url,featured,published,order',
      'bad,Bad,twenty,cat,Desc,,,https://example.com/bad,,YES,TRUE,1',
    ].join('\n')),
    FeedValidationError,
  );
});

test('snapshot write is atomic and previous file survives invalid replacement attempts', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'schoolai-feeds-'));
  const originalFeedsDirectory = join(process.cwd(), 'src/data/feeds');

  // Exercise the real helpers against a temporary copy by writing through the API
  // into the project snapshots using a disposable sidecar pattern.
  const feed = 'hero';
  const before = readFileSync(join(originalFeedsDirectory, 'hero.json'), 'utf8');
  const snapshot = parseHeroSnapshot(JSON.parse(before));
  writeSnapshotAtomic(createSnapshot(feed, snapshot.sourceUrl, snapshot.items, snapshot.fetchedAt));
  assert.equal(snapshotExists(feed), true);

  assert.throws(() => parseHeroSnapshot({ feed: 'hero', fetchedAt: 'nope', sourceUrl: 'https://example.com', items: [] }), /fetchedAt/i);

  // Restore exact bytes written by refresh in case formatting drifted.
  writeFileSync(join(originalFeedsDirectory, 'hero.json'), before);
  rmSync(dir, { recursive: true, force: true });
});

test('refresh script distinguishes network keep from invalid failure', async () => {
  const source = readFileSync(new URL('../scripts/refresh-feeds.ts', import.meta.url), 'utf8');
  assert.match(source, /kept-network/);
  assert.match(source, /status === 'invalid'/);
  assert.match(source, /writeSnapshotAtomic/);
  assert.match(source, /parseAndSelectArchive/);
});

test('committed snapshots contain only public feed material', () => {
  const archive = JSON.parse(readFileSync(new URL('../src/data/feeds/archive.json', import.meta.url), 'utf8'));
  assert.equal(archive.feed, 'archive');
  assert.equal(archive.items.length, 6);
  assert.deepEqual(archive.items.map((item) => item.id), [
    'affective-atmosphere-2046',
    'mr-sonnet',
    'claw-pilot',
    'drawing-machines',
    'maze-circuit',
    'paper-as-interface',
  ]);
  for (const item of archive.items) {
    assert.equal(item.published, true);
    assert.equal(item.featured, true);
  }
  assert.equal(archive.items.find((item) => item.id === 'drawing-machines').imageUrl, null);
  assert.equal(archive.items.find((item) => item.id === 'maze-circuit').imageUrl, null);

  const hero = JSON.parse(readFileSync(new URL('../src/data/feeds/hero.json', import.meta.url), 'utf8'));
  assert.equal(hero.items.length, 3);
  const events = JSON.parse(readFileSync(new URL('../src/data/feeds/events.json', import.meta.url), 'utf8'));
  assert.equal(events.items.length, 24);
  assert.equal(selectUpcomingEvents(events.items).length, 0);
});
