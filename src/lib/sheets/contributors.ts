import { contributorCategories, contributorColumns } from './contract.ts';
import { parseCsvObjects } from './csv.ts';
import {
  isBlankRow,
  normalizeText,
  parseBoolean,
  parseInteger,
} from './normalize.ts';
import type { ContributorCategory, ContributorEntry, FeedResult } from './types.ts';
import { FeedValidationError } from './types.ts';
import { parseOptionalHttpUrl } from './urls.ts';

const categorySet = new Set<string>(contributorCategories);

function isEmptyContributorRow(row: Record<string, string>): boolean {
  const substantive = contributorColumns
    .filter((column) => column !== 'published')
    .map((column) => row[column] ?? '');
  return isBlankRow(substantive);
}

export function selectContributors(entries: ContributorEntry[]): ContributorEntry[] {
  return [...entries]
    .filter((entry) => entry.published)
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

export function groupContributorsByCategory(
  entries: ContributorEntry[],
  categoryOrder: readonly ContributorCategory[] = contributorCategories,
): Array<{ category: ContributorCategory; items: ContributorEntry[] }> {
  const published = selectContributors(entries);
  return categoryOrder
    .map((category) => ({
      category,
      items: published.filter((entry) => entry.category === category),
    }))
    .filter((group) => group.items.length > 0);
}

export function adaptContributorRows(rows: Record<string, string>[]): FeedResult<ContributorEntry> {
  const warnings: string[] = [];
  const items: ContributorEntry[] = [];
  const seen = new Set<string>();

  rows.forEach((row, index) => {
    if (isEmptyContributorRow(row)) return;

    const values = contributorColumns.map((column) => row[column] ?? '');
    if (isBlankRow(values)) return;

    const id = normalizeText(row.id);
    const name = normalizeText(row.name);
    if (!id && !name) return;

    if (!id) {
      throw new FeedValidationError(`Contributor row ${index + 2} is missing a stable id`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      throw new FeedValidationError(`Contributor row ${index + 2} has an unstable id`, [id]);
    }
    if (seen.has(id)) {
      throw new FeedValidationError(`Contributors contain duplicate id`, [id]);
    }
    seen.add(id);

    if (!name) {
      throw new FeedValidationError(`Contributor row ${index + 2} is missing a name`);
    }

    const category = normalizeText(row.category);
    if (!categorySet.has(category)) {
      throw new FeedValidationError(`Contributor row ${index + 2} has an unknown category`, [category]);
    }

    try {
      items.push({
        id,
        name,
        category: category as ContributorCategory,
        url: parseOptionalHttpUrl(row.url ?? '', 'url'),
        year: parseInteger(row.year ?? '', 'year'),
        order: parseInteger(row.order ?? '', 'order'),
        published: parseBoolean(row.published ?? '', 'published'),
      });
    } catch (error) {
      if (error instanceof FeedValidationError) {
        throw new FeedValidationError(`Contributor row ${index + 2}: ${error.message}`, error.details);
      }
      throw error;
    }
  });

  return { items, warnings };
}

export function parseContributorsCsv(csvText: string): FeedResult<ContributorEntry> {
  return adaptContributorRows(parseCsvObjects(csvText, contributorColumns));
}

export function parseAndSelectContributors(csvText: string): FeedResult<ContributorEntry> {
  const parsed = parseContributorsCsv(csvText);
  return {
    items: selectContributors(parsed.items),
    warnings: parsed.warnings,
  };
}
