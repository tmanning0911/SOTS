/**
 * Site-wide config — single source of truth (Clean Code JS: meaningful constants)
 */

export const SITE_URL = "https://www.shakespeareonthesound.org";

export const SITE_META = {
  name: "Shakespeare on the Sound",
  tagline: "Where Shakespeare Lives Now!",
  locale: "en_US",
  themeColor: "#0f2d4d",
  twitter: "@shakesonsound",
  ogImage:
    "https://static.wixstatic.com/media/2fda61_ed5498c346784fa7a58d686004f62ad1~mv2.jpg/v1/fill/w_1200,h_630,al_c,q_85,usm_0.66_1.00_0.01/2fda61_ed5498c346784fa7a58d686004f62ad1~mv2.jpg",
  favicon:
    "https://static.wixstatic.com/media/2fda61_2e65ecb094584570823c5e5c30d11c49~mv2.jpg/v1/fill/w_32,h_32,al_c,q_85/2fda61_2e65ecb094584570823c5e5c30d11c49~mv2.jpg",
  appleTouchIcon:
    "https://static.wixstatic.com/media/2fda61_2e65ecb094584570823c5e5c30d11c49~mv2.jpg/v1/fill/w_180,h_180,al_c,q_85/2fda61_2e65ecb094584570823c5e5c30d11c49~mv2.jpg",
};

export function absoluteUrl(path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean === "/" ? "" : clean.replace(/\/$/, "")}/`.replace(/\/\/$/, "/");
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "PerformingArtsTheater",
    name: SITE_META.name,
    url: SITE_URL,
    description: SITE_META.tagline,
    email: "contactus@shakespeareonthesound.org",
    telephone: "+1-203-957-1006",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Norwalk",
      addressRegion: "CT",
      postalCode: "06853",
      addressCountry: "US",
    },
    sameAs: [
      "https://www.facebook.com/ShakesOnSound",
      "https://www.instagram.com/shakesonsound/",
      "https://twitter.com/shakesonsound",
      "https://www.youtube.com/user/ShakespeareOnSound",
    ],
  };
}

export function buildFeaturedEventJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TheaterEvent",
    name: "Much Ado About Nothing",
    startDate: "2026-06-10",
    endDate: "2026-06-28",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Shakespeare in Pinkney Park",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Rowayton",
        addressRegion: "CT",
        addressCountry: "US",
      },
    },
    organizer: { "@type": "Organization", name: SITE_META.name, url: SITE_URL },
    offers: {
      "@type": "Offer",
      url: "https://www.shakespeareonthesound.org/productions/much-ado-about-nothing/",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/SoldOut",
    },
    image: SITE_META.ogImage,
  };
}
