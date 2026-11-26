import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  parseEventsCsv,
  parseHeroCsv,
  renderEventsMarkup,
  renderHeroCarouselMarkup,
  selectUpcomingEvents,
} from '../src/lib/sheets/index.ts';

test('client refresh failure keeps previously rendered snapshot markup', () => {
  const homepage = readFileSync(new URL('../src/scripts/homepage.ts', import.meta.url), 'utf8');
  assert.match(homepage, /Keep the last rendered snapshot/);
  assert.match(homepage, /feedClientTimeoutMs/);
  assert.doesNotMatch(homepage, /carouselEl\.style\.display = 'none'/);
  assert.doesNotMatch(homepage, /showEventsError/);

  const heroSnapshot = JSON.parse(readFileSync(new URL('../src/data/feeds/hero.json', import.meta.url), 'utf8'));
  const eventsSnapshot = JSON.parse(readFileSync(new URL('../src/data/feeds/events.json', import.meta.url), 'utf8'));
  const heroHtml = renderHeroCarouselMarkup(heroSnapshot.items);
  const eventsHtml = renderEventsMarkup(selectUpcomingEvents(eventsSnapshot.items));

  assert.match(heroHtml, /Your Hand Is the Prompt|hero-carousel-pause/);
  assert.match(eventsHtml, /No public events are scheduled right now/);

  // A failed client parse must not be used to blank the UI.
  assert.throws(() => parseHeroCsv('bad'), /CSV is empty|headers/i);
  assert.throws(() => parseEventsCsv('bad'), /CSV is empty|headers/i);
  assert.equal(heroHtml.length > 0, true);
  assert.equal(eventsHtml.length > 0, true);
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
