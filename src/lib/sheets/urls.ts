import { normalizeText } from './normalize.ts';
import { FeedValidationError } from './types.ts';

const UNSAFE = /^(javascript|data|vbscript|file):/i;

export function isUnsafeUrlScheme(value: string): boolean {
  return UNSAFE.test(normalizeText(value));
}

/** Absolute http(s) URLs only. Used for archive and remote media. */
export function parseHttpUrl(value: string, field: string): string {
  const normalized = normalizeText(value);
  if (!normalized) {
    throw new FeedValidationError(`Missing URL for ${field}`);
  }
  if (isUnsafeUrlScheme(normalized)) {
    throw new FeedValidationError(`Unsafe URL scheme for ${field}`, [normalized]);
  }
  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new FeedValidationError(`Invalid URL for ${field}`, [normalized]);
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new FeedValidationError(`URL for ${field} must use http or https`, [normalized]);
  }
  return normalized;
}

export function parseOptionalHttpUrl(value: string, field: string): string | null {
  const normalized = normalizeText(value);
  if (!normalized) return null;
  return parseHttpUrl(normalized, field);
}

/**
 * Existing hero/event contract: absolute http(s), site-relative paths, and
 * in-page hashes. Reject unsafe schemes.
 */
export function parseEditorialLink(value: string, field: string): string | null {
  const normalized = normalizeText(value);
  if (!normalized) return null;
  if (isUnsafeUrlScheme(normalized)) {
    throw new FeedValidationError(`Unsafe URL scheme for ${field}`, [normalized]);
  }
  if (normalized.startsWith('#') || normalized.startsWith('/')) return normalized;
  if (/^[a-z0-9._~/-]+\.html(?:#.*)?$/i.test(normalized)) return normalized;
  if (/^https?:\/\//i.test(normalized)) return parseHttpUrl(normalized, field);
  throw new FeedValidationError(`Unsupported URL for ${field}`, [normalized]);
}
