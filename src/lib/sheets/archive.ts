import { archiveColumns, archiveVisibleCount } from './contract.ts';
import { parseCsvObjects } from './csv.ts';
import {
  isBlankRow,
  normalizeText,
  parseBoolean,
  parseInteger,
} from './normalize.ts';
import type { ArchiveEntry, FeedResult } from './types.ts';
import { FeedValidationError } from './types.ts';
import { parseHttpUrl, parseOptionalHttpUrl } from './urls.ts';

export function selectArchiveEntries(
  entries: ArchiveEntry[],
  limit = archiveVisibleCount,
): ArchiveEntry[] {
  return [...entries]
    .filter((entry) => entry.published && entry.featured)
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
    .slice(0, limit);
}

export function adaptArchiveRows(rows: Record<string, string>[]): FeedResult<ArchiveEntry> {
  const warnings: string[] = [];
  const items: ArchiveEntry[] = [];
  const seen = new Set<string>();

  rows.forEach((row, index) => {
    const values = archiveColumns.map((column) => row[column] ?? '');
    if (isBlankRow(values)) return;

    // Sheet templates often leave FALSE/FALSE filler rows with no id.
    const id = normalizeText(row.id);
    const title = normalizeText(row.title);
    if (!id && !title) return;

    if (!id) {
      throw new FeedValidationError(`Archive row ${index + 2} is missing a stable id`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      throw new FeedValidationError(`Archive row ${index + 2} has an unstable id`, [id]);
    }
    if (seen.has(id)) {
      throw new FeedValidationError(`Archive contains duplicate id`, [id]);
    }
    seen.add(id);

    if (!title) {
      throw new FeedValidationError(`Archive row ${index + 2} is missing a title`);
    }

    try {
      const imageUrl = parseOptionalHttpUrl(row.image_url ?? '', 'image_url');
      const imageAlt = normalizeText(row.image_alt) || null;
      if (imageUrl && !imageAlt) {
        warnings.push(`Archive entry ${id} has an image_url without image_alt`);
      }

      items.push({
        id,
        title,
        year: parseInteger(row.year ?? '', 'year'),
        category: normalizeText(row.category),
        description: normalizeText(row.description),
        imageUrl,
        imageAlt,
        url: parseHttpUrl(row.url ?? '', 'url'),
        githubUrl: parseOptionalHttpUrl(row.github_url ?? '', 'github_url'),
        featured: parseBoolean(row.featured ?? '', 'featured'),
        published: parseBoolean(row.published ?? '', 'published'),
        order: parseInteger(row.order ?? '', 'order'),
      });
    } catch (error) {
      if (error instanceof FeedValidationError) {
        throw new FeedValidationError(`Archive row ${index + 2}: ${error.message}`, error.details);
      }
      throw error;
    }
  });

  return { items, warnings };
}

export function parseArchiveCsv(csvText: string): FeedResult<ArchiveEntry> {
  return adaptArchiveRows(parseCsvObjects(csvText, archiveColumns));
}

export function parseAndSelectArchive(csvText: string): FeedResult<ArchiveEntry> {
  const parsed = parseArchiveCsv(csvText);
  return {
    items: selectArchiveEntries(parsed.items),
    warnings: parsed.warnings,
  };
}
