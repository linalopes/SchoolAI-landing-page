import { workstationColumns } from './contract.ts';
import { parseCsvObjects } from './csv.ts';
import {
  isBlankRow,
  normalizeText,
  parseBoolean,
  parseInteger,
} from './normalize.ts';
import type { FeedResult, WorkstationEntry } from './types.ts';
import { FeedValidationError } from './types.ts';
import { parseOptionalHttpUrl } from './urls.ts';

export function selectWorkstations(entries: WorkstationEntry[]): WorkstationEntry[] {
  return [...entries]
    .filter((entry) => entry.published)
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

export function adaptWorkstationRows(rows: Record<string, string>[]): FeedResult<WorkstationEntry> {
  const warnings: string[] = [];
  const items: WorkstationEntry[] = [];
  const seen = new Set<string>();

  rows.forEach((row, index) => {
    const values = workstationColumns.map((column) => row[column] ?? '');
    if (isBlankRow(values)) return;

    const id = normalizeText(row.id);
    const title = normalizeText(row.title);
    if (!id && !title) return;

    if (!id) {
      throw new FeedValidationError(`Workstation row ${index + 2} is missing a stable id`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      throw new FeedValidationError(`Workstation row ${index + 2} has an unstable id`, [id]);
    }
    if (seen.has(id)) {
      throw new FeedValidationError(`Workstations contain duplicate id`, [id]);
    }
    seen.add(id);

    if (!title) {
      throw new FeedValidationError(`Workstation row ${index + 2} is missing a title`);
    }

    try {
      const imageUrl = parseOptionalHttpUrl(row.image_url ?? '', 'image_url');
      const imageAlt = normalizeText(row.image_alt) || null;
      if (imageUrl && !imageAlt) {
        warnings.push(`Workstation ${id} has an image_url without image_alt`);
      }

      items.push({
        id,
        title,
        tagline: normalizeText(row.tagline),
        description: normalizeText(row.description),
        imageUrl,
        imageAlt,
        order: parseInteger(row.order ?? '', 'order'),
        published: parseBoolean(row.published ?? '', 'published'),
      });
    } catch (error) {
      if (error instanceof FeedValidationError) {
        throw new FeedValidationError(`Workstation row ${index + 2}: ${error.message}`, error.details);
      }
      throw error;
    }
  });

  return { items, warnings };
}

export function parseWorkstationsCsv(csvText: string): FeedResult<WorkstationEntry> {
  return adaptWorkstationRows(parseCsvObjects(csvText, workstationColumns));
}

export function parseAndSelectWorkstations(csvText: string): FeedResult<WorkstationEntry> {
  const parsed = parseWorkstationsCsv(csvText);
  return {
    items: selectWorkstations(parsed.items),
    warnings: parsed.warnings,
  };
}
