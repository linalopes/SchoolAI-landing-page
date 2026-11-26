import { mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type {
  ArchiveEntry,
  EventItem,
  FeedId,
  FeedSnapshot,
  HeroSlide,
  WorkstationEntry,
} from './types.ts';
import { FeedValidationError } from './types.ts';

// Resolve from process.cwd() so Astro prerender bundles still find the
// committed snapshots. import.meta.url points inside dist/.prerender after build.
export const feedsDirectory = join(process.cwd(), 'src/data/feeds');

export function snapshotPath(feed: FeedId): string {
  return join(feedsDirectory, `${feed}.json`);
}

export function readSnapshotFile(feed: FeedId): string | null {
  try {
    return readFileSync(snapshotPath(feed), 'utf8');
  } catch {
    return null;
  }
}

export function snapshotExists(feed: FeedId): boolean {
  try {
    return statSync(snapshotPath(feed)).isFile();
  } catch {
    return false;
  }
}

export function snapshotAgeMs(feed: FeedId, now = Date.now()): number | null {
  try {
    return Math.max(0, now - statSync(snapshotPath(feed)).mtimeMs);
  } catch {
    return null;
  }
}

function assertSnapshotShape<T>(
  feed: FeedId,
  raw: unknown,
  validateItem: (item: unknown, index: number) => T,
): FeedSnapshot<T> {
  if (!raw || typeof raw !== 'object') {
    throw new FeedValidationError(`${feed} snapshot is not an object`);
  }
  const value = raw as Record<string, unknown>;
  if (value.feed !== feed) {
    throw new FeedValidationError(`${feed} snapshot feed id mismatch`, [String(value.feed)]);
  }
  if (typeof value.fetchedAt !== 'string' || Number.isNaN(Date.parse(value.fetchedAt))) {
    throw new FeedValidationError(`${feed} snapshot has an invalid fetchedAt`);
  }
  if (typeof value.sourceUrl !== 'string' || !value.sourceUrl.startsWith('https://')) {
    throw new FeedValidationError(`${feed} snapshot has an invalid sourceUrl`);
  }
  if (!Array.isArray(value.items)) {
    throw new FeedValidationError(`${feed} snapshot items must be an array`);
  }

  const items = value.items.map((item, index) => validateItem(item, index));
  return {
    feed,
    fetchedAt: value.fetchedAt,
    sourceUrl: value.sourceUrl,
    itemCount: items.length,
    items,
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function requireString(item: Record<string, unknown>, key: string, label: string): string {
  const value = item[key];
  if (typeof value !== 'string') {
    throw new FeedValidationError(`${label} is missing string field ${key}`);
  }
  return value;
}

function requireNullableString(item: Record<string, unknown>, key: string, label: string): string | null {
  const value = item[key];
  if (value === null) return null;
  if (typeof value !== 'string') {
    throw new FeedValidationError(`${label} has invalid field ${key}`);
  }
  return value;
}

export function parseHeroSnapshot(raw: unknown): FeedSnapshot<HeroSlide> {
  return assertSnapshotShape('hero', raw, (item, index) => {
    if (!isObject(item)) throw new FeedValidationError(`hero snapshot item ${index} is invalid`);
    const accent = requireString(item, 'accent', `hero item ${index}`);
    if (accent !== 'pink' && accent !== 'white' && accent !== 'turquoise') {
      throw new FeedValidationError(`hero snapshot item ${index} has an invalid accent`);
    }
    return {
      type: requireString(item, 'type', `hero item ${index}`),
      title: requireString(item, 'title', `hero item ${index}`),
      tagline: requireString(item, 'tagline', `hero item ${index}`),
      imageUrl: requireNullableString(item, 'imageUrl', `hero item ${index}`),
      ctaLabel: requireString(item, 'ctaLabel', `hero item ${index}`),
      ctaUrl: requireNullableString(item, 'ctaUrl', `hero item ${index}`),
      accent,
    };
  });
}

export function parseEventsSnapshot(raw: unknown): FeedSnapshot<EventItem> {
  return assertSnapshotShape('events', raw, (item, index) => {
    if (!isObject(item)) throw new FeedValidationError(`events snapshot item ${index} is invalid`);
    return {
      date: requireString(item, 'date', `events item ${index}`),
      time: requireString(item, 'time', `events item ${index}`),
      title: requireString(item, 'title', `events item ${index}`),
      tagline: requireString(item, 'tagline', `events item ${index}`),
      location: requireString(item, 'location', `events item ${index}`),
      type: requireString(item, 'type', `events item ${index}`),
      status: requireString(item, 'status', `events item ${index}`),
      url: requireNullableString(item, 'url', `events item ${index}`),
    };
  });
}

export function parseArchiveSnapshot(raw: unknown): FeedSnapshot<ArchiveEntry> {
  return assertSnapshotShape('archive', raw, (item, index) => {
    if (!isObject(item)) throw new FeedValidationError(`archive snapshot item ${index} is invalid`);
    const year = item.year;
    const order = item.order;
    if (typeof year !== 'number' || !Number.isInteger(year)) {
      throw new FeedValidationError(`archive snapshot item ${index} has an invalid year`);
    }
    if (typeof order !== 'number' || !Number.isInteger(order)) {
      throw new FeedValidationError(`archive snapshot item ${index} has an invalid order`);
    }
    if (typeof item.featured !== 'boolean' || typeof item.published !== 'boolean') {
      throw new FeedValidationError(`archive snapshot item ${index} has invalid booleans`);
    }
    return {
      id: requireString(item, 'id', `archive item ${index}`),
      title: requireString(item, 'title', `archive item ${index}`),
      year,
      category: requireString(item, 'category', `archive item ${index}`),
      description: requireString(item, 'description', `archive item ${index}`),
      imageUrl: requireNullableString(item, 'imageUrl', `archive item ${index}`),
      imageAlt: requireNullableString(item, 'imageAlt', `archive item ${index}`),
      url: requireString(item, 'url', `archive item ${index}`),
      githubUrl: requireNullableString(item, 'githubUrl', `archive item ${index}`),
      featured: item.featured,
      published: item.published,
      order,
    };
  });
}

export function loadHeroSnapshot(): FeedSnapshot<HeroSlide> {
  const text = readSnapshotFile('hero');
  if (!text) throw new FeedValidationError('Required hero snapshot is missing');
  return parseHeroSnapshot(JSON.parse(text));
}

export function loadEventsSnapshot(): FeedSnapshot<EventItem> {
  const text = readSnapshotFile('events');
  if (!text) throw new FeedValidationError('Required events snapshot is missing');
  return parseEventsSnapshot(JSON.parse(text));
}

export function loadArchiveSnapshot(): FeedSnapshot<ArchiveEntry> {
  const text = readSnapshotFile('archive');
  if (!text) throw new FeedValidationError('Required archive snapshot is missing');
  return parseArchiveSnapshot(JSON.parse(text));
}

export function parseWorkstationsSnapshot(raw: unknown): FeedSnapshot<WorkstationEntry> {
  return assertSnapshotShape('workstations', raw, (item, index) => {
    if (!isObject(item)) throw new FeedValidationError(`workstations snapshot item ${index} is invalid`);
    const order = item.order;
    if (typeof order !== 'number' || !Number.isInteger(order)) {
      throw new FeedValidationError(`workstations snapshot item ${index} has an invalid order`);
    }
    if (typeof item.published !== 'boolean') {
      throw new FeedValidationError(`workstations snapshot item ${index} has invalid published`);
    }
    return {
      id: requireString(item, 'id', `workstations item ${index}`),
      title: requireString(item, 'title', `workstations item ${index}`),
      tagline: requireString(item, 'tagline', `workstations item ${index}`),
      description: requireString(item, 'description', `workstations item ${index}`),
      imageUrl: requireNullableString(item, 'imageUrl', `workstations item ${index}`),
      imageAlt: requireNullableString(item, 'imageAlt', `workstations item ${index}`),
      order,
      published: item.published,
    };
  });
}

export function loadWorkstationsSnapshot(): FeedSnapshot<WorkstationEntry> {
  const text = readSnapshotFile('workstations');
  if (!text) throw new FeedValidationError('Required workstations snapshot is missing');
  return parseWorkstationsSnapshot(JSON.parse(text));
}

export function writeSnapshotAtomic<T>(snapshot: FeedSnapshot<T>): void {
  mkdirSync(feedsDirectory, { recursive: true });
  const target = snapshotPath(snapshot.feed);
  const temp = `${target}.${process.pid}.${Date.now()}.tmp`;
  const payload = `${JSON.stringify(snapshot, null, 2)}\n`;
  writeFileSync(temp, payload, 'utf8');
  renameSync(temp, target);
}

export function createSnapshot<T>(
  feed: FeedId,
  sourceUrl: string,
  items: T[],
  fetchedAt = new Date().toISOString(),
): FeedSnapshot<T> {
  return {
    feed,
    fetchedAt,
    sourceUrl,
    itemCount: items.length,
    items,
  };
}
