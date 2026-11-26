/**
 * Live published endpoints and column contracts.
 * Do not rename columns or edit the spreadsheet from code.
 */
export const canonicalSpreadsheetUrl =
  'https://docs.google.com/spreadsheets/d/1XIkDn7NrSSQbcVyYgrlcQxjFsOkraDdfJmI1qzaq54I/edit';

const publishedCsvBase =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSpM1GYZ-ohq9jHkppGkz4hCx_p3vuCDjekln1apcu1nV2KILUmDeoT3xeLTSprREAXWjiWY8AovP4y/pub';

export const heroCsvUrl = `${publishedCsvBase}?gid=1398027263&single=true&output=csv`;
export const eventsCsvUrl = `${publishedCsvBase}?gid=0&single=true&output=csv`;
export const archiveCsvUrl = `${publishedCsvBase}?gid=20271126&single=true&output=csv`;
export const workstationsCsvUrl = `${publishedCsvBase}?gid=20271127&single=true&output=csv`;
export const contributorsCsvUrl = `${publishedCsvBase}?gid=20271128&single=true&output=csv`;
export const wishlistCsvUrl = `${publishedCsvBase}?gid=20271129&single=true&output=csv`;

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

export const archiveColumns = [
  'id',
  'title',
  'year',
  'category',
  'description',
  'image_url',
  'image_alt',
  'url',
  'github_url',
  'featured',
  'published',
  'order',
] as const;

export const workstationColumns = [
  'id',
  'title',
  'tagline',
  'description',
  'image_url',
  'image_alt',
  'order',
  'published',
] as const;

export const contributorColumns = [
  'id',
  'name',
  'category',
  'url',
  'year',
  'order',
  'published',
] as const;

export const wishlistColumns = [
  'id',
  'title',
  'category',
  'description',
  'quantity',
  'image_url',
  'image_alt',
  'reference_url',
  'target_amount_chf',
  'status',
  'fulfilled_by',
  'fulfilled_year',
  'order',
  'published',
] as const;

/** Sheet category keys in default display order. Labels live in Markdown. */
export const contributorCategories = [
  'supporter',
  'institutional-support',
  'research-collaborator',
  'technology-partner',
] as const;

/** Wishlist category keys in default display order. Labels live in Markdown. */
export const wishlistCategories = [
  'equipment',
  'material',
  'access',
  'expertise',
  'time',
  'financial',
] as const;

export const wishlistStatuses = [
  'open',
  'in-progress',
  'fulfilled',
  'paused',
] as const;

export const eventsVisibleCount = 4;
export const eventsPastPreviewCount = 6;
export const archiveVisibleCount = 6;

export const archiveCta = {
  label: 'Explore the Research Archive',
  url: 'https://blog.linalopes.info/',
} as const;

export const formspreeAction = 'https://formspree.io/f/mvgbznoe';

export const feedClientTimeoutMs = 8000;

export const requiredFeeds = [
  'hero',
  'events',
  'archive',
  'workstations',
  'contributors',
  'wishlist',
] as const;

/** Confirmed editorial workstation titles. Inverted Gallery is not a workstation. */
export const workstationTitles = [
  'BioLab',
  'Makerspace',
  'Dirty Workshop',
  'Electronics Bench',
  'Wearables Lab',
  'Craft Office',
  'Studio',
  'Saloon',
] as const;
