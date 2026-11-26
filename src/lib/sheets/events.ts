import { eventColumns, eventsVisibleCount } from './contract.ts';
import { parseCsvObjects } from './csv.ts';
import { isBlankRow, normalizeText } from './normalize.ts';
import type { EventItem, FeedResult } from './types.ts';
import { FeedValidationError } from './types.ts';
import { parseEditorialLink } from './urls.ts';

export function isVisibleEventStatus(statusValue: string): boolean {
  const status = normalizeText(statusValue).toLowerCase();
  return status !== 'cancel' && status !== 'cancelled' && status !== 'canceled' && status !== 'past';
}

export function sortEventItems(events: EventItem[]): EventItem[] {
  return [...events].sort((a, b) => {
    const aDate = Date.parse(a.date || '');
    const bDate = Date.parse(b.date || '');
    if (Number.isNaN(aDate) && Number.isNaN(bDate)) return 0;
    if (Number.isNaN(aDate)) return 1;
    if (Number.isNaN(bDate)) return -1;
    return aDate - bDate;
  });
}

export function selectUpcomingEvents(events: EventItem[], limit = eventsVisibleCount): EventItem[] {
  return sortEventItems(events.filter((event) => isVisibleEventStatus(event.status))).slice(0, limit);
}

export function adaptEventRows(rows: Record<string, string>[]): FeedResult<EventItem> {
  const warnings: string[] = [];
  const items: EventItem[] = [];

  rows.forEach((row, index) => {
    const values = eventColumns.map((column) => row[column] ?? '');
    if (isBlankRow(values)) return;

    const title = normalizeText(row.title);
    if (!title) {
      throw new FeedValidationError(`Events row ${index + 2} is missing a title`);
    }

    try {
      items.push({
        date: normalizeText(row.date),
        time: normalizeText(row.time),
        title,
        tagline: normalizeText(row.tagline),
        location: normalizeText(row.location),
        type: normalizeText(row.type),
        status: normalizeText(row.status),
        url: parseEditorialLink(row.url ?? '', 'url'),
      });
    } catch (error) {
      if (error instanceof FeedValidationError) {
        throw new FeedValidationError(`Events row ${index + 2}: ${error.message}`, error.details);
      }
      throw error;
    }
  });

  return { items, warnings };
}

export function parseEventsCsv(csvText: string): FeedResult<EventItem> {
  return adaptEventRows(parseCsvObjects(csvText, eventColumns));
}
