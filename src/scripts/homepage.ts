import { eventsCsvUrl, eventsVisibleCount, heroCsvUrl } from '../lib/sheets/contract.ts';

type Row = Record<string, string>;

export function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

export function parseCSV(csvText: string): Row[] {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const headerLine = lines[0];
  if (!headerLine || lines.length <= 1) return [];

  const headers = parseCSVLine(headerLine).map((header) => header.toLowerCase());
  return lines.slice(1).map((line) => {
    const cols = parseCSVLine(line);
    const record: Row = {};

    headers.forEach((header, index) => {
      const rawValue = cols[index] || '';
      record[header] = rawValue.replace(/^"(.*)"$/, '$1').trim();
    });

    return record;
  });
}

function escapeHTML(value: string): string {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getCarouselAccentConfig(accentValue: string): { color: string; border: string } {
  const accent = (accentValue || '').toLowerCase().trim();
  if (accent === 'pink') return { color: 'var(--pink)', border: 'rgba(234,125,255,0.45)' };
  if (accent === 'white') return { color: 'rgba(255,255,255,0.55)', border: 'rgba(255,255,255,0.45)' };
  if (accent === 'turquoise') return { color: 'var(--turquoise)', border: 'rgba(8,242,219,0.45)' };
  return { color: 'var(--turquoise)', border: 'rgba(8,242,219,0.45)' };
}

function emphasizeLastWord(title: string): string {
  const words = title.trim().split(/\s+/);
  if (!words.length || !words[0]) return '';
  if (words.length === 1) return `<span>${words[0]}</span>`;
  const leading = words.slice(0, -1).join(' ');
  const ending = words[words.length - 1];
  return `${leading} <span>${ending}</span>`;
}

async function loadCarousel(): Promise<void> {
  const carouselEl = document.getElementById('hero-carousel');
  if (!carouselEl) return;

  try {
    const response = await fetch(heroCsvUrl);
    if (!response.ok) throw new Error('Request failed');

    const csvText = await response.text();
    const slides = parseCSV(csvText);
    if (!slides.length) {
      carouselEl.style.display = 'none';
      return;
    }

    const slidesHTML = slides.map((slide, index) => {
      const type = escapeHTML(slide.type || '');
      const title = escapeHTML(slide.title || '');
      const tagline = escapeHTML(slide.tagline || '');
      const imageUrl = escapeHTML(slide.image_url || '');
      const hasImage = imageUrl.length > 0;
      const ctaLabel = escapeHTML(slide.cta_label || 'Learn more');
      const ctaUrl = escapeHTML(slide.cta_url || '');
      const accent = getCarouselAccentConfig(escapeHTML(slide.accent || ''));
      const ctaHTML = ctaUrl ? `<a class="hero-slide-cta button button--sm button--on-dark" href="${ctaUrl}" target="_blank" rel="noopener">${ctaLabel}</a>` : '';
      const imageStyle = hasImage ? `background-image:url('${imageUrl}');` : '';

      return `
        <article class="hero-slide${index === 0 ? ' active' : ''}" style="--slide-accent:${accent.color};--slide-accent-border:${accent.border};">
          <div class="hero-slide-image" style="${imageStyle}"></div>
          ${hasImage ? '' : '<div class="hero-slide-pattern"></div>'}
          <div class="hero-slide-tint"></div>
          <div class="hero-slide-gradient"></div>
          <div class="hero-slide-content">
            ${type ? `<p class="hero-slide-eyebrow t-label">${type}</p>` : ''}
            <h3 class="hero-slide-title">${emphasizeLastWord(title)}</h3>
            ${tagline ? `<p class="hero-slide-tagline">${tagline}</p>` : ''}
            ${ctaHTML}
          </div>
        </article>
      `;
    }).join('');

    const dotsHTML = slides.map((_slide, index) => `
      <button class="hero-carousel-dot${index === 0 ? ' active' : ''}" type="button" data-index="${index}" aria-label="Go to slide ${index + 1}"></button>
    `).join('');

    carouselEl.innerHTML = `
      <div class="hero-carousel-slides">${slidesHTML}</div>
      <div class="hero-carousel-dots">${dotsHTML}</div>
      <div class="hero-carousel-progress"></div>
    `;

    const slideEls = carouselEl.querySelectorAll('.hero-slide');
    const dotEls = carouselEl.querySelectorAll('.hero-carousel-dot');
    const progressEl = carouselEl.querySelector('.hero-carousel-progress');
    if (!(progressEl instanceof HTMLElement) || slideEls.length === 0) return;

    const DURATION = 5000;
    let currentIndex = 0;
    let timerId = 0;

    const restartProgress = (accentColor: string) => {
      progressEl.style.transition = 'none';
      progressEl.style.width = '0';
      progressEl.style.background = accentColor;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          progressEl.style.transition = `width ${DURATION}ms linear`;
          progressEl.style.width = '100%';
        });
      });
    };

    const setActiveSlide = (nextIndex: number) => {
      currentIndex = nextIndex;
      slideEls.forEach((slideEl, idx) => {
        slideEl.classList.toggle('active', idx === currentIndex);
      });
      dotEls.forEach((dotEl, idx) => {
        dotEl.classList.toggle('active', idx === currentIndex);
      });
      const activeSlide = slideEls[currentIndex];
      const accentColor = activeSlide instanceof HTMLElement
        ? getComputedStyle(activeSlide).getPropertyValue('--slide-accent').trim() || 'var(--turquoise)'
        : 'var(--turquoise)';
      restartProgress(accentColor);
    };

    const startTimer = () => {
      window.clearInterval(timerId);
      timerId = window.setInterval(() => {
        const nextIndex = (currentIndex + 1) % slideEls.length;
        setActiveSlide(nextIndex);
      }, DURATION);
    };

    dotEls.forEach((dotEl) => {
      dotEl.addEventListener('click', () => {
        if (!(dotEl instanceof HTMLElement)) return;
        const nextIndex = Number(dotEl.dataset.index);
        if (Number.isNaN(nextIndex) || nextIndex === currentIndex) return;
        setActiveSlide(nextIndex);
        startTimer();
      });
    });

    setActiveSlide(0);
    startTimer();
  } catch {
    carouselEl.style.display = 'none';
  }
}

function getStatusClass(statusValue: string): string {
  const status = statusValue.toLowerCase().trim();
  if (status === 'open') return 'badge--accent';
  if (status === 'upcoming') return 'badge--neutral';
  if (status === 'full') return 'badge--dark badge--closed';
  return 'badge--outline';
}

export function isVisibleEvent(event: Row): boolean {
  const status = (event.status || '').trim().toLowerCase();
  return status !== 'cancel' && status !== 'cancelled' && status !== 'canceled' && status !== 'past';
}

function showEventsLoading(listEl: HTMLElement): void {
  listEl.innerHTML = `
    <div class="events-item events-item-skeleton" aria-hidden="true">
      <div>
        <div class="skeleton-block skeleton-date"></div>
        <div class="skeleton-block skeleton-time"></div>
      </div>
      <div class="events-info">
        <div class="skeleton-block skeleton-type"></div>
        <div class="skeleton-block skeleton-title"></div>
        <div class="skeleton-block skeleton-tagline"></div>
        <div class="skeleton-block skeleton-location"></div>
      </div>
      <div class="skeleton-block skeleton-badge"></div>
    </div>
  `;
}

function showEventsError(listEl: HTMLElement): void {
  listEl.innerHTML = `
    <div class="events-item">
      <div></div>
      <div class="events-info">
        <div class="events-name">Could not load events — check back soon.</div>
      </div>
      <div></div>
    </div>
  `;
}

function showEventsEmpty(listEl: HTMLElement): void {
  listEl.innerHTML = `
    <p class="events-empty">No public events are scheduled right now. The atelier is still at work. Leave an email if you want to hear when something opens.</p>
  `;
}

export function sortEvents(events: Row[]): Row[] {
  return [...events].sort((a, b) => {
    const aDate = Date.parse(a.date || '');
    const bDate = Date.parse(b.date || '');

    if (Number.isNaN(aDate) && Number.isNaN(bDate)) return 0;
    if (Number.isNaN(aDate)) return 1;
    if (Number.isNaN(bDate)) return -1;
    return aDate - bDate;
  });
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year || 0, (month || 1) - 1, day || 1);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function renderEvents(listEl: HTMLElement, events: Row[]): void {
  const items = events.map((event) => {
    const statusLabel = (event.status || '').trim();
    const status = statusLabel.toLowerCase();
    const typeLabel = (event.type || '').trim();
    const badgeClass = getStatusClass(statusLabel);
    const safeUrl = (event.url || '').trim();
    const hasUrl = safeUrl.length > 0;
    const badgeTag = (hasUrl && (status === 'open' || status === 'upcoming')) ? 'a' : 'div';
    const badgeHref = (badgeTag === 'a') ? `href="${escapeHTML(safeUrl)}" target="_blank" rel="noopener noreferrer"` : '';
    const formatted = formatDate(event.date || '');
    const [month = '', dayRaw = '', year = ''] = formatted.split(' ');
    const day = dayRaw.replace(',', '');

    return `
      <div class="events-item">
        <div class="events-date-block">
          <div class="events-date-day">${escapeHTML(day)}</div>
          <div class="events-date-month">${escapeHTML(month)} ${escapeHTML(year)}</div>
          <div class="events-time">${escapeHTML(event.time || '')}</div>
        </div>
        <div class="events-info">
          ${typeLabel ? `<span class="tag tag--accent events-type">${escapeHTML(typeLabel)}</span>` : ''}
          <div class="events-name">${escapeHTML(event.title || '')}</div>
          ${event.tagline ? `<div class="events-tagline">${escapeHTML(event.tagline)}</div>` : ''}
          ${event.location ? `<div class="events-where">${escapeHTML(event.location)}</div>` : ''}
        </div>
        <${badgeTag} class="badge events-badge ${badgeClass}" ${badgeHref}>${escapeHTML(statusLabel)}</${badgeTag}>
      </div>
    `;
  });

  listEl.innerHTML = items.join('');
}

async function loadUpcomingEvents(): Promise<void> {
  const listEl = document.getElementById('events-list');
  if (!(listEl instanceof HTMLElement)) return;

  showEventsLoading(listEl);

  try {
    const response = await fetch(eventsCsvUrl);
    if (!response.ok) throw new Error('Request failed');

    const csvText = await response.text();
    const events = parseCSV(csvText).filter(isVisibleEvent);

    if (!events.length) {
      showEventsEmpty(listEl);
      return;
    }

    renderEvents(listEl, sortEvents(events).slice(0, eventsVisibleCount));
  } catch {
    showEventsError(listEl);
  }
}

export function startHomepage(): void {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        window.setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

  void loadUpcomingEvents();
  void loadCarousel();

  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');
  const mobileClose = document.getElementById('nav-mobile-close');
  if (hamburger && mobileMenu && mobileClose) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    mobileClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });

    document.querySelectorAll('.nav-mobile-link, .nav-mobile-cta').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  const form = document.getElementById('newsletter-form');
  if (!(form instanceof HTMLFormElement)) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const success = document.getElementById('newsletter-success');
    if (!(button instanceof HTMLButtonElement) || !(success instanceof HTMLElement)) return;
    button.textContent = '...';
    button.disabled = true;
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        form.style.display = 'none';
        success.style.display = 'block';
      } else {
        button.textContent = 'Keep me posted';
        button.disabled = false;
      }
    } catch {
      button.textContent = 'Keep me posted';
      button.disabled = false;
    }
  });
}
