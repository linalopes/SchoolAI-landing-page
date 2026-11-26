/**
 * Architectural extension points for support features that are not published yet.
 * Wishlist Markdown collection and these routes stay unlinked until approved content exists.
 * Do not implement payment UI, endpoints or scripts in the current phase.
 */
export const supportRoutes = {
  wishlist: '/collaborate/wishlist/',
  contributors: '/collaborate/contributors/',
} as const;

/**
 * Future payment integrations (TWINT personal-contact QR and Stripe Payment Links).
 * Values remain null/empty until the owner confirms and approves publication.
 */
export const paymentExtensions = {
  twintPersonalContactQrUrl: null as string | null,
  stripePaymentLinks: [] as ReadonlyArray<{ label: string; url: string }>,
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
