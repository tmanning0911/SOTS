/** Orpheum-style mega navigation — grouped columns + featured event card */
import { site } from './site';

export const utilityLinks = [
  { label: 'Pinkney Park', path: '/about#visit' },
  { label: 'About', path: '/about' },
  { label: 'News', path: '/news' },
  { label: 'Contact', path: '/contact' },
  { label: 'Watch', path: '/watch' },
];

export const navItems = [
  {
    label: 'Events & Tickets',
    path: '/plays',
    mega: true,
    groups: [
      {
        title: '2026 Season',
        links: [
          { label: 'Much Ado About Nothing', path: '/plays', description: 'June 10–28 · Main Stage' },
          { label: "Kids' Show", path: '/plays#kids-show-2026', description: 'Free · 6:30pm nightly' },
          { label: 'Special Events', path: '/events', description: 'Gala & receptions' },
          { label: 'All Productions', path: '/plays' },
        ],
      },
      {
        title: 'Ticket Information',
        links: [
          { label: 'Get Tickets', path: site.ticketsUrl, external: true },
          { label: 'Pay-What-You-Will', path: '/events#pay-what-you-will' },
          { label: 'Opening Night Reception', path: '/events#opening-night' },
          { label: 'Ticket Policies', path: '/about#faq' },
        ],
      },
    ],
    featured: {
      title: 'Much Ado About Nothing',
      tag: 'Main Stage · On Sale',
      date: 'June 10–28, 2026',
      image: '/images/hero-much-ado.jpg',
      path: '/plays',
    },
  },
  {
    label: 'Plan Your Visit',
    mega: true,
    groups: [
      {
        title: 'Before You Go',
        links: [
          { label: 'Directions & Parking', path: '/about#visit' },
          { label: 'FAQ', path: '/about#faq' },
          { label: '2026 Schedule', path: '/plays' },
          { label: 'Weather & Cancellations', path: '/about#faq' },
        ],
      },
      {
        title: 'Box Office',
        links: [
          { label: site.phone, path: `tel:${site.phone.replace(/\D/g, '')}`, description: site.phoneNote },
          { label: 'Contact Us', path: '/contact' },
        ],
      },
    ],
    featured: {
      title: 'Pinkney Park',
      tag: 'Rowayton, CT',
      date: 'Gates open 4pm · Show 7:30pm',
      image: '/images/park-performance.jpg',
      path: '/about#visit',
    },
  },
  {
    label: 'Education & Community',
    path: '/learning',
    mega: true,
    groups: [
      {
        title: 'School Programs',
        links: [
          { label: 'In-School Workshops', path: '/learning' },
          { label: 'Book a School Visit', path: '/contact?topic=education' },
          { label: 'Teacher Resources', path: '/learning' },
        ],
      },
      {
        title: 'Youth & Family',
        links: [
          { label: 'Summer Camps', path: '/learning' },
          { label: "Kids' Show in the Park", path: '/plays#kids-show-2026' },
          { label: 'Education Tent', path: '/about#visit' },
        ],
      },
    ],
    featured: {
      title: 'Shakespeare for Kids',
      tag: 'Education',
      date: 'Free · 6:30pm before every show',
      image: '/images/news/shakespeare-for-kids.jpg',
      path: '/learning',
    },
  },
  {
    label: 'Support Our Mission',
    path: '/support',
    mega: true,
    groups: [
      {
        title: 'Ways to Give',
        links: [
          { label: 'Donate', path: site.donateUrl, external: true },
          { label: 'Corporate Sponsorship', path: '/support' },
          { label: 'Gala 2026', path: '/events#gala-2026' },
          { label: 'Join the Committee', path: '/contact?topic=sponsorship' },
        ],
      },
      {
        title: 'Community',
        links: [
          { label: 'Our Partners', path: '/#sponsors' },
          { label: 'Volunteer', path: '/contact' },
          { label: 'Mailing List', path: '/#email-signup' },
        ],
      },
    ],
    featured: {
      title: 'Much Ado About Something',
      tag: 'Annual Gala',
      date: 'October 16, 2026',
      image: '/images/news/gala-2026.jpg',
      path: '/events#gala-2026',
    },
  },
];

export const searchablePages = [
  { label: 'Productions', path: '/plays' },
  { label: "Kids' Show", path: '/plays#kids-show-2026' },
  { label: 'Special Events', path: '/events' },
  { label: 'Annual Gala', path: '/events#gala-2026' },
  { label: 'Plan Your Visit', path: '/about#visit' },
  { label: 'FAQ', path: '/about#faq' },
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
  const allLinks = [
    ...(item.children || []),
    ...(item.groups || []).flatMap((g) => g.links),
    ...(item.featured?.path ? [{ path: item.featured.path }] : []),
  ];
  return allLinks.some((link) => {
    const [target, targetHash = ''] = (link.path || '').split('#');
    if (pathname !== target) return false;
    if (!targetHash) return !hash;
    return hash === `#${targetHash}`;
  });
}
