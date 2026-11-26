/**
 * Primary navigation. Only destinations with published content are listed.
 * Remaining institutional routes stay in plannedRoutes until they ship.
 */
export const navItems = [
  { href: '/about/', label: 'The School' },
  { href: '/research/', label: 'Research' },
  { href: '/atelier/', label: 'The Atelier' },
  { href: '/#programme', label: 'Programme' },
  { href: '/#gallery', label: 'Inverted Gallery' },
  { href: '/#collaborate', label: 'Collaborate' },
] as const;

export const homeHref = '/';
export const collaborateHref = '/#collaborate';

/** Prepared routes — not linked until pages exist. */
export const plannedRoutes = [
  { href: '/programme/', label: 'Programme' },
  { href: '/inverted-gallery/', label: 'Inverted Gallery' },
  { href: '/collaborate/', label: 'Collaborate' },
  { href: '/collaborate/wishlist/', label: 'Research Wishlist' },
  { href: '/collaborate/contributors/', label: 'Made possible by' },
] as const;
