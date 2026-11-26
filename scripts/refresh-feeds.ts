#!/usr/bin/env node
/**
 * Fetch published Google Sheets CSV feeds, validate them, and replace
 * last-known-good snapshots atomically.
 *
 * Network failure with an existing snapshot: keep the snapshot, warn, exit 0.
 * Network failure without a snapshot: exit 1.
 * Invalid feed data: keep the previous snapshot, exit 1.
 */
import {
  archiveCsvUrl,
  createSnapshot,
  eventsCsvUrl,
  heroCsvUrl,
  parseAndSelectArchive,
  parseAndSelectWorkstations,
  parseEventsCsv,
  parseHeroCsv,
  readSnapshotFile,
  snapshotAgeMs,
  snapshotExists,
  workstationsCsvUrl,
  writeSnapshotAtomic,
  type FeedId,
} from '../src/lib/sheets/index.ts';

type RefreshOutcome = {
  feed: FeedId;
  status: 'updated' | 'unchanged' | 'kept-network' | 'invalid' | 'failed';
  message: string;
};

function editorialPayloadEqual(previous: unknown, next: { sourceUrl: string; items: unknown[] }): boolean {
  if (!previous || typeof previous !== 'object') return false;
  const prior = previous as { sourceUrl?: unknown; items?: unknown };
  return (
    prior.sourceUrl === next.sourceUrl
    && JSON.stringify(prior.items) === JSON.stringify(next.items)
  );
}

const FETCH_TIMEOUT_MS = 15000;

async function fetchText(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'text/csv,text/plain,*/*' },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

function ageLabel(feed: FeedId): string {
  const age = snapshotAgeMs(feed);
  if (age === null) return 'no snapshot';
  const hours = Math.round(age / 3_600_000);
  if (hours < 1) return 'age <1h';
  if (hours < 48) return `age ${hours}h`;
  return `age ${Math.round(hours / 24)}d`;
}

async function refreshOne(
  feed: FeedId,
  url: string,
  parse: (csv: string) => { items: unknown[]; warnings: string[] },
): Promise<RefreshOutcome> {
  let csv: string;
  try {
    csv = await fetchText(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (snapshotExists(feed)) {
      return {
        feed,
        status: 'kept-network',
        message: `${message}; kept existing snapshot (${ageLabel(feed)})`,
      };
    }
    return {
      feed,
      status: 'failed',
      message: `${message}; no valid snapshot`,
    };
  }

  try {
    const { items, warnings } = parse(csv);
    const next = createSnapshot(feed, url, items);
    const previousText = readSnapshotFile(feed);
    if (previousText) {
      try {
        const previous = JSON.parse(previousText);
        if (editorialPayloadEqual(previous, next)) {
          return {
            feed,
            status: 'unchanged',
            message: `editorial data unchanged; kept existing snapshot (${ageLabel(feed)})`,
          };
        }
      } catch {
        // If the previous file cannot be compared, fall through and write.
      }
    }
    writeSnapshotAtomic(next);
    return {
      feed,
      status: 'updated',
      message: `wrote ${items.length} items${warnings.length ? `; warnings: ${warnings.join(', ')}` : ''} (${ageLabel(feed)})`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (snapshotExists(feed)) {
      return {
        feed,
        status: 'invalid',
        message: `${message}; previous snapshot preserved (${ageLabel(feed)})`,
      };
    }
    return {
      feed,
      status: 'failed',
      message: `${message}; no valid snapshot`,
    };
  }
}

async function main(): Promise<void> {
  const outcomes = [
    await refreshOne('hero', heroCsvUrl, (csv) => parseHeroCsv(csv)),
    await refreshOne('events', eventsCsvUrl, (csv) => parseEventsCsv(csv)),
    await refreshOne('archive', archiveCsvUrl, (csv) => parseAndSelectArchive(csv)),
    await refreshOne('workstations', workstationsCsvUrl, (csv) => parseAndSelectWorkstations(csv)),
  ];

  for (const outcome of outcomes) {
    const prefix =
      outcome.status === 'updated' || outcome.status === 'unchanged' ? 'OK'
        : outcome.status === 'kept-network' ? 'WARN'
          : 'FAIL';
    console.log(`[${prefix}] ${outcome.feed}: ${outcome.message}`);
  }

  if (outcomes.some((outcome) => outcome.status === 'failed' || outcome.status === 'invalid')) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
