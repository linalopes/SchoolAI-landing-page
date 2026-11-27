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
  assert.doesNotMatch(html, /Research Wishlist|Made possible by/i);

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
  assert.match(programme, /Research-based Workshops/);
  assert.match(programme, /Upcoming Events/);
  assert.match(programme, /Activity Formats/);
  assert.match(programme, /Past Events/);
  assert.match(programme, /Arduino Day|Paper as Interface/);
  assert.doesNotMatch(programme, /Room for Interaction/);
  assert.doesNotMatch(programme, /#workshop-augmented-cinema/);
  assert.doesNotMatch(programme, /Singing to a Garden/);
  assert.match(programme, /aria-current="page"/);
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
  assert.match(collaborate, /Made possible by/);
  assert.match(collaborate, /data-feed="contributors"/);
  assert.match(collaborate, /City of Wetzikon/);
  assert.match(collaborate, /Individual Supporters/);
  assert.match(collaborate, /Research Wishlist/);
  assert.match(collaborate, /Explore the Research Wishlist/);
  assert.match(collaborate, /href="\/collaborate\/wishlist\/"/);
  assert.match(collaborate, /Let(?:'|’|&#39;)s start a conversation/);
  assert.match(collaborate, /Arrange a visit/);
  assert.doesNotMatch(collaborate, /formal employment|residency programmes|internships/);

  const wishlist = readFileSync(dist('collaborate/wishlist/index.html'), 'utf8');
  assert.match(wishlist, /Help make things possible/);
  assert.match(wishlist, /data-feed="wishlist"/);
  assert.match(wishlist, /Current needs/);
  assert.match(wishlist, /Made possible together/);
  assert.match(wishlist, /65-inch flat-screen TV/);
  assert.match(wishlist, /In progress/);
  assert.match(wishlist, /Projection screen/);
  assert.match(wishlist, /Made possible by/);
  assert.match(wishlist, /Nina Judge/);
  assert.match(wishlist, /Offer equipment|Offer materials|Discuss access|Share your expertise/);
  assert.match(wishlist, /Back to Collaborate/);
  assert.match(wishlist, /canonical/);
  assert.match(wishlist, /mailto:lilothink\.science@gmail\.com/);
  assert.doesNotMatch(wishlist, /shopping cart|checkout|progress bar/i);

  const footer = readFileSync(dist('index.html'), 'utf8');
  assert.match(footer, /footer-main/);
  assert.match(footer, /footer-col--explore/);
  assert.match(footer, /footer-col--elsewhere/);
  assert.match(footer, /Explore/);
  assert.match(footer, /Elsewhere/);
  assert.match(footer, /Schönau Areal/);
  assert.match(footer, /Schönaustrasse 13/);
  assert.match(footer, /8620 Wetzikon, Switzerland/);
  assert.match(footer, /Get directions/);
  assert.match(footer, /maps\.google\.com/);
  assert.match(footer, /Research Blog/);
  assert.match(footer, /github\.com\/linalopes/);
  assert.match(footer, /footer-bar/);
  assert.match(footer, /© 20\d{2} School of Tomorrow/);
  assert.match(footer, /Wetzikon-Zürich/);
  assert.doesNotMatch(footer, /<footer[\s\S]*lilothink\.science@gmail\.com/);
  assert.doesNotMatch(footer, /Founded in September 2025 by Lina Lopes/);

  const homeAtelier = readFileSync(dist('index.html'), 'utf8');
  assert.match(homeAtelier, /Schönau Areal/);
  assert.match(homeAtelier, /Open in Google Maps/);

  const atelierPage = readFileSync(dist('atelier/index.html'), 'utf8');
  assert.match(atelierPage, /Schönaustrasse 13 · 8620 Wetzikon, Switzerland/);
  assert.match(atelierPage, /maps\.google\.com/);

  assert.equal(statSync(dist('imgs/contact-twint.png')).isFile(), true);
  assert.equal(statSync(dist('imgs/stripe.png')).isFile(), true);
  assert.equal(statSync(dist('robots.txt')).isFile(), true);
  assert.equal(statSync(dist('sitemap.xml')).isFile(), true);
  assert.match(readFileSync(dist('robots.txt'), 'utf8'), /Sitemap: https:\/\/schoolai\.linalopes\.info\/sitemap\.xml/);
  assert.match(readFileSync(dist('sitemap.xml'), 'utf8'), /https:\/\/schoolai\.linalopes\.info\/inverted-gallery\//);
  assert.match(readFileSync(dist('sitemap.xml'), 'utf8'), /https:\/\/schoolai\.linalopes\.info\/collaborate\/wishlist\//);
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
  assert.equal(existsSync(dist('arduino-day-2026/index.html')), false);
  const arduinoDay = readFileSync(dist('arduino-day-2026.html'), 'utf8');
  assert.match(arduinoDay, /Paper as/);
  assert.match(arduinoDay, /Interface/);
  assert.match(arduinoDay, /id="timeline"/);
  assert.match(arduinoDay, /id="details"/);
  assert.match(arduinoDay, /id="faq"/);
  assert.match(arduinoDay, /canonical[^>]+arduino-day-2026\.html/);
  assert.match(arduinoDay, /twitch\.tv\/lina_lopes/);
  assert.match(arduinoDay, /imgs\/lina\.jpg|\/imgs\/lina\.jpg/);
  assert.match(arduinoDay, /id="nav"|Site of Tomorrow|School of Tomorrow/);
  assert.match(arduinoDay, /footer-main|footer-col/);
  assert.match(readFileSync(dist('sitemap.xml'), 'utf8'), /arduino-day-2026\.html/);
  assert.equal(existsSync(dist('collaborate/wishlist/index.html')), true);
  assert.equal(existsSync(dist('collaborate/contributors/index.html')), false);
});
