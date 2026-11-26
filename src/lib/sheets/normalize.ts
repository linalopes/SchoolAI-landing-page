import { FeedValidationError } from './types.ts';

export function normalizeText(value: string | undefined | null): string {
  return String(value ?? '').replace(/\r\n/g, '\n').trim();
}

export function parseBoolean(value: string, field: string): boolean {
  const normalized = normalizeText(value).toUpperCase();
  if (normalized === 'TRUE' || normalized === 'FALSE') return normalized === 'TRUE';
  throw new FeedValidationError(`Invalid boolean for ${field}`, [`got "${value}"`]);
}

export function parseOptionalBoolean(value: string, field: string): boolean | null {
  const normalized = normalizeText(value);
  if (!normalized) return null;
  return parseBoolean(normalized, field);
}

export function parseInteger(value: string, field: string): number {
  const normalized = normalizeText(value);
  if (!/^-?\d+$/.test(normalized)) {
    throw new FeedValidationError(`Invalid integer for ${field}`, [`got "${value}"`]);
  }
  return Number.parseInt(normalized, 10);
}

export function parseOptionalInteger(value: string, field: string): number | null {
  const normalized = normalizeText(value);
  if (!normalized) return null;
  return parseInteger(normalized, field);
}

/** Optional positive CHF amounts; blank stays null. */
export function parseOptionalPositiveNumber(value: string, field: string): number | null {
  const normalized = normalizeText(value).replace(/,/g, '');
  if (!normalized) return null;
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) {
    throw new FeedValidationError(`Invalid number for ${field}`, [`got "${value}"`]);
  }
  const amount = Number.parseFloat(normalized);
  if (!(amount > 0)) {
    throw new FeedValidationError(`Expected a positive number for ${field}`, [`got "${value}"`]);
  }
  return amount;
}

export function isBlankRow(values: Iterable<string>): boolean {
  for (const value of values) {
    if (normalizeText(value).length > 0) return false;
  }
  return true;
}
