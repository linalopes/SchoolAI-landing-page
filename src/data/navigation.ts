/**
 * Primary navigation. Only destinations with published content are listed.
 * Collaborate is the highlighted header CTA, not a text nav item.
 * Wishlist and contributors stay in plannedRoutes until approved content ships.
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

/** Footer destinations: primary nav plus Collaborate and external links. */
export const footerNavItems = [
  ...navItems,
  { href: collaborateHref, label: collaborateLabel },
] as const;

/** Prepared routes — not linked until pages and approved content exist. */
export const plannedRoutes = [
  { href: '/collaborate/wishlist/', label: 'Research Wishlist' },
  { href: '/collaborate/contributors/', label: 'Made possible by' },
] as const;
