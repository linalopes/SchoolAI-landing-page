/**
 * Primary navigation. Only destinations with published content are listed.
 * Collaborate is the highlighted header CTA, not a text nav item.
 * Research Wishlist lives under Collaborate and is not a primary nav item.
 */
export const navItems = [
  { href: '/about/', label: 'About' },
  { href: '/research/', label: 'Research' },
  { href: '/atelier/', label: 'Atelier' },
  { href: '/programme/', label: 'Programme' },
  { href: '/inverted-gallery/', label: 'Inverted Gallery' },
] as const;

export const homeHref = '/';
export const collaborateHref = '/collaborate/';
export const collaborateLabel = 'Collaborate';
export const wishlistHref = '/collaborate/wishlist/';

/** Footer destinations: primary nav plus Collaborate and external links. */
export const footerNavItems = [
  ...navItems,
  { href: collaborateHref, label: collaborateLabel },
] as const;

/** Secondary routes linked from Collaborate, not from the primary nav. */
export const plannedRoutes = [] as const;
