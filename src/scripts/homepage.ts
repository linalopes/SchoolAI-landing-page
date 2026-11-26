import {
  archiveCsvUrl,
  contributorsCsvUrl,
  eventsCsvUrl,
  feedClientTimeoutMs,
  heroCsvUrl,
  workstationsCsvUrl,
} from '../lib/sheets/contract.ts';
import { parseAndSelectArchive } from '../lib/sheets/archive.ts';
import { parseAndSelectContributors } from '../lib/sheets/contributors.ts';
import { parseEventsCsv, selectUpcomingEvents } from '../lib/sheets/events.ts';
import { parseHeroCsv } from '../lib/sheets/hero.ts';
import {
  renderArchiveMarkup,
  renderContributorsMarkup,
  renderEventsMarkup,
  renderHeroCarouselMarkup,
  renderWorkstationsMarkup,
} from '../lib/sheets/html.ts';
import type { ContributorCategory } from '../lib/sheets/types.ts';
import { parseAndSelectWorkstations } from '../lib/sheets/workstations.ts';

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

async function fetchCsv(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), feedClientTimeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'text/csv,text/plain,*/*' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } finally {
    window.clearTimeout(timer);
  }
}

function mountCarousel(carouselEl: HTMLElement): void {
  const slideEls = carouselEl.querySelectorAll('.hero-slide');
  const dotEls = carouselEl.querySelectorAll('.hero-carousel-dot');
  const progressEl = carouselEl.querySelector('.hero-carousel-progress');
  const pauseBtn = carouselEl.querySelector('.hero-carousel-pause');
  if (!(progressEl instanceof HTMLElement) || slideEls.length === 0) return;

  const DURATION = 5000;
  let currentIndex = 0;
  let timerId = 0;
  let paused = prefersReducedMotion();

  const restartProgress = (accentColor: string) => {
    progressEl.style.transition = 'none';
    progressEl.style.width = '0';
    progressEl.style.background = accentColor;
    if (paused || slideEls.length < 2) return;
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
      slideEl.setAttribute('aria-hidden', idx === currentIndex ? 'false' : 'true');
    });
    dotEls.forEach((dotEl, idx) => {
      dotEl.classList.toggle('active', idx === currentIndex);
      if (dotEl instanceof HTMLElement) {
        dotEl.setAttribute('aria-selected', idx === currentIndex ? 'true' : 'false');
      }
    });
    const activeSlide = slideEls[currentIndex];
    const accentColor = activeSlide instanceof HTMLElement
      ? getComputedStyle(activeSlide).getPropertyValue('--slide-accent').trim() || 'var(--turquoise)'
      : 'var(--turquoise)';
    restartProgress(accentColor);
  };

  const stopTimer = () => {
    window.clearInterval(timerId);
    timerId = 0;
  };

  const startTimer = () => {
    stopTimer();
    if (paused || slideEls.length < 2) return;
    timerId = window.setInterval(() => {
      setActiveSlide((currentIndex + 1) % slideEls.length);
    }, DURATION);
  };

  const syncPauseButton = () => {
    if (!(pauseBtn instanceof HTMLButtonElement)) return;
    pauseBtn.hidden = slideEls.length < 2;
    pauseBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
    pauseBtn.textContent = paused ? 'Play' : 'Pause';
  };

  const setPaused = (next: boolean) => {
    paused = next;
    syncPauseButton();
    if (paused) {
      stopTimer();
      progressEl.style.transition = 'none';
      progressEl.style.width = '0';
    } else {
      setActiveSlide(currentIndex);
      startTimer();
    }
  };

  dotEls.forEach((dotEl) => {
    dotEl.addEventListener('click', () => {
      if (!(dotEl instanceof HTMLElement)) return;
      const nextIndex = Number(dotEl.dataset.index);
      if (Number.isNaN(nextIndex) || nextIndex === currentIndex) return;
      setActiveSlide(nextIndex);
      if (!paused) startTimer();
    });
  });

  if (pauseBtn instanceof HTMLButtonElement) {
    pauseBtn.addEventListener('click', () => setPaused(!paused));
  }

  carouselEl.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setActiveSlide((currentIndex + 1) % slideEls.length);
      if (!paused) startTimer();
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setActiveSlide((currentIndex - 1 + slideEls.length) % slideEls.length);
      if (!paused) startTimer();
    }
  });

  setActiveSlide(0);
  syncPauseButton();
  startTimer();
}

async function refreshHero(carouselEl: HTMLElement): Promise<void> {
  try {
    const csv = await fetchCsv(heroCsvUrl);
    const { items } = parseHeroCsv(csv);
    if (!items.length) return;
    carouselEl.innerHTML = renderHeroCarouselMarkup(items);
    mountCarousel(carouselEl);
  } catch {
    // Keep the last rendered snapshot.
  }
}

async function refreshEvents(listEl: HTMLElement): Promise<void> {
  try {
    const csv = await fetchCsv(eventsCsvUrl);
    const { items } = parseEventsCsv(csv);
    listEl.innerHTML = renderEventsMarkup(selectUpcomingEvents(items));
  } catch {
    // Keep the last rendered snapshot.
  }
}

async function refreshArchive(hostEl: HTMLElement): Promise<void> {
  try {
    const csv = await fetchCsv(archiveCsvUrl);
    const { items } = parseAndSelectArchive(csv);
    hostEl.innerHTML = renderArchiveMarkup(items);
  } catch {
    // Keep the last rendered snapshot.
  }
}

async function refreshWorkstations(hostEl: HTMLElement): Promise<void> {
  try {
    const csv = await fetchCsv(workstationsCsvUrl);
    const { items } = parseAndSelectWorkstations(csv);
    hostEl.innerHTML = renderWorkstationsMarkup(items);
  } catch {
    // Keep the last rendered snapshot.
  }
}

function readContributorRenderOptions(hostEl: HTMLElement): {
  categoryLabels: Partial<Record<ContributorCategory, string>>;
  categoryOrder?: ContributorCategory[];
} {
  let categoryLabels: Partial<Record<ContributorCategory, string>> = {};
  let categoryOrder: ContributorCategory[] | undefined;
  try {
    categoryLabels = JSON.parse(hostEl.dataset.categoryLabels || '{}') as Partial<
      Record<ContributorCategory, string>
    >;
  } catch {
    categoryLabels = {};
  }
  try {
    const order = JSON.parse(hostEl.dataset.categoryOrder || '[]') as ContributorCategory[];
    if (Array.isArray(order) && order.length) categoryOrder = order;
  } catch {
    categoryOrder = undefined;
  }
  return { categoryLabels, categoryOrder };
}

async function refreshContributors(hostEl: HTMLElement): Promise<void> {
  try {
    const csv = await fetchCsv(contributorsCsvUrl);
    const { items } = parseAndSelectContributors(csv);
    hostEl.innerHTML = renderContributorsMarkup(items, readContributorRenderOptions(hostEl));
  } catch {
    // Keep the last rendered snapshot.
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

  const carouselEl = document.getElementById('hero-carousel');
  if (carouselEl instanceof HTMLElement) {
    mountCarousel(carouselEl);
    void refreshHero(carouselEl);
  }

  const listEl = document.getElementById('events-list');
  if (listEl instanceof HTMLElement) {
    void refreshEvents(listEl);
  }

  document.querySelectorAll<HTMLElement>('[data-feed="archive"]').forEach((el) => {
    void refreshArchive(el);
  });

  document.querySelectorAll<HTMLElement>('[data-feed="workstations"]').forEach((el) => {
    void refreshWorkstations(el);
  });

  document.querySelectorAll<HTMLElement>('[data-feed="contributors"]').forEach((el) => {
    void refreshContributors(el);
  });

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
        button.textContent = 'Subscribe';
        button.disabled = false;
      }
    } catch {
      button.textContent = 'Subscribe';
      button.disabled = false;
    }
  });
}
