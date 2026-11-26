import type { CsvRow } from './types.ts';
import { FeedValidationError } from './types.ts';

/**
 * Shared CSV parser for Node and the browser.
 *
 * Decision: do not add csv-parse. That package is stream/Node-oriented and would
 * either force a second browser parser or pull Node APIs into the client bundle.
 * Hero and events refresh in the browser from the same contract as the refresh
 * script, so one standards-compliant parser is the smaller and safer surface.
 */
export function parseCsvRecords(csvText: string): string[][] {
  if (typeof csvText !== 'string') {
    throw new FeedValidationError('CSV input must be a string');
  }

  const text = csvText.replace(/^\uFEFF/, '');
  if (!text.trim()) return [];

  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let sawReturn = false;

  const pushField = () => {
    row.push(field);
    field = '';
  };

  const pushRow = () => {
    // A trailing blank line after the final newline is ignored.
    if (row.length === 1 && row[0] === '' && rows.length > 0) {
      row = [];
      return;
    }
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i] ?? '';

    if (sawReturn) {
      sawReturn = false;
      if (char === '\n') continue;
    }

    if (inQuotes) {
      if (char === '"') {
        const next = text[i + 1];
        if (next === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ',') {
      pushField();
      continue;
    }

    if (char === '\n') {
      pushField();
      pushRow();
      continue;
    }

    if (char === '\r') {
      pushField();
      pushRow();
      sawReturn = true;
      continue;
    }

    field += char;
  }

  if (inQuotes) {
    throw new FeedValidationError('Malformed CSV: unclosed quoted field');
  }

  if (field.length > 0 || row.length > 0) {
    pushField();
    pushRow();
  }

  return rows;
}

export function recordsToObjects(
  records: string[][],
  requiredHeaders: readonly string[],
): CsvRow[] {
  if (!records.length) {
    throw new FeedValidationError('CSV is empty');
  }

  const headerRecord = records[0] ?? [];
  const headers = headerRecord.map((header) => header.trim().toLowerCase());

  if (headers.some((header) => header.length === 0)) {
    throw new FeedValidationError('CSV header contains an empty column name');
  }

  const missing = requiredHeaders.filter((header) => !headers.includes(header));
  if (missing.length) {
    throw new FeedValidationError('CSV headers do not match the feed contract', [
      `missing ${missing.join(', ')}`,
      `found ${headers.join(', ')}`,
    ]);
  }

  return records.slice(1).map((cols, index) => {
    if (cols.length > headers.length) {
      throw new FeedValidationError(
        `Malformed CSV row ${index + 2}: expected at most ${headers.length} columns, found ${cols.length}`,
      );
    }

    const row: CsvRow = {};
    headers.forEach((header, columnIndex) => {
      row[header] = (cols[columnIndex] ?? '').trim();
    });
    return row;
  });
}

export function parseCsvObjects(
  csvText: string,
  requiredHeaders: readonly string[],
): CsvRow[] {
  return recordsToObjects(parseCsvRecords(csvText), requiredHeaders);
}
