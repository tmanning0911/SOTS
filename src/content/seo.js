import { site } from './site';

/** Canonical production URL — override with VITE_SITE_URL at build time */
export const siteUrl = (
  import.meta.env.VITE_SITE_URL || 'https://www.shakespeareonthesound.org'
).replace(/\/$/, '');

export const defaultOgImage = `${siteUrl}/images/hero-much-ado.png`;

export const seoDefaults = {
  siteName: site.name,
  titleTemplate: `%s | ${site.name}`,
  defaultTitle: `${site.name} | Outdoor Shakespeare in Fairfield County, CT`,
  defaultDescription:
    'Professional outdoor Shakespeare at Pinkney Park, Rowayton, CT. 2026 season: Much Ado About Nothing. Education programs, summer camps, and community theatre.',
  locale: 'en_US',
  twitterHandle: '@shakesonsound',
};

/** Per-route SEO (SPA paths) */
export const pageSeo = {
  '/': {
    title: seoDefaults.defaultTitle,
    description: seoDefaults.defaultDescription,
    path: '/',
  },
  '/plays': {
    title: 'Productions & Tickets — Much Ado About Nothing 2026',
    description:
      'See Much Ado About Nothing at Pinkney Park, Rowayton, CT. June 2026 — 16 performances under the stars. Get tickets via Eventbrite.',
    path: '/plays',
  },
  '/learning': {
    title: 'Education — Schools, Tours & Summer Camps',
    description:
      'Shakespeare education in Fairfield County: in-school workshops, touring shows, summer camps, and in-park programming at Pinkney Park.',
    path: '/learning',
  },
  '/support': {
    title: 'Support Us — Donate & Sponsorship',
    description:
      'Support Shakespeare on the Sound with a tax-deductible gift, sponsorship, or by joining our Much Ado About Something gala.',
    path: '/support',
  },
  '/about': {
    title: 'About Us — Mission, Visit & Contact',
    description:
      'Learn about Shakespeare on the Sound — 30 seasons of professional outdoor theatre in Rowayton, CT. Mission, visiting Pinkney Park, and contact info.',
    path: '/about',
  },
  '/contact': {
    title: 'Contact — Tickets, Education & Sponsorship',
    description:
      'Contact Shakespeare on the Sound for tickets, education bookings, sponsorship, and mailing list signup. Rowayton, CT.',
    path: '/contact',
  },
  '/news': {
    title: 'News & Updates',
    description:
      'Latest news from Shakespeare on the Sound — season announcements, education milestones, events, and community updates.',
    path: '/news',
  },
  '/news/:id': {
    title: 'News Article',
    description:
      'Latest news from Shakespeare on the Sound — season announcements, education milestones, events, and community updates.',
    path: '/news',
  },
  '/watch': {
    title: 'Watch on YouTube',
    description:
      'Watch clips, education features, and season highlights from Shakespeare on the Sound on our YouTube channel.',
    path: '/watch',
  },
  '/events': {
    title: 'Special Events — Gala & Season Highlights',
    description:
      'Much Ado About Something gala, opening night receptions, Pay-What-You-Will nights, and community events at Shakespeare on the Sound.',
    path: '/events',
  },
  '/on-demand': {
    title: 'Watch on YouTube',
    description:
      'Watch clips, education features, and season highlights from Shakespeare on the Sound on our YouTube channel.',
    path: '/watch',
    noindex: true,
  },
  '/shakespeare-hub': {
    title: 'Education Programs',
    description:
      'Shakespeare education in Fairfield County: in-school workshops, touring shows, summer camps, and in-park programming.',
    path: '/learning',
    noindex: true,
  },
  '/admin/login': {
    title: 'Admin Sign In',
    description: 'Content management sign in.',
    path: '/admin/login',
    noindex: true,
  },
  '/admin': {
    title: 'Admin',
    description: 'Content management.',
    path: '/admin',
    noindex: true,
  },
};

export const publicRoutes = Object.entries(pageSeo)
  .filter(([, meta]) => !meta.noindex)
  .map(([, meta]) => meta.path);

export function absoluteUrl(path = '/') {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${p === '/' ? '' : p}` || siteUrl;
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'PerformingArtsTheater',
    name: site.name,
    description: seoDefaults.defaultDescription,
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    image: defaultOgImage,
    email: site.email,
    telephone: site.phone,
    address: {
      '@type': 'PostalAddress',
      postOfficeBoxNumber: '15',
      addressLocality: 'Norwalk',
      addressRegion: 'CT',
      postalCode: '06853',
      addressCountry: 'US',
    },
    sameAs: [
      'https://www.facebook.com/ShakesOnSound',
      'https://www.instagram.com/shakesonsound/',
      'https://twitter.com/shakesonsound',
      'https://www.youtube.com/user/ShakespeareOnSound',
    ],
  };
}

export function buildArticleJsonLd({ title, description, path, datePublished, image }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    url: absoluteUrl(path),
    datePublished: datePublished || undefined,
    image: image ? absoluteUrl(image) : defaultOgImage,
    publisher: {
      '@type': 'Organization',
      name: seoDefaults.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`,
      },
    },
  };
}

export function buildEventJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TheaterEvent',
    name: 'Much Ado About Nothing — Shakespeare on the Sound',
    description:
      "Celebrate our 30th summer season with Shakespeare's Much Ado About Nothing at Pinkney Park, Rowayton, CT.",
    startDate: '2026-06-10',
    endDate: '2026-06-28',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Pinkney Park',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '177 Rowayton Avenue',
        addressLocality: 'Norwalk',
        addressRegion: 'CT',
        postalCode: '06853',
        addressCountry: 'US',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: site.name,
      url: siteUrl,
    },
    offers: {
      '@type': 'Offer',
      url: site.ticketsUrl,
      availability: 'https://schema.org/InStock',
    },
    image: defaultOgImage,
  };
}
