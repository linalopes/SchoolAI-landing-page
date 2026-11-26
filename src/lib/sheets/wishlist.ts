import { wishlistCategories, wishlistColumns, wishlistStatuses } from './contract.ts';
import { parseCsvObjects } from './csv.ts';
import {
  isBlankRow,
  normalizeText,
  parseBoolean,
  parseInteger,
  parseOptionalInteger,
  parseOptionalPositiveNumber,
} from './normalize.ts';
import type {
  FeedResult,
  WishlistCategory,
  WishlistEntry,
  WishlistStatus,
} from './types.ts';
import { FeedValidationError } from './types.ts';
import { parseOptionalHttpUrl } from './urls.ts';

const categorySet = new Set<string>(wishlistCategories);
const statusSet = new Set<string>(wishlistStatuses);

function isEmptyWishlistRow(row: Record<string, string>): boolean {
  const substantive = wishlistColumns
    .filter((column) => column !== 'published')
    .map((column) => row[column] ?? '');
  return isBlankRow(substantive);
}

export function selectWishlist(entries: WishlistEntry[]): WishlistEntry[] {
  return [...entries]
    .filter((entry) => entry.published)
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

export function selectCurrentNeeds(entries: WishlistEntry[]): WishlistEntry[] {
  return selectWishlist(entries).filter(
    (entry) => entry.status === 'open' || entry.status === 'in-progress',
  );
}

export function selectFulfilledWishlist(entries: WishlistEntry[]): WishlistEntry[] {
  return selectWishlist(entries).filter((entry) => entry.status === 'fulfilled');
}

export function groupWishlistByCategory(
  entries: WishlistEntry[],
  categoryOrder: readonly WishlistCategory[] = wishlistCategories,
): Array<{ category: WishlistCategory; items: WishlistEntry[] }> {
  const current = selectCurrentNeeds(entries);
  return categoryOrder
    .map((category) => ({
      category,
      items: current.filter((entry) => entry.category === category),
    }))
    .filter((group) => group.items.length > 0);
}

export function adaptWishlistRows(rows: Record<string, string>[]): FeedResult<WishlistEntry> {
  const warnings: string[] = [];
  const items: WishlistEntry[] = [];
  const seen = new Set<string>();

  rows.forEach((row, index) => {
    if (isEmptyWishlistRow(row)) return;

    const values = wishlistColumns.map((column) => row[column] ?? '');
    if (isBlankRow(values)) return;

    const id = normalizeText(row.id);
    const title = normalizeText(row.title);
    if (!id && !title) return;

    if (!id) {
      throw new FeedValidationError(`Wishlist row ${index + 2} is missing a stable id`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      throw new FeedValidationError(`Wishlist row ${index + 2} has an unstable id`, [id]);
    }
    if (seen.has(id)) {
      throw new FeedValidationError(`Wishlist contains duplicate id`, [id]);
    }
    seen.add(id);

    if (!title) {
      throw new FeedValidationError(`Wishlist row ${index + 2} is missing a title`);
    }

    const description = normalizeText(row.description);
    if (!description) {
      throw new FeedValidationError(`Wishlist row ${index + 2} is missing a description`);
    }

    const category = normalizeText(row.category);
    if (!categorySet.has(category)) {
      throw new FeedValidationError(`Wishlist row ${index + 2} has an unknown category`, [category]);
    }

    const status = normalizeText(row.status);
    if (!statusSet.has(status)) {
      throw new FeedValidationError(`Wishlist row ${index + 2} has an unknown status`, [status]);
    }

    try {
      const imageUrl = parseOptionalHttpUrl(row.image_url ?? '', 'image_url');
      const imageAlt = normalizeText(row.image_alt) || null;
      if (imageUrl && !imageAlt) {
        throw new FeedValidationError(`image_alt is required when image_url is supplied`);
      }

      const fulfilledYear = parseOptionalInteger(row.fulfilled_year ?? '', 'fulfilled_year');
      if (fulfilledYear !== null && (fulfilledYear < 1900 || fulfilledYear > 2100)) {
        throw new FeedValidationError(`fulfilled_year is out of range`, [String(fulfilledYear)]);
      }

      items.push({
        id,
        title,
        category: category as WishlistCategory,
        description,
        quantity: normalizeText(row.quantity) || null,
        imageUrl,
        imageAlt,
        referenceUrl: parseOptionalHttpUrl(row.reference_url ?? '', 'reference_url'),
        targetAmountChf: parseOptionalPositiveNumber(row.target_amount_chf ?? '', 'target_amount_chf'),
        status: status as WishlistStatus,
        fulfilledBy: normalizeText(row.fulfilled_by) || null,
        fulfilledYear,
        order: parseInteger(row.order ?? '', 'order'),
        published: parseBoolean(row.published ?? '', 'published'),
      });
    } catch (error) {
      if (error instanceof FeedValidationError) {
        throw new FeedValidationError(`Wishlist row ${index + 2}: ${error.message}`, error.details);
      }
      throw error;
    }
  });

  return { items, warnings };
}

export function parseWishlistCsv(csvText: string): FeedResult<WishlistEntry> {
  return adaptWishlistRows(parseCsvObjects(csvText, wishlistColumns));
}

export function parseAndSelectWishlist(csvText: string): FeedResult<WishlistEntry> {
  const parsed = parseWishlistCsv(csvText);
  return {
    items: selectWishlist(parsed.items),
    warnings: parsed.warnings,
  };
}

export function formatWishlistAmountChf(amount: number): string {
  if (Number.isInteger(amount)) return `CHF ${amount}`;
  return `CHF ${amount.toFixed(2)}`;
}
