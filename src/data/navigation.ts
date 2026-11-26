/**
 * Primary navigation. Only destinations that exist in the current phase
 * are listed. Future institutional routes stay in plannedRoutes until they
 * have real content — never link empty pages.
 */
export const navItems = [
  { href: '/about/', label: 'The School' },
  { href: '/#research', label: 'Research' },
  { href: '/#atelier', label: 'The Atelier' },
  { href: '/#programme', label: 'Programme' },
  { href: '/#gallery', label: 'Inverted Gallery' },
  { href: '/#collaborate', label: 'Collaborate' },
] as const;

export const homeHref = '/';
export const collaborateHref = '/#collaborate';

/** Prepared for later phases. Do not add to navItems until pages ship. */
export const plannedRoutes = [
  { href: '/research/', label: 'Research' },
  { href: '/atelier/', label: 'The Atelier' },
  { href: '/programme/', label: 'Programme' },
  { href: '/inverted-gallery/', label: 'Inverted Gallery' },
  { href: '/collaborate/', label: 'Collaborate' },
  { href: '/collaborate/wishlist/', label: 'Research Wishlist' },
  { href: '/collaborate/contributors/', label: 'Made possible by' },
] as const;
