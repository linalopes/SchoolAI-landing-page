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
  assert.match(html, /id="publications"/);
  assert.match(html, /href="\/publications\/"/);
  assert.match(html, /Knowledge in different forms/);
  assert.match(html, /id="gallery"/);
  assert.match(html, /Inverted Gallery/);
  assert.match(html, /href="\/inverted-gallery\/"/);
  assert.match(html, /id="collaborate"/);
  assert.match(html, /href="\/collaborate\/"/);
  const homeSectionOrder = [
    'id="programme"',
    'id="publications"',
    'id="gallery"',
    'id="collaborate"',
  ].map((token) => html.indexOf(token));
  assert.ok(homeSectionOrder.every((idx) => idx > -1));
  assert.deepEqual(homeSectionOrder, [...homeSectionOrder].sort((a, b) => a - b));
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
  assert.match(programme, /Current Programme/);
  assert.match(programme, /January – June 2027/);
  assert.match(programme, /Artificial Emotion/);
  assert.match(programme, /emotion\.linalopes\.info/);
  assert.match(programme, /Open Research Studio/);
  assert.match(programme, /Research-based Workshops/);
  assert.match(programme, /Upcoming Events/);
  assert.match(programme, /Activity Formats/);
  assert.match(programme, /Past Programmes/);
  assert.match(programme, /Room for Interaction/);
  assert.match(programme, /href="\/room-for-interaction\.html"/);
  assert.match(programme, /Past Events/);
  assert.match(programme, /Arduino Day|Paper as Interface/);
  assert.doesNotMatch(programme, /#workshop-augmented-cinema/);
  assert.doesNotMatch(programme, /Singing to a Garden/);
  // Section order: Current → Upcoming → Formats → Past Programmes → Past Events
  const currentIdx = programme.indexOf('id="current-programme"');
  const upcomingIdx = programme.indexOf('id="upcoming-events-heading"');
  const formatsIdx = programme.indexOf('id="activity-formats-heading"');
  const pastProgrammesIdx = programme.indexOf('id="past-programmes"');
  const pastEventsIdx = programme.indexOf('id="past-events-heading"');
  assert.ok(currentIdx > -1 && upcomingIdx > currentIdx);
  assert.ok(formatsIdx > upcomingIdx);
  assert.ok(pastProgrammesIdx > formatsIdx);
  assert.ok(pastEventsIdx > pastProgrammesIdx);
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
  assert.match(readFileSync(dist('sitemap.xml'), 'utf8'), /https:\/\/schoolai\.linalopes\.info\/publications\//);
  assert.match(readFileSync(dist('sitemap.xml'), 'utf8'), /https:\/\/schoolai\.linalopes\.info\/inverted-gallery\//);
  assert.match(readFileSync(dist('sitemap.xml'), 'utf8'), /https:\/\/schoolai\.linalopes\.info\/collaborate\/wishlist\//);
  assert.match(readFileSync(dist('404.html'), 'utf8'), /Page not found/);
  assert.match(html, /og:title/);
  assert.match(html, /canonical/);

  for (const path of [
    'space3d.html',
    'room-for-interaction.html',
    'room-for-interaction.json',
    'arduino-day-2026.html',
    'peppers-ghost.html',
    'CNAME',
  ]) {
    assert.equal(statSync(dist(path)).isFile(), true, path);
  }
  assert.equal(existsSync(dist('arduino-day-2026/index.html')), false);
  assert.equal(existsSync(dist('room-for-interaction/index.html')), false);
  assert.equal(existsSync(dist('peppers-ghost/index.html')), false);
  const arduinoDay = readFileSync(dist('arduino-day-2026.html'), 'utf8');
  assert.match(arduinoDay, /Paper as/);
  assert.match(arduinoDay, /Interface/);
  assert.match(arduinoDay, /id="hero"[^>]*class="[^"]*ad-hero|class="[^"]*ad-hero[^"]*"[^>]*id="hero"/);
  assert.match(arduinoDay, /#hero:not\(\.ad-hero\):not\(\.rfi-hero\)|\.arduino-day #hero\.ad-hero/);
  assert.match(arduinoDay, /id="timeline"/);
  assert.match(arduinoDay, /id="details"/);
  assert.match(arduinoDay, /id="related-publication"/);
  assert.match(arduinoDay, /id="faq"/);
  assert.match(arduinoDay, /school-ai-paper-as-interface\.vercel\.app/);
  assert.match(arduinoDay, /href="\/publications\/"/);
  assert.match(arduinoDay, /canonical[^>]+arduino-day-2026\.html/);
  assert.match(arduinoDay, /twitch\.tv\/lina_lopes/);
  assert.match(arduinoDay, /imgs\/lina\.jpg|\/imgs\/lina\.jpg/);
  assert.match(arduinoDay, /id="nav"|Site of Tomorrow|School of Tomorrow/);
  assert.match(arduinoDay, /footer-main|footer-col/);
  assert.match(arduinoDay, /href="\/publications\/"/);
  assert.match(readFileSync(dist('sitemap.xml'), 'utf8'), /arduino-day-2026\.html/);
  assert.match(readFileSync(dist('sitemap.xml'), 'utf8'), /room-for-interaction\.html/);
  assert.match(readFileSync(dist('sitemap.xml'), 'utf8'), /peppers-ghost\.html/);
  assert.match(readFileSync(dist('sitemap.xml'), 'utf8'), /\/publications\//);

  const publications = readFileSync(dist('publications/index.html'), 'utf8');
  assert.match(publications, /canonical[^>]+\/publications\/|rel="canonical"[^>]+publications/);
  assert.match(publications, /Knowledge in different forms/);
  assert.match(publications, /Pepper(?:'|&#39;|’)?s Ghost/);
  assert.match(publications, /Paper as Interface/);
  assert.match(publications, /href="\/peppers-ghost\.html"/);
  assert.match(publications, /Explore the experiment/);
  assert.match(publications, /school-ai-paper-as-interface\.vercel\.app/);
  assert.match(publications, /Explore the board/);
  assert.match(publications, /github\.com\/linalopes\/SchoolAI-paper-as-interface/);
  assert.match(publications, /href="\/arduino-day-2026\.html"/);
  assert.match(publications, /aria-current="page"/);
  assert.match(publications, /href="\/publications\/"/);
  assert.doesNotMatch(publications, /Draft Reserved/);
  assert.doesNotMatch(publications, /ISBN|DOI|openly licensed|Creative Commons/i);

  const peppers = readFileSync(dist('peppers-ghost.html'), 'utf8');
  assert.match(peppers, /canonical[^>]+peppers-ghost\.html/);
  assert.match(peppers, /viewport-fit=cover/);
  assert.match(peppers, /Open studio experiment/);
  assert.match(peppers, /Make your own ghost/);
  assert.match(peppers, /id="studio"/);
  assert.match(peppers, /id="use"/);
  assert.match(peppers, /id="template"/);
  assert.match(peppers, /id="calibrate"/);
  assert.match(peppers, /id="how"/);
  assert.match(peppers, /id="history"/);
  assert.match(peppers, /data-example="orb"/);
  assert.match(peppers, /data-example="creature"/);
  assert.match(peppers, /data-example="particles"/);
  assert.match(peppers, /data-example="text"/);
  assert.match(peppers, /pepper_ghost_pyramid_template_6cm\.svg/);
  assert.match(peppers, /\.peppers-ghost section\{padding:0\}|\.peppers-ghost section\s*\{[^}]*padding:\s*0/s);
  assert.match(peppers, /body:has\(\.peppers-ghost\):not\(\.ghost-mode\) #nav|body:has\(.peppers-ghost\):not\(.ghost-mode\) #nav/);
  assert.match(peppers, /safe-area-inset-top/);
  assert.match(peppers, /safe-area-inset-bottom/);
  assert.match(peppers, /id="nav"|School of Tomorrow/);
  assert.match(peppers, /footer-main|footer-col/);
  assert.match(peppers, /id="ghost-stage"/);
  assert.doesNotMatch(
    readFileSync(dist('index.html'), 'utf8'),
    /body:has\(\.peppers-ghost\)|body:has\(.peppers-ghost\)/,
  );
  assert.equal(statSync(dist('imgs/pepper_ghost_pyramid_template_6cm.svg')).isFile(), true);
  assert.doesNotMatch(readFileSync(dist('index.html'), 'utf8'), /viewport-fit=cover/);
  assert.doesNotMatch(arduinoDay, /viewport-fit=cover/);
  const peppersScriptMatch = peppers.match(/src="(\/_astro\/[^"]*PeppersGhost[^"]+\.js)"/);
  assert.ok(peppersScriptMatch, 'Pepper’s Ghost client script should be bundled');
  const peppersScript = readFileSync(dist(peppersScriptMatch[1].replace(/^\//, '')), 'utf8');
  assert.match(peppersScript, /allow-scripts/);
  assert.doesNotMatch(peppersScript, /allow-same-origin/);
  assert.match(peppersScript, /peppers-ghost-code/);
  assert.match(peppersScript, /peppers-ghost-scale-v2/);
  assert.match(peppersScript, /peppers-ghost-distance-v2/);
  assert.match(peppersScript, /p5@1\.11\.3/);
  assert.match(peppersScript, /took too long to start/);
  assert.match(peppersScript, /typeof \w+\.type==[`'"]string[`'"]|typeof \([^)]+\)\.type === ["']string["']/);
  assert.match(peppersScript, /Promise\.resolve\([^)]*\)\.catch/);

  const room = readFileSync(dist('room-for-interaction.html'), 'utf8');
  assert.match(room, /Room for/);
  assert.match(room, /Interaction/);
  assert.match(room, /canonical[^>]+room-for-interaction\.html/);
  assert.match(room, /id="hero"[^>]*class="[^"]*rfi-hero|class="[^"]*rfi-hero[^"]*"[^>]*id="hero"/);
  assert.match(room, /#hero:not\(\.ad-hero\):not\(\.rfi-hero\)|\.room-for-interaction #hero\.rfi-hero/);
  for (const id of [
    'workshop-augmented-cinema',
    'workshop-maze-circuit',
    'workshop-singing-to-a-garden',
    'workshop-marble-machine-orchestra',
    'workshop-from-gesture-to-pen',
    'workshop-room-as-instrument',
    'workshop-embroidering-light',
  ]) {
    assert.match(room, new RegExp(`id="${id}"`));
  }
  assert.match(room, /Completed/);
  assert.match(room, /28–29 August 2026|28-29 August 2026/);
  assert.match(room, />Proposal</);
  assert.doesNotMatch(room, /Cancelled proposal|Events snapshot|Events feed/i);
  assert.match(room, /Glitch Lab/);
  assert.doesNotMatch(room, /Next workshop/i);
  assert.doesNotMatch(room, /View registration page/i);
  assert.match(room, /id="cta"/);
  assert.equal((room.match(/id="contact"/g) || []).length, 1);
  assert.match(room, /id="nav"|School of Tomorrow/);
  assert.match(room, /footer-main|footer-col/);

  const roomJson = JSON.parse(readFileSync(dist('room-for-interaction.json'), 'utf8'));
  for (const key of ['title', 'subtitle', 'tagline', 'description', 'format', 'location']) {
    assert.equal(typeof roomJson.program[key], 'string');
  }
  assert.equal(roomJson.program.status, 'archived');
  assert.equal(roomJson.workshops.length, 7);
  for (const workshop of roomJson.workshops) {
    for (const key of [
      'id',
      'title',
      'subtitle',
      'description',
      'icon',
      'color',
      'schedule',
      'content',
      'lumaEventUrl',
      'lumaEmbedUrl',
    ]) {
      assert.ok(key in workshop, `missing ${key} on ${workshop.id}`);
    }
    assert.ok(workshop.content.whatYoullLearn.length > 0);
    assert.ok(workshop.content.whoShouldJoin);
    assert.ok(workshop.content.description);
  }
  const maze = roomJson.workshops.find((item) => item.id === 'maze-circuit');
  assert.ok(maze);
  assert.equal(maze.status, 'completed');
  assert.equal(maze.icon, 'zap');
  assert.match(maze.schedule.inPerson.dates, /August 2026/);
  assert.match(maze.lumaEmbedUrl, /luma\.com\/embed/);
  assert.equal(
    roomJson.workshops.filter((item) => item.status === 'cancelled').length,
    6,
  );

  const home = readFileSync(dist('index.html'), 'utf8');
  assert.match(home, /id="hero"/);
  assert.doesNotMatch(home, /class="ad-hero"/);
  assert.doesNotMatch(home, /class="rfi-hero"/);
  assert.match(home, /#hero:not\(\.ad-hero\):not\(\.rfi-hero\)/);
  assert.equal(existsSync(dist('collaborate/wishlist/index.html')), true);
  assert.equal(existsSync(dist('collaborate/contributors/index.html')), false);
});
