import { archiveCta } from './contract.ts';
import type { ArchiveEntry, EventItem, HeroSlide, WorkstationEntry } from './types.ts';
import { resolvePublicEventUrl } from './urls.ts';

export function escapeHTML(value: string): string {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function getCarouselAccentConfig(accentValue: string): { color: string; border: string } {
  const accent = (accentValue || '').toLowerCase().trim();
  if (accent === 'pink') return { color: 'var(--pink)', border: 'rgba(234,125,255,0.45)' };
  if (accent === 'white') return { color: 'rgba(255,255,255,0.55)', border: 'rgba(255,255,255,0.45)' };
  return { color: 'var(--turquoise)', border: 'rgba(8,242,219,0.45)' };
}

export function emphasizeLastWord(title: string): string {
  const words = title.trim().split(/\s+/);
  if (!words.length || !words[0]) return '';
  if (words.length === 1) return `<span>${escapeHTML(words[0])}</span>`;
  const leading = escapeHTML(words.slice(0, -1).join(' '));
  const ending = escapeHTML(words[words.length - 1] ?? '');
  return `${leading} <span>${ending}</span>`;
}

export function renderHeroSlidesMarkup(slides: HeroSlide[]): string {
  return slides.map((slide, index) => {
    const type = escapeHTML(slide.type);
    const tagline = escapeHTML(slide.tagline);
    const hasImage = Boolean(slide.imageUrl);
    const ctaLabel = escapeHTML(slide.ctaLabel || 'Learn more');
    const ctaUrl = slide.ctaUrl ? escapeHTML(slide.ctaUrl) : '';
    const accent = getCarouselAccentConfig(slide.accent);
    const ctaHTML = ctaUrl
      ? `<a class="hero-slide-cta button button--sm button--on-dark" href="${ctaUrl}" target="_blank" rel="noopener">${ctaLabel}</a>`
      : '';
    const imageStyle = hasImage ? `background-image:url('${escapeHTML(slide.imageUrl ?? '')}');` : '';

    return `
      <article class="hero-slide${index === 0 ? ' active' : ''}" style="--slide-accent:${accent.color};--slide-accent-border:${accent.border};">
        <div class="hero-slide-image" style="${imageStyle}" role="${hasImage ? 'img' : 'presentation'}"${hasImage ? ` aria-label="${escapeHTML(slide.title)}"` : ''}></div>
        ${hasImage ? '' : '<div class="hero-slide-pattern" aria-hidden="true"></div>'}
        <div class="hero-slide-tint" aria-hidden="true"></div>
        <div class="hero-slide-gradient" aria-hidden="true"></div>
        <div class="hero-slide-content">
          ${type ? `<p class="hero-slide-eyebrow t-label">${type}</p>` : ''}
          <h3 class="hero-slide-title">${emphasizeLastWord(slide.title)}</h3>
          ${tagline ? `<p class="hero-slide-tagline">${tagline}</p>` : ''}
          ${ctaHTML}
        </div>
      </article>
    `;
  }).join('');
}

export function renderHeroCarouselMarkup(slides: HeroSlide[]): string {
  if (!slides.length) {
    return '<p class="hero-carousel-empty t-label">Updates appear here when there is something to share.</p>';
  }

  const dotsHTML = slides.map((_slide, index) => `
    <button class="hero-carousel-dot${index === 0 ? ' active' : ''}" type="button" data-index="${index}" aria-label="Go to slide ${index + 1}"></button>
  `).join('');

  return `
    <div class="hero-carousel-slides">${renderHeroSlidesMarkup(slides)}</div>
    <div class="hero-carousel-controls">
      <button type="button" class="hero-carousel-pause button button--sm button--on-dark" aria-pressed="false">Pause</button>
      <div class="hero-carousel-dots" role="tablist" aria-label="Featured updates">${dotsHTML}</div>
    </div>
    <div class="hero-carousel-progress" aria-hidden="true"></div>
  `;
}

function getStatusClass(statusValue: string): string {
  const status = statusValue.toLowerCase().trim();
  if (status === 'open') return 'badge--accent';
  if (status === 'upcoming') return 'badge--neutral';
  if (status === 'full') return 'badge--dark badge--closed';
  return 'badge--outline';
}

export function formatEventDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year || 0, (month || 1) - 1, day || 1);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function renderEventsEmptyMarkup(): string {
  return '<p class="events-empty">No public events are scheduled right now. The atelier is still at work. Leave an email if you want to hear when something opens.</p>';
}

export function renderEventsMarkup(events: EventItem[]): string {
  if (!events.length) return renderEventsEmptyMarkup();

  return events.map((event) => {
    const statusLabel = event.status.trim();
    const status = statusLabel.toLowerCase();
    const typeLabel = event.type.trim();
    const badgeClass = getStatusClass(statusLabel);
    const safeUrl = resolvePublicEventUrl(event.url);
    const hasUrl = Boolean(safeUrl);
    const badgeTag = (hasUrl && (status === 'open' || status === 'upcoming')) ? 'a' : 'div';
    const badgeHref = (badgeTag === 'a')
      ? `href="${escapeHTML(safeUrl ?? '')}" target="_blank" rel="noopener noreferrer"`
      : '';
    const formatted = formatEventDate(event.date);
    const [month = '', dayRaw = '', year = ''] = formatted.split(' ');
    const day = dayRaw.replace(',', '');

    return `
      <div class="events-item">
        <div class="events-date-block">
          <div class="events-date-day">${escapeHTML(day)}</div>
          <div class="events-date-month">${escapeHTML(month)} ${escapeHTML(year)}</div>
          <div class="events-time">${escapeHTML(event.time)}</div>
        </div>
        <div class="events-info">
          ${typeLabel ? `<span class="tag tag--accent events-type">${escapeHTML(typeLabel)}</span>` : ''}
          <div class="events-name">${escapeHTML(event.title)}</div>
          ${event.tagline ? `<div class="events-tagline">${escapeHTML(event.tagline)}</div>` : ''}
          ${event.location ? `<div class="events-where">${escapeHTML(event.location)}</div>` : ''}
        </div>
        <${badgeTag} class="badge events-badge ${badgeClass}" ${badgeHref}>${escapeHTML(statusLabel)}</${badgeTag}>
      </div>
    `;
  }).join('');
}

export function renderPastEventsEmptyMarkup(): string {
  return '<p class="events-empty">Past public encounters will appear here as the archive grows.</p>';
}

export function renderPastEventsMarkup(events: EventItem[]): string {
  if (!events.length) return renderPastEventsEmptyMarkup();

  return events.map((event) => {
    const typeLabel = event.type.trim();
    const safeUrl = resolvePublicEventUrl(event.url);
    const link = safeUrl
      ? `<a class="button button--accent button--sm" href="${escapeHTML(safeUrl)}"${safeUrl.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>View details</a>`
      : '';
    const formatted = formatEventDate(event.date);
    const [month = '', dayRaw = '', year = ''] = formatted.split(' ');
    const day = dayRaw.replace(',', '');

    return `
      <div class="events-item events-item--past">
        <div class="events-date-block">
          <div class="events-date-day">${escapeHTML(day)}</div>
          <div class="events-date-month">${escapeHTML(month)} ${escapeHTML(year)}</div>
          <div class="events-time">${escapeHTML(event.time)}</div>
        </div>
        <div class="events-info">
          ${typeLabel ? `<span class="tag tag--accent events-type">${escapeHTML(typeLabel)}</span>` : ''}
          <div class="events-name">${escapeHTML(event.title)}</div>
          ${event.tagline ? `<div class="events-tagline">${escapeHTML(event.tagline)}</div>` : ''}
          ${event.location ? `<div class="events-where">${escapeHTML(event.location)}</div>` : ''}
          ${link}
        </div>
      </div>
    `;
  }).join('');
}

export function renderArchiveMarkup(entries: ArchiveEntry[]): string {
  if (!entries.length) {
    return '<p class="archive-empty">Selected research appears here when curated projects are published.</p>';
  }

  return `
    <div class="archive-grid">
      ${entries.map((entry) => {
        const hasImage = Boolean(entry.imageUrl);
        const image = hasImage
          ? `<div class="archive-card-media" style="background-image:url('${escapeHTML(entry.imageUrl ?? '')}');" role="img" aria-label="${escapeHTML(entry.imageAlt || entry.title)}"></div>`
          : `<div class="archive-card-media archive-card-media--fallback" aria-hidden="true"><span class="archive-card-fallback-label t-label">${escapeHTML(entry.category || 'Research')}</span></div>`;
        const github = entry.githubUrl
          ? `<a class="archive-card-secondary" href="${escapeHTML(entry.githubUrl)}" target="_blank" rel="noopener">GitHub &#x2197;&#xFE0E;</a>`
          : '';
        return `
          <article class="archive-card">
            ${image}
            <div class="archive-card-body">
              <p class="archive-card-meta t-label">${escapeHTML(entry.category)}${entry.year ? ` · ${entry.year}` : ''}</p>
              <h3 class="archive-card-title">${escapeHTML(entry.title)}</h3>
              <p class="archive-card-desc">${escapeHTML(entry.description)}</p>
              <div class="archive-card-actions">
                <a class="button button--primary button--sm" href="${escapeHTML(entry.url)}" target="_blank" rel="noopener">Documentation &#x2197;&#xFE0E;</a>
                ${github}
              </div>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

export function renderArchiveSectionCta(): string {
  return `<a href="${escapeHTML(archiveCta.url)}" target="_blank" rel="noopener" class="button button--primary">${escapeHTML(archiveCta.label)} &#x2197;&#xFE0E;</a>`;
}

export function renderWorkstationsMarkup(entries: WorkstationEntry[]): string {
  if (!entries.length) {
    return '<p class="workstations-empty">Workstation descriptions appear here when published.</p>';
  }

  return `
    <div class="workstations-grid">
      ${entries.map((entry, index) => {
        const hasImage = Boolean(entry.imageUrl);
        const image = hasImage
          ? `<div class="workstation-card-media" style="background-image:url('${escapeHTML(entry.imageUrl ?? '')}');" role="img" aria-label="${escapeHTML(entry.imageAlt || entry.title)}"></div>`
          : `<div class="workstation-card-media workstation-card-media--fallback" aria-hidden="true"><span class="t-label">${String(index + 1).padStart(2, '0')}</span></div>`;
        return `
          <article class="workstation-card" id="workstation-${escapeHTML(entry.id)}">
            ${image}
            <div class="workstation-card-body">
              <p class="workstation-card-index t-label">${String(index + 1).padStart(2, '0')}</p>
              <h3 class="workstation-card-title">${escapeHTML(entry.title)}</h3>
              ${entry.tagline ? `<p class="workstation-card-tagline">${escapeHTML(entry.tagline)}</p>` : ''}
              <p class="workstation-card-desc">${escapeHTML(entry.description)}</p>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}
