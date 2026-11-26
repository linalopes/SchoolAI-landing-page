import { getEntry } from 'astro:content';

export async function requirePage(id: string) {
  const entry = await getEntry('pages', id);
  if (!entry) {
    throw new Error(`Missing Markdown source: src/content/pages/${id}.md`);
  }
  return entry;
}

export async function requireGalleryDoc(id: string) {
  const entry = await getEntry('gallery', id);
  if (!entry) {
    throw new Error(`Missing Markdown source: src/content/gallery/${id}.md`);
  }
  return entry;
}

export async function requireSupportDoc(id: string) {
  const entry = await getEntry('support', id);
  if (!entry) {
    throw new Error(`Missing Markdown source: src/content/support/${id}.md`);
  }
  return entry;
}

export async function requireSiteDoc(id: string) {
  const entry = await getEntry('site', id);
  if (!entry) {
    throw new Error(`Missing Markdown source: src/content/site/${id}.md`);
  }
  return entry;
}

export function mailtoHref(email: string, subject?: string): string {
  if (!subject) return `mailto:${email}`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

export function resolveCtaHref(
  href: string,
  options: { email: string; subject?: string } | undefined = undefined,
): string {
  if (href === 'mailto' && options) {
    return mailtoHref(options.email, options.subject);
  }
  return href;
}

export function sortPhotos<T extends { order?: number }>(photos: T[]): T[] {
  return [...photos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function formatChf(amount: number): string {
  return new Intl.NumberFormat('de-CH', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount);
}
