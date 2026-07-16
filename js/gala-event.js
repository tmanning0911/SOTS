/**
 * Much Ado About Something — annual gala tickets + Square checkout.
 */

export const GALA_PATH = "/events/much-ado-about-something/";

export const GALA_EVENT = {
  title: "Much Ado About Something",
  eyebrow: "Annual Gala",
  intro:
    "Join us for cocktails, delicious bites, dancing, and live and silent auctions in support of Shakespeare on the Sound — a beautiful evening for the season ahead.",
  dateLabel: "Friday, October 16, 2026",
  timeLabel: "6:00–10:00 PM",
  venueName: "The House Up on the Hill",
  venueCity: "26 Seir Hill Rd., Norwalk, CT",
  venueAddress: "The House Up on the Hill, 26 Seir Hill Road, Norwalk, CT 06850",
  image: "/images/much-ado-about-something-gala-poster.jpg",
  contactPhone: "(203) 957-1006",
  contactPhoneHref: "tel:+12039571006",
  contactEmail: "aaron@shakespeareonthesound.org",
  donateHref: "/support/donate/",
  committeeHref: "/about/contact/",
  faqs: [
    {
      q: "Can I buy a table?",
      a: "Yes — table packages hold eight seats together and are ideal for friends, families, and corporate hosts.",
    },
    {
      q: "Want to help plan the night?",
      a: "Join the gala committee through the contact form linked on this page.",
    },
  ],
  /** All ticket prices must stay above $100 for this fundraiser. */
  tickets: [
    {
      id: "individual",
      name: "Individual ticket",
      description: "One guest — cocktails, bites, dancing & auctions",
      price: 175,
    },
    {
      id: "pair",
      name: "Pair",
      description: "Two guests for the evening",
      price: 325,
    },
    {
      id: "patron",
      name: "Patron ticket",
      description: "Preferred seating plus recognition in the program",
      price: 500,
    },
    {
      id: "table",
      name: "Table of eight",
      description: "Reserved table for eight guests",
      price: 2000,
    },
  ],
};

export function formatGalaPrice(dollars) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(dollars);
}

export function formatGalaCents(cents) {
  return formatGalaPrice((Number(cents) || 0) / 100);
}

export function buildGalaCatalog() {
  return [...GALA_EVENT.tickets];
}

export function getGalaCatalogItem(id) {
  return buildGalaCatalog().find((item) => item.id === id) || null;
}
