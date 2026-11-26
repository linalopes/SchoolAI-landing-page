import { heroColumns } from './contract.ts';
import { parseCsvObjects } from './csv.ts';
import { isBlankRow, normalizeText } from './normalize.ts';
import type { FeedResult, HeroAccent, HeroSlide } from './types.ts';
import { FeedValidationError } from './types.ts';
import { parseEditorialLink, parseOptionalHttpUrl } from './urls.ts';

function parseAccent(value: string): HeroAccent {
  const accent = normalizeText(value).toLowerCase();
  if (accent === 'pink' || accent === 'white' || accent === 'turquoise') return accent;
  if (!accent) return 'turquoise';
  throw new FeedValidationError('Invalid hero accent', [`got "${value}"`]);
}

export function adaptHeroRows(rows: Record<string, string>[]): FeedResult<HeroSlide> {
  const warnings: string[] = [];
  const items: HeroSlide[] = [];

  rows.forEach((row, index) => {
    const values = heroColumns.map((column) => row[column] ?? '');
    if (isBlankRow(values)) return;

    const title = normalizeText(row.title);
    if (!title) {
      throw new FeedValidationError(`Hero row ${index + 2} is missing a title`);
    }

    try {
      items.push({
        type: normalizeText(row.type),
        title,
        tagline: normalizeText(row.tagline),
        imageUrl: parseOptionalHttpUrl(row.image_url ?? '', 'image_url'),
        ctaLabel: normalizeText(row.cta_label) || 'Learn more',
        ctaUrl: parseEditorialLink(row.cta_url ?? '', 'cta_url'),
        accent: parseAccent(row.accent ?? ''),
      });
    } catch (error) {
      if (error instanceof FeedValidationError) {
        throw new FeedValidationError(`Hero row ${index + 2}: ${error.message}`, error.details);
      }
      throw error;
    }
  });

  return { items, warnings };
}

export function parseHeroCsv(csvText: string): FeedResult<HeroSlide> {
  return adaptHeroRows(parseCsvObjects(csvText, heroColumns));
}
