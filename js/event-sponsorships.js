/**
 * Standard sponsorship packages for public events (galas, fundraisers, specials).
 * Prices match the Mahjong Midsummer Classic sponsor ladder.
 */

export const STANDARD_EVENT_SPONSORS = [
  {
    id: "presenting",
    name: "Presenting sponsor",
    description: "Top billing, logo, verbal recognition, and premium guest seating",
    price: 2500,
  },
  {
    id: "community",
    name: "Community sponsor",
    description: "Logo, event recognition, and reserved guest seating",
    price: 1000,
  },
  {
    id: "table-sponsor",
    name: "Table sponsor",
    description: "Table sign, recognition, and a reserved table for your guests",
    price: 500,
  },
  {
    id: "supporting",
    name: "Supporting sponsor",
    description: "Listed online and at the event",
    price: 250,
  },
  {
    id: "friend",
    name: "Friend of SOTS",
    description: "Supporter recognition",
    price: 100,
  },
];

export function formatSponsorPrice(dollars) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(dollars);
}

export function formatSponsorCents(cents) {
  return formatSponsorPrice((Number(cents) || 0) / 100);
}

export function getStandardSponsor(id) {
  return STANDARD_EVENT_SPONSORS.find((s) => s.id === id) || null;
}

/** Clone standard tiers (optionally remapped descriptions). */
export function buildEventSponsors(overrides = {}) {
  return STANDARD_EVENT_SPONSORS.map((tier) => {
    const patch = overrides[tier.id];
    return patch ? { ...tier, ...patch } : { ...tier };
  });
}
