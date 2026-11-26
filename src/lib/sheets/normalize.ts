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

export function isBlankRow(values: Iterable<string>): boolean {
  for (const value of values) {
    if (normalizeText(value).length > 0) return false;
  }
  return true;
}
