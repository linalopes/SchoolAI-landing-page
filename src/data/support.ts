/**
 * Architectural extension points for unpublished support routes.
 * Financial support copy and payment options live in
 * src/content/support/financial-support.md.
 */
export const supportRoutes = {
  wishlist: '/collaborate/wishlist/',
  contributors: '/collaborate/contributors/',
} as const;

/** Contributor credits stay unpublished without explicit permission. */
export const contributorsExtension = {
  published: false,
  categories: [
    'research-collaborator',
    'institutional-partner',
    'technology-partner',
    'supporter',
  ] as const,
} as const;
