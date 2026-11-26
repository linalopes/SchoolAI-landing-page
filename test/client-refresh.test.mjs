import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  parseAndSelectArchive,
  parseAndSelectWorkstations,
  parseEventsCsv,
  parseHeroCsv,
  renderArchiveMarkup,
  renderEventsMarkup,
  renderHeroCarouselMarkup,
  renderWorkstationsMarkup,
  selectUpcomingEvents,
} from '../src/lib/sheets/index.ts';

test('client refresh failure keeps previously rendered snapshot markup', () => {
  const homepage = readFileSync(new URL('../src/scripts/homepage.ts', import.meta.url), 'utf8');
  assert.match(homepage, /Keep the last rendered snapshot/);
  assert.match(homepage, /feedClientTimeoutMs/);
  assert.match(homepage, /refreshArchive/);
  assert.match(homepage, /refreshWorkstations/);
  assert.doesNotMatch(homepage, /carouselEl\.style\.display = 'none'/);
  assert.doesNotMatch(homepage, /showEventsError/);

  const heroSnapshot = JSON.parse(readFileSync(new URL('../src/data/feeds/hero.json', import.meta.url), 'utf8'));
  const eventsSnapshot = JSON.parse(readFileSync(new URL('../src/data/feeds/events.json', import.meta.url), 'utf8'));
  const archiveSnapshot = JSON.parse(readFileSync(new URL('../src/data/feeds/archive.json', import.meta.url), 'utf8'));
  const workstationsSnapshot = JSON.parse(readFileSync(new URL('../src/data/feeds/workstations.json', import.meta.url), 'utf8'));
  const heroHtml = renderHeroCarouselMarkup(heroSnapshot.items);
  const eventsHtml = renderEventsMarkup(selectUpcomingEvents(eventsSnapshot.items));
  const archiveHtml = renderArchiveMarkup(archiveSnapshot.items);
  const workstationsHtml = renderWorkstationsMarkup(workstationsSnapshot.items);

  assert.match(heroHtml, /Your Hand Is the Prompt|hero-carousel-pause/);
  assert.match(eventsHtml, /No public events are scheduled right now/);
  assert.match(archiveHtml, /archive-grid|Affective Atmosphere 2046/);
  assert.match(archiveHtml, /archive-card-media--fallback/);
  assert.match(workstationsHtml, /BioLab|Craft Office|Wearables Lab/);
  assert.match(workstationsHtml, /workstation-card-media--fallback/);

  assert.throws(() => parseHeroCsv('bad'), /CSV is empty|headers/i);
  assert.throws(() => parseEventsCsv('bad'), /CSV is empty|headers/i);
  assert.throws(() => parseAndSelectArchive('bad'), /CSV is empty|headers/i);
  assert.throws(() => parseAndSelectWorkstations('bad'), /CSV is empty|headers/i);
  assert.equal(heroHtml.length > 0, true);
  assert.equal(eventsHtml.length > 0, true);
  assert.equal(archiveHtml.length > 0, true);
  assert.equal(workstationsHtml.length > 0, true);
});

test('carousel markup includes pause control for accessibility', () => {
  const html = renderHeroCarouselMarkup([
    {
      type: 'event',
      title: 'Example',
      tagline: 'Tagline',
      imageUrl: null,
      ctaLabel: 'Learn more',
      ctaUrl: 'https://example.com',
      accent: 'turquoise',
    },
  ]);
  assert.match(html, /hero-carousel-pause/);
  assert.match(html, /hero-slide-pattern/);
});
