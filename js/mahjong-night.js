/**
 * Mahjong Midsummer Classic — event content + Square Payment Links.
 */

export const MAHJONG_NIGHT_PATH = "/events/mahjong-night/";

export const MAHJONG_NIGHT = {
  title: "Mahjong Midsummer Classic",
  eyebrow: "Year-End Giving",
  intro:
    "Join us for the Mahjong Midsummer Classic, benefiting Shakespeare on the Sound’s Year-End Giving Campaign. Come play—experienced or brand new—and help support our mission.",
  note: "This is a social afternoon of play, not a tournament. Pull up a chair.",
  dateLabel: "Saturday, September 19, 2026",
  timeLabel: "11:00 AM–2:00 PM",
  venueName: "United Church of Rowayton Community Center",
  venueCity: "Rowayton, CT",
  venueAddress: "United Church of Rowayton Community Center, Rowayton, CT",
  bannerImage: "/images/mahjong-midsummer-classic-banner.png",
  contactPhone: "(203) 957-1006",
  contactPhoneHref: "tel:+12039571006",
  contactEmail: "contactus@shakespeareonthesound.org",
  donateHref: "/support/donate/",
  faqs: [
    {
      q: "Do I need to know how to play?",
      a: "No. The afternoon is beginner-friendly. Lesson seats are available if you want extra coaching.",
    },
    {
      q: "What should I bring?",
      a: "Yourself and a photo ID. We’ll set up tables for the afternoon and share any updates closer to the date.",
    },
  ],
  tickets: [
    {
      id: "individual",
      name: "Individual player",
      description: "One seat",
      price: 100,
      paymentLink: "https://square.link/u/sYXElfNO",
    },
    {
      id: "table",
      name: "Reserved table of four",
      description: "Hold a table for your group",
      price: 400,
      paymentLink: "https://square.link/u/D6CaPCTz",
    },
    {
      id: "patron",
      name: "Patron player",
      description: "Seat plus additional support for SOTS",
      price: 150,
      paymentLink: "https://square.link/u/vUHXO6wj",
    },
    {
      id: "beginner",
      name: "Beginner lesson seat",
      description: "Guided play if you’re new to the game",
      price: 125,
      limited: true,
      paymentLink: "https://square.link/u/2vhHywYJ",
    },
  ],
  sponsors: [
    {
      id: "presenting",
      name: "Presenting sponsor",
      description: "Top billing, logo, verbal recognition, two tables (8 seats)",
      price: 2500,
      paymentLink: "https://square.link/u/ZrS2MBBJ",
    },
    {
      id: "community",
      name: "Community sponsor",
      description: "Logo, event recognition, one table (4 seats)",
      price: 1000,
      paymentLink: "https://square.link/u/x7NnTN1M",
    },
    {
      id: "table-sponsor",
      name: "Table sponsor",
      description: "Table sign, recognition, one table (4 seats)",
      price: 500,
      paymentLink: "https://square.link/u/rZoYhlng",
    },
    {
      id: "tile",
      name: "Tile sponsor",
      description: "Listed online and at the event",
      price: 250,
      paymentLink: "https://square.link/u/KEKvfqDh",
    },
    {
      id: "friend",
      name: "Friend of SOTS",
      description: "Supporter recognition",
      price: 100,
      paymentLink: "https://square.link/u/yqmPAOPL",
    },
  ],
};

export function formatMahjongPrice(dollars) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(dollars);
}

export function formatMahjongCents(cents) {
  return formatMahjongPrice((Number(cents) || 0) / 100);
}

export function mahjongPaymentHref(item) {
  const url = item?.paymentLink?.trim();
  return url || null;
}
