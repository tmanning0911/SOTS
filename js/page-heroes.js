import { MEDIA } from "./data.js";

/** Longest-prefix wins — maps inner page paths to cinematic hero imagery. */
const HERO_BY_PREFIX = [
  ["/education/", MEDIA.educationBanner],
  ["/support/donate/", MEDIA.donateImage],
  ["/events/", MEDIA.donateImage],
  ["/support/", MEDIA.donateImage],
  ["/news/", MEDIA.heroBanner],
  ["/shop/", MEDIA.heroBanner],
  ["/tickets/", MEDIA.heroHome],
  ["/my-tickets/", MEDIA.heroHome],
  ["/access-your-tickets/", MEDIA.heroHome],
  ["/about/visit/", MEDIA.heroHome],
  ["/about/faq/", MEDIA.heroHome],
  ["/about/contact/", MEDIA.heroBanner],
  ["/about/history/", MEDIA.heroHome],
  ["/about/mission-history/", MEDIA.heroHome],
  ["/about/", MEDIA.heroHome],
];

export function heroImageForHref(href) {
  if (!href) return MEDIA.heroHome;
  const match = HERO_BY_PREFIX.find(([prefix]) => href.startsWith(prefix));
  return match?.[1] ?? MEDIA.heroHome;
}
