/**
 * Live published endpoints. Do not rename columns or edit the sheet from code.
 * Phase 2 snapshot behaviour is specified in docs/feed-resilience.md.
 * Phase 1 still reads these URLs in the browser, as the current site does.
 */
export const canonicalSpreadsheetUrl =
  'https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit';

const publishedCsvBase =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSpM1GYZ-ohq9jHkppGkz4hCx_p3vuCDjekln1apcu1nV2KILUmDeoT3xeLTSprREAXWjiWY8AovP4y/pub';

export const heroCsvUrl = `${publishedCsvBase}?gid=1398027263&single=true&output=csv`;
export const eventsCsvUrl = `${publishedCsvBase}?gid=0&single=true&output=csv`;

export const heroColumns = [
  'type',
  'title',
  'tagline',
  'image_url',
  'cta_label',
  'cta_url',
  'accent',
] as const;

export const eventColumns = [
  'date',
  'time',
  'title',
  'tagline',
  'location',
  'type',
  'status',
  'url',
] as const;

export const eventsVisibleCount = 4;

export const formspreeAction = 'https://formspree.io/f/mvgbznoe';
