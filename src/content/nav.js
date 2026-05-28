/** Main navigation — shared by Navbar search and mobile menu */

export const navItems = [
  {
    label: 'Productions',
    path: '/plays',
    children: [
      { label: '2026 Season', path: '/plays', description: 'Much Ado About Nothing' },
      { label: 'Special Events', path: '/events', description: 'Gala, receptions & more' },
      { label: "Kids' Show", path: '/plays#kids-show-2026', description: 'Free in the park' },
    ],
  },
  { label: 'Learning', path: '/learning' },
  {
    label: 'News & Media',
    children: [
      { label: 'News', path: '/news', description: 'Season updates' },
      { label: 'Watch on YouTube', path: '/watch', description: 'Clips & highlights' },
    ],
  },
  { label: 'Support', path: '/support' },
  {
    label: 'About',
    children: [
      { label: 'About Us', path: '/about', description: 'Mission & team' },
      { label: 'Plan Your Visit', path: '/about#visit', description: 'Pinkney Park' },
      { label: 'FAQ', path: '/about#faq', description: 'Before you go' },
      { label: 'Contact', path: '/contact', description: 'Get in touch' },
    ],
  },
];

export const searchablePages = [
  { label: 'Productions', path: '/plays' },
  { label: 'Special Events', path: '/events' },
  { label: 'Learning & Education', path: '/learning' },
  { label: 'Support Us / Donate', path: '/support' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'News', path: '/news' },
  { label: 'Watch on YouTube', path: '/watch' },
];

export function isNavItemActive(item, pathname, hash = '') {
  if (item.path && pathname === item.path.split('#')[0]) {
    const itemHash = item.path.includes('#') ? item.path.split('#')[1] : '';
    if (!itemHash || hash === `#${itemHash}`) return true;
    if (!itemHash && !hash) return true;
  }
  return item.children?.some((child) => isNavItemActive(child, pathname, hash)) ?? false;
}
