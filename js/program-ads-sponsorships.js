/**
 * Program ads & sponsorship packages — Square Payment Links checkout.
 */

export const PROGRAM_ADS_PATH = "/support/program-ads-sponsorships/";

export const PROGRAM_ADS_CONTACT = {
  name: "Russell Coleman",
  email: "marketing@shakespeareonthesound.org",
  mailto: "mailto:marketing@shakespeareonthesound.org",
};

export const PROGRAM_ADS = {
  title: "Program Ads & Sponsorships",
  heading: "Program Ads & Sponsorships.",
  eyebrow: "Join & Give",
  intro: "Get your business noticed and support Shakespeare on the Sound.",
  seasonNote: [
    "Our 30th Anniversary season — Much Ado About Nothing",
    "17 performances: June 10–28 in Pinkney Park",
    "Playbills distributed to thousands of audience members",
    "Professional Broadway-style program read and kept by patrons as a show souvenir",
  ],
  ads: [
    {
      id: "ad-full-color",
      name: "Full Page Color",
      size: '4.25" × 7.25"',
      price: 1000,
    },
    {
      id: "ad-full-bw",
      name: "Full Page B&W",
      size: '4.25" × 7.25"',
      price: 500,
    },
    {
      id: "ad-half-color",
      name: "Half Page Color",
      size: '4.25" × 3.5"',
      price: 450,
    },
    {
      id: "ad-half-bw",
      name: "Half Page B&W",
      size: '4.25" × 3.5"',
      price: 250,
    },
    {
      id: "ad-quarter-v",
      name: "Quarter Page (Vertical) B&W",
      size: '2" × 3.5"',
      price: 150,
    },
    {
      id: "ad-quarter-h",
      name: "Quarter Page (Horizontal) B&W",
      size: '4.25" × 1.75"',
      price: 150,
    },
  ],
  sponsorships: [
    {
      id: "sponsor-title-season",
      name: "Title Sponsor — Summer Season",
      price: 20000,
      benefits: [
        "10 reserved seats with swag bags for opening night or one performance of choice",
        "8 additional High Back VIP reserved seats to use throughout production run",
        "Top billing on title page of program",
        "Prominent ad features on banner, advertising, website, and all social media",
      ],
    },
    {
      id: "sponsor-title-children",
      name: "Title Sponsor — Children's Program",
      price: 10000,
      benefits: [
        "Title billing in all children's program verbiage",
        "Multiple performances at area libraries and event spaces throughout the Spring",
        "Workshop with Associate Artistic Director",
      ],
    },
    {
      id: "sponsor-community-night",
      name: "Community Night Underwriter",
      price: 10000,
      benefits: [
        "Opportunity to bring SOS to a broader community by supporting Pay-as-you-can pricing",
        "Underwriter credit featured prominently in playbill, advertising, website and social media",
        "10 reserved High Back VIP seats with swag bags",
        "Introduce Tuesday night performances during the Curtain Speech",
      ],
    },
    {
      id: "sponsor-weekend",
      name: "Weekend Performance Sponsor",
      price: 7500,
      benefits: [
        "6 reserved High Back VIP seats with swag bags",
        "Introduce the performance during the Curtain Speech",
        "Sponsorship sticker on all playbills: Tonight's performance brought to you by _____",
      ],
    },
    {
      id: "sponsor-weeknight",
      name: "Weeknight Performance Sponsor",
      price: 5000,
      benefits: [
        "4 reserved High Back VIP seats with swag bags",
        "Introduce the performance during the Curtain Speech",
        "Sponsorship sticker on all playbills: Tonight's performance brought to you by _____",
      ],
    },
    {
      id: "sponsor-apprentice",
      name: "Apprentice Company Underwriter",
      price: 2500,
      benefits: [
        "More than one opportunity available",
        "Featured in advertising, website, social media",
        "Pizza party with apprentices",
        "Introduce the Understudy Run of the Apprentice Company matinee performance",
      ],
    },
  ],
};

export function formatProgramAdsPrice(dollars) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(dollars);
}

export function findProgramAdsItem(itemId) {
  const all = [...PROGRAM_ADS.ads, ...PROGRAM_ADS.sponsorships];
  return all.find((item) => item.id === itemId) || null;
}
