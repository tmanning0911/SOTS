export const SITE = {
  name: "Shakespeare on the Sound",
  tagline: "Where Shakespeare Lives Now!",
  email: "contactus@shakespeareonthesound.org",
  boxOffice: "(203) 957-1006",
  address: "PO Box 15, Norwalk, CT, 06853",
  educationContact: "stephanie@shakespeareonthesound.org",
  educationDirectorName: "Stephanie Eiss, Director of Education and Outreach",
  ticketsUrl: "/tickets/",
  donateUrl: "/support/donate/",
  shopUrl: "/shop/",
  accountUrl: "/my-tickets/",
};

function wix(file, w, h) {
  return `https://static.wixstatic.com/media/${file}/v1/fill/w_${w},h_${h},al_c,q_85,usm_0.66_1.00_0.01/${file}`;
}

function wixFit(file, w, h) {
  return `https://static.wixstatic.com/media/${file}/v1/fit/w_${w},h_${h},al_c,q_90,enc_auto/${file}`;
}

export const MEDIA = {
  logo: "/images/sots-logo-lockup.png",
  // Real Pinkney Park production photo — not the painterly Much Ado promo art
  heroHome: "/images/park-performance.jpg",
  heroBanner: wix("2fda61_ed5498c346784fa7a58d686004f62ad1~mv2.jpg", 1970, 667),
  muchAdoPoster: wix("2fda61_52a2b5db62ea4c22b8da935de226b8de~mv2.jpg", 450, 712),
  galaImage: "/images/much-ado-about-something-gala-poster.jpg",
  donateImage: "/images/backgrounds/kids-performance.jpg",
  kidsImage: "/images/news/kids-kings.jpg",
  educationImage: "/images/learning/kids-classroom.jpeg",
  educationBanner: wix("2fda61_40d7e102e7e34217993b1143d8e3eb6b~mv2.jpg", 1970, 667),
  staLogo: wix("2fda61_f444735fb7654e17aa6d16f529efd25f~mv2.jpg", 200, 80),
  heroVideo: "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4",
};

export const HERO_HOME = {
  brand: "Shakespeare on the Sound",
  tagline: "Where Shakespeare Lives Now",
  titleLines: ["Shakespeare", "on the Sound"],
  titleLastLine: "Where Shakespeare",
  titleHighlight: "Lives Now",
  ctaLabel: "What's Next",
  ctaHref: "/events/",
  ctaExternal: false,
};

export const SEASON_PROMO = {
  eyebrow: "Season 2026",
  heading: "What's Next",
  title: "What's Next",
  seasonLabel: "Season 2026",
  body:
    "After a landmark summer of Much Ado About Nothing under the stars in Pinkney Park, Shakespeare on the Sound continues with community events, education, and our annual gala — sustaining affordable outdoor Shakespeare for Fairfield County.",
  emphasis: "affordable outdoor Shakespeare for Fairfield County",
  ctaLabel: "Experience the Season",
  ctaHref: "/events/",
  ctaExternal: false,
  showId: "gala",
  // Live outdoor Shakespeare — period costumes on the Pinkney stage
  image: "/images/backgrounds/history-heritage.jpg",
};

/** Collage-style performance date cards for the homepage sidebar (2 keeps SEE ALL bar in view) */
export const HOME_SHOW_CARDS = [
  {
    id: "gala-2026",
    month: "Oct",
    day: "16",
    title: "Much Ado About Something — Annual Gala",
    venue: "Norwalk, CT",
    time: "6:00 PM",
    image: "/images/park-performance.jpg",
    href: "/events/much-ado-about-something/",
    ticketsHref: "/events/much-ado-about-something/#tickets",
    ctaLabel: "Get Tickets",
  },
  {
    id: "mahjong-2026",
    month: "Sep",
    day: "19",
    title: "Mahjong Midsummer Classic",
    venue: "Rowayton, CT",
    time: "11:00 AM",
    image: "/images/mahjong-midsummer-classic-poster.jpg",
    href: "/events/mahjong-night/",
    ticketsHref: "/events/mahjong-night/",
    ctaLabel: "Get Tickets",
  },
];

export const HOME_FOR_EVERYONE = {
  headline: "Shakespeare is for every",
  highlight: "one",
  subhead: "From first graders to lifelong learners, we've got you covered.",
};

export const HOME_PROGRAMS = [
  {
    id: "schools",
    kind: "image",
    title: "Where learning begins.",
    image: "/images/learning/kids-classroom.jpeg",
    href: "/education/in-schools/",
  },
  {
    id: "schools-copy",
    kind: "copy",
    body:
      "Our in-school workshops and residencies bring professional teaching artists into Fairfield County classrooms — building confidence, literacy, and a love of live theatre.",
    ctaLabel: "Learn More",
    ctaHref: "/education/in-schools/",
  },
  {
    id: "camps",
    kind: "image",
    title: "Summer Camps",
    image: "/images/news/kids-kings.jpg",
    href: "/education/summer-camps/",
    badge: "Camps",
  },
  {
    id: "camps-copy",
    kind: "copy",
    body:
      "Hands-on summer camps immerse young artists in Shakespeare’s language, stagecraft, and ensemble play in a welcoming, creative environment.",
    ctaLabel: "Learn More",
    ctaHref: "/education/summer-camps/",
  },
  {
    id: "adult",
    kind: "image",
    title: "Adult Enrichment",
    image: "/images/backgrounds/outdoor-audience.jpg",
    href: "/education/adult-enrichment/",
  },
  {
    id: "adult-copy",
    kind: "copy",
    body:
      "Classes and community programs for adults who want to explore text, performance, and the joy of Shakespeare — no prior experience required.",
    ctaLabel: "Sign Up",
    ctaHref: "/education/adult-enrichment/",
  },
  {
    id: "park",
    kind: "image",
    title: "In the Park",
    image: "/images/backgrounds/kids-performance.jpg",
    href: "/education/in-the-park/",
  },
  {
    id: "park-copy",
    kind: "copy",
    body:
      "Family-friendly park programs and Shakespeare for kids turn Pinkney Park into a classroom under the sky — picnic blankets welcome.",
    ctaLabel: "Learn More",
    ctaHref: "/education/in-the-park/",
  },
];

export const HOME_STORY_CTAS = [
  {
    id: "membership",
    eyebrow: "Support",
    title: "Be a part of the story",
    body:
      "Join the patrons who make affordable outdoor Shakespeare possible — and stay closer to the artists, students, and community we serve.",
    ctaLabel: "Explore Ways to Give",
    ctaHref: "/support/individual-giving/",
    // Brighter park audience still so the dark Collage-style top title stays readable
    image: "/images/backgrounds/kids-performance.jpg",
  },
  {
    id: "donate",
    eyebrow: "Donate",
    title: "Move our work forward",
    body:
      "Support our mission to keep Shakespeare alive on the Sound with a gift of any size.",
    ctaLabel: "Donate Today",
    ctaHref: "/support/donate/",
    image: "/images/park-performance.jpg",
  },
];

export const HOME_NEWSLETTER = {
  title: "Want to join the Shakespeare on the Sound community?",
  body:
    "Sign up for announcements on productions, education programs, special events, and ways to support the season.",
  ctaLabel: "Sign Up Here",
  ctaHref: "#newsletter",
};

export const PILL_NAV = [
  { label: "Shows & Tickets", href: "/tickets/" },
  { label: "Support Us", href: "/support/donate/" },
  { label: "Venues", href: "/about/visit/" },
  { label: "Education", href: "/education/in-schools/" },
  { label: "About", href: "/about/mission-history/" },
];

export const UTILITY_LEFT = [
  { label: "Contact", href: "/about/contact/" },
  { label: "News", href: "/news/" },
];

export const UTILITY_LINKS = [
  { label: "Shop", href: SITE.shopUrl },
  { label: "My Tickets", href: SITE.accountUrl },
];

export const FEATURED_SPOTLIGHT = [
  {
    title: "Mahjong Midsummer Classic",
    venue: "Fundraiser · Rowayton, CT",
    dates: "Saturday, September 19, 2026",
    image: "/images/mahjong-midsummer-classic-poster.jpg",
    href: "/events/mahjong-night/",
  },
  {
    title: "Much Ado About Something",
    venue: "Annual Gala · Norwalk, CT",
    dates: "Friday, October 16, 2026",
    image: MEDIA.galaImage,
    href: "/events/much-ado-about-something/",
  },
];

/** Collage Dance–style mega nav mapped to SOTS content */
export const NAV_ITEMS = [
  {
    label: "About",
    href: "/about/mission-history/",
    columns: [
      {
        title: "About",
        links: [
          { label: "About Us", href: "/about/mission-history/" },
          { label: "History", href: "/about/history/" },
          { label: "Staff", href: "/about/staff/" },
          { label: "Board of Directors", href: "/about/board-of-directors/" },
          { label: "Diversity", href: "/about/diversity-statement/" },
          { label: "Employment", href: "/about/employment/" },
          { label: "Contact", href: "/about/contact/" },
          { label: "FAQ", href: "/about/faq/" },
        ],
      },
    ],
  },
  {
    label: "Performances & Tickets",
    href: "/tickets/",
    columns: [
      {
        title: "Performances & Tickets",
        links: [
          { label: "Tickets", href: SITE.ticketsUrl },
          { label: "Much Ado About Nothing", href: "/productions/much-ado-about-nothing/" },
          { label: "Kids' Show", href: "/productions/kids-show/" },
          { label: "All Events", href: "/events/" },
          { label: "Mahjong Night", href: "/events/mahjong-night/" },
          { label: "Annual Gala", href: "/events/much-ado-about-something/" },
          { label: "Past Productions", href: "/productions/past-productions/" },
          { label: "VIP & Ticket Types", href: `${SITE.ticketsUrl}#ticket-pricing` },
        ],
      },
    ],
    featured: {
      title: "Much Ado About Something",
      meta: "Annual Gala · Norwalk, CT",
      dates: "October 16, 2026",
      href: "/events/much-ado-about-something/",
      image: "/images/park-performance.jpg",
    },
  },
  {
    label: "Education",
    href: "/education/in-schools/",
    columns: [
      {
        title: "Education",
        links: [
          { label: "In Schools", href: "/education/in-schools/" },
          { label: "Summer Camps", href: "/education/summer-camps/" },
          { label: "Tours", href: "/education/tours/" },
          { label: "In the Park", href: "/education/in-the-park/" },
          { label: "Apprentice Application", href: "/education/apprentice-application/" },
          { label: "Education Events", href: "/education/events/" },
        ],
      },
    ],
    featured: {
      title: "Summer Camps",
      meta: "Education · Shakespeare in Pinkney Park",
      dates: "Summer 2026",
      href: "/education/summer-camps/",
      image: "/images/news/kids-kings.jpg",
    },
  },
  {
    label: "Adult Programs",
    href: "/education/adult-enrichment/",
    columns: [
      {
        title: "Adult Programs",
        links: [
          { label: "Adult Enrichment", href: "/education/adult-enrichment/" },
          { label: "Education Events", href: "/education/events/" },
          { label: "Volunteer & Support", href: "/support/donate/" },
        ],
      },
    ],
  },
  {
    label: "Visit",
    href: "/about/visit/",
    columns: [
      {
        title: "Visit",
        links: [
          { label: "Plan Your Visit", href: "/about/visit/" },
          { label: "Getting Here", href: "/about/getting-here/" },
          { label: "Cancellation Policy", href: "/about/cancellation-policy/" },
          { label: "Accessibility", href: "/about/visit/" },
          { label: "FAQ", href: "/about/faq/" },
        ],
      },
    ],
    venues: [
      {
        name: "Shakespeare in Pinkney Park",
        address: "Rowayton, CT 06853",
        href: "/about/visit/",
      },
    ],
  },
  {
    label: "Support",
    href: "/support/donate/",
    columns: [
      {
        title: "Support",
        links: [
          { label: "Ways to Give", href: "/support/donate/" },
          { label: "Individual Giving", href: "/support/individual-giving/" },
          { label: "Sponsorships", href: "/support/program-ads-sponsorships/" },
          { label: "Gala", href: "/events/much-ado-about-something/" },
          { label: "Donors", href: "/support/donors/" },
        ],
      },
    ],
  },
  {
    label: "Shop",
    href: SITE.shopUrl,
    columns: [
      {
        title: "Shop",
        links: [
          { label: "Gift Shop", href: SITE.shopUrl },
          { label: "Program Ads", href: "/support/program-ads-sponsorships/" },
        ],
      },
    ],
  },
];

export const PRODUCTIONS = [
  {
    title: "Much Ado About Nothing",
    date: "June 10–28, 2026 · Shakespeare in Pinkney Park, Rowayton, CT",
    href: "/productions/much-ado-about-nothing/",
    image: MEDIA.muchAdoPoster,
  },
  {
    title: "Kids' Show",
    date: "Summer 2026",
    href: "/productions/kids-show/",
    image: MEDIA.kidsImage,
  },
  {
    title: "Much Ado About Something Gala",
    date: "Friday, October 16, 2026",
    href: "/events/much-ado-about-something/",
    image: MEDIA.galaImage,
  },
  {
    title: "Past Productions",
    date: "Explore our history",
    href: "/productions/past-productions/",
    image: MEDIA.educationImage,
  },
];

export const SPONSORS = [
  {
    name: "DR Bank",
    image: "/images/sponsors/dr-bank.jpg",
    maxWidth: { base: "125px", sm: "175px" },
  },
  {
    name: "Neil Hauck Architects",
    image: "/images/sponsors/neil-hauck-architects.jpg",
    maxWidth: { base: "140px", sm: "190px" },
  },
  {
    name: "R+C",
    image: "/images/sponsors/r-plus-c.jpg",
    maxWidth: { base: "150px", sm: "210px" },
  },
  {
    name: "Russo & Rizio",
    image: "/images/sponsors/russo-rizio.jpg",
    maxWidth: { base: "88px", sm: "110px" },
    maxHeight: "5.5rem",
  },
  {
    name: "Rowayton Seafood",
    image: "/images/sponsors/rowayton-seafood.jpg",
    maxWidth: { base: "145px", sm: "195px" },
  },
  {
    name: "Fairfield County Bank",
    image: "/images/sponsors/fairfield-county-bank.jpg",
    maxWidth: { base: "130px", sm: "180px" },
  },
];

export const FOOTER_VENUES = [
  { label: "Shakespeare in Pinkney Park", href: "/about/visit/" },
  { label: "Education & Community", href: "/education/in-schools/" },
];

export const FOOTER_MAIN = {
  columns: [
    {
      title: "About",
      links: [
        { label: "About Us", href: "/about/mission-history/" },
        { label: "History", href: "/about/history/" },
        { label: "Staff", href: "/about/staff/" },
        { label: "Board", href: "/about/board-of-directors/" },
        { label: "Employment", href: "/about/employment/" },
        { label: "Contact", href: "/about/contact/" },
      ],
    },
    {
      title: "Performances & Tickets",
      links: [
        { label: "Tickets", href: SITE.ticketsUrl },
        { label: "Events", href: "/events/" },
        { label: "Much Ado About Nothing", href: "/productions/much-ado-about-nothing/" },
        { label: "Kids' Show", href: "/productions/kids-show/" },
        { label: "Annual Gala", href: "/events/much-ado-about-something/" },
        { label: "Past Productions", href: "/productions/past-productions/" },
      ],
    },
    {
      title: "Education",
      links: [
        { label: "In Schools", href: "/education/in-schools/" },
        { label: "Summer Camps", href: "/education/summer-camps/" },
        { label: "Tours", href: "/education/tours/" },
        { label: "In the Park", href: "/education/in-the-park/" },
        { label: "Apprentice", href: "/education/apprentice-application/" },
      ],
    },
    {
      title: "Adult Programs",
      links: [
        { label: "Adult Enrichment", href: "/education/adult-enrichment/" },
        { label: "Education Events", href: "/education/events/" },
      ],
    },
    {
      title: "Visit",
      links: [
        { label: "Plan a Visit", href: "/about/visit/" },
        { label: "Getting Here", href: "/about/getting-here/" },
        { label: "FAQ", href: "/about/faq/" },
        { label: "Cancellation Policy", href: "/about/cancellation-policy/" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Donate", href: "/support/donate/" },
        { label: "Individual Giving", href: "/support/individual-giving/" },
        { label: "Sponsorships", href: "/support/program-ads-sponsorships/" },
        { label: "Donors", href: "/support/donors/" },
        { label: "Shop", href: SITE.shopUrl },
      ],
    },
  ],
};

export const FOOTER_UTILITY = [
  { label: "FAQ", href: "/about/faq/" },
  { label: "Employment", href: "/about/employment/" },
  { label: "Accessibility", href: "/about/visit/" },
  { label: "Cancellation Policy", href: "/about/cancellation-policy/" },
  { label: "Privacy", href: "/about/privacy/" },
];

export const FOOTER_COLUMNS = FOOTER_MAIN.columns;

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/ShakesOnSound", platform: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/shakesonsound/", platform: "instagram" },
  { label: "X", href: "https://twitter.com/shakesonsound", platform: "x" },
  { label: "YouTube", href: "https://www.youtube.com/user/ShakespeareOnSound", platform: "youtube" },
];

export const VISIT_TILES = [
  { title: "Plan Your Visit", href: "/about/visit/" },
  { title: "Parking", href: "/about/getting-here/" },
  { title: "Seating", href: "/about/visit/" },
  { title: "Box Office", href: "/about/contact/" },
];

export const VENUE_DUO = [
  {
    name: "Shakespeare in Pinkney Park",
    label: "Main Stage",
    image: MEDIA.heroBanner,
    href: "/about/visit/",
    tone: "magenta",
    layout: "boxed",
  },
  {
    name: "Education & Community",
    label: "Schools & Camps",
    image: MEDIA.educationImage,
    href: "/education/in-schools/",
    tone: "blue",
    layout: "stack",
  },
];

export {
  NEWS_ARCHIVE,
  HOMEPAGE_NEWS,
  NEWS_FEATURED,
  NEWS_LIST,
  NEWS_FILTERS,
  newsForFilter,
  getNewsBySlug,
  relatedNews,
} from "./news-archive.js";

export const MAIN_NAV = NAV_ITEMS.map((item) => ({
  label: item.label,
  href: item.columns?.[0]?.links?.[0]?.href || "/",
}));

/** Homepage mobile quick bar — keep exactly 4 for the 2×2 layout. */
export const QUICK_BAR_LINKS = [
  { label: "Parking", href: "/about/getting-here/" },
  { label: "Seating", href: "/about/visit/" },
  { label: "Events", href: "/events/" },
  { label: "My Tickets", href: "/my-tickets/" },
];

export const SEASON_SHOWS = [
  {
    id: "much-ado",
    title: "Much Ado About Nothing",
    dates: "June 10–28, 2026",
    dateShort: "Jun 10–28, 2026",
    venue: "Shakespeare in Pinkney Park, Rowayton, CT",
    description:
      "Shakespeare's sparkling comedy of wit, romance, and mistaken identity comes alive under the Connecticut stars. Directed by David Frederick Mold.",
    image: MEDIA.muchAdoPoster,
    heroImage: MEDIA.heroBanner,
    href: "/productions/much-ado-about-nothing/",
    tickets: SITE.ticketsUrl,
    badge: "Main Stage",
  },
  {
    id: "kids-show",
    title: "Kids' Show",
    dates: "Summer 2026",
    dateShort: "Summer 2026",
    venue: "Shakespeare in Pinkney Park, Rowayton, CT",
    description:
      "Our kids' production brings the joy of live Shakespeare to young audiences — perfect for families discovering theatre together in the park.",
    image: MEDIA.kidsImage,
    heroImage: MEDIA.kidsImage,
    href: "/productions/kids-show/",
    badge: "Family",
  },
  {
    id: "gala",
    title: "Much Ado About Something",
    dates: "Friday, October 16, 2026",
    dateShort: "Oct 16, 2026",
    venue: "The House Up on the Hill, Norwalk, CT",
    description:
      "Cocktails, dancing, and auctions to support next summer's season. Save the date for our annual gala celebration.",
    image: MEDIA.galaImage,
    heroImage: MEDIA.galaImage,
    href: "/events/much-ado-about-something/",
    badge: "Gala",
  },
  {
    id: "past",
    title: "Past Productions",
    dates: "1998–2025",
    dateShort: "Archive",
    venue: "Norwalk & Rowayton, CT",
    description:
      "Explore decades of affordable outdoor Shakespeare presented by Shakespeare on the Sound across Fairfield County.",
    image: MEDIA.educationImage,
    heroImage: MEDIA.educationImage,
    href: "/productions/past-productions/",
    badge: "Archive",
  },
];

export const SEASON_MILESTONES = [
  { date: "Jun 10–28", label: "Much Ado About Nothing — thank you for a landmark summer in Pinkney Park." },
  { date: "Sep 19", label: "Mahjong Midsummer Classic — join us in Rowayton." },
  { date: "Oct 16", label: "Much Ado About Something gala — support the season ahead." },
];

export const SEASON_BENEFITS = [
  {
    title: "Accessible admission",
    text: "Professional outdoor Shakespeare with open lawn seating for everyone.",
  },
  {
    title: "Under the stars",
    text: "Shakespeare in Pinkney Park, Rowayton — blankets on the grass, fireflies overhead, Long Island Sound nearby.",
  },
  {
    title: "Reserved options",
    text: "VIP reserved seating and special packages available online for select performances.",
  },
  {
    title: "Plan your picnic",
    text: "Arrive early, bring a blanket or low chair, and enjoy an evening by the water.",
  },
  {
    title: "Education",
    text: "In-school workshops, summer camps, and Shakespeare for kids in the park.",
  },
  {
    title: "Since 1996",
    text: "Nearly three decades of accessible theatre for Fairfield County communities.",
  },
];

export const VISIT_ESSENTIALS = [
  { label: "Admission", value: "Accessible — donations welcome" },
  { label: "Venue", value: "Shakespeare in Pinkney Park, Rowayton, CT" },
  { label: "Seating", value: "Open lawn — bring a blanket or low chair" },
  { label: "Gates", value: "Park opens at 4pm · box office at 5pm · curtain 7:30pm" },
  { label: "Weather", value: "Performances may delay for rain — check same-day updates" },
];

export const FEATURED_SHOW = {
  title: "Much Ado About Something",
  tagline: "Our annual gala — cocktails, dancing, and auctions for the season ahead",
  dates: "Friday, October 16, 2026",
  venue: "The House Up on the Hill, Norwalk, CT",
  director: "",
  image: MEDIA.galaImage,
  heroImage: MEDIA.galaImage,
  href: "/events/much-ado-about-something/",
  tickets: "/events/much-ado-about-something/#tickets",
};

export const HOMEPAGE_STATS = [
  { value: "1996", label: "Serving Fairfield County since" },
  { value: "Accessible", label: "Outdoor Shakespeare under the stars" },
  { value: "Shakespeare in Pinkney Park", label: "Rowayton, Connecticut" },
  { value: "Oct 16", label: "2026 gala — what's next" },
];

export const SUPPORT_MISSION = {
  eyebrow: "Support the Arts",
  title: "Your Gift Powers the Season",
  body:
    "Ticket sales alone do not cover the full cost of our productions. Each year we raise more than $115,000 from donors, sponsors, and volunteers — sustaining outdoor performances in Pinkney Park, education in schools, and community programs that reach more than 10,000 people across Fairfield County.",
  donateLabel: "Donate Now",
  donateHref: "/support/donate/",
  secondaryLabel: "Stocks, DAFs & more",
  secondaryHref: "/support/donate/#other-ways",
  image: "/images/park-performance.jpg",
  stats: [
    { value: "10,000+", label: "people reached each year" },
    { value: "$115K+", label: "annual fundraising goal" },
    { value: "From $5", label: "general admission for children" },
  ],
  pathways: [
    { label: "Individual Giving", href: "/support/individual-giving/" },
    { label: "Stocks & DAFs", href: "/support/donate/" },
    { label: "Sponsorships", href: "/support/program-ads-sponsorships/" },
    { label: "Gala & Events", href: "/events/" },
  ],
};

export const HOMEPAGE_PATHWAYS = [
  {
    title: "Productions",
    desc: "Relive this summer's Much Ado, explore past shows, and look ahead to what's next.",
    href: "/productions/much-ado-about-nothing/",
    image: MEDIA.muchAdoPoster,
    accent: "forest",
    links: ["Much Ado About Nothing", "Kids' Show", "Past Productions"],
  },
  {
    title: "Education",
    desc: "Workshops, touring shows, summer camps, and in-school programs.",
    href: "/education/in-schools/",
    image: MEDIA.kidsImage,
    accent: "sage",
    links: ["In Schools", "Summer Camps", "In the Park"],
  },
  {
    title: "Support Us",
    desc: "Your gift helps keep ticket prices accessible and funds education programs for the next generation.",
    href: "/support/donate/",
    image: MEDIA.donateImage,
    accent: "gold",
    links: ["Donate", "Sponsorships", "Gala Events"],
  },
  {
    title: "Plan Your Visit",
    desc: "Parking, accessibility, weather policy, and directions to the park.",
    href: "/about/visit/",
    image: MEDIA.educationBanner,
    accent: "cream",
    links: ["Getting Here", "FAQ", "Cancellation Policy"],
  },
];

export const HOMEPAGE_FAQ = [
  {
    q: "How much are tickets?",
    a: "General admission is $25 for adults and $5 for children 12 and under. VIP reserved seating is $75. Students and seniors (65+) may buy $15 rush tickets in person at the park box office day-of only. Pay-What-You-Will nights are Tuesdays — suggested donation $25 adults, $5 children.",
  },
  {
    q: "What should I bring to Shakespeare in Pinkney Park?",
    a: "Bring a blanket or low beach chair, layers for cool evenings, and mosquito repellent. Picnics are welcome. Please arrive early for the best seating on the lawn.",
  },
  {
    q: "What happens if it rains?",
    a: "Performances may be delayed or rescheduled due to weather. Check our website and social channels for same-day updates, or review our cancellation policy for full details.",
  },
  {
    q: "How do I get reserved seating?",
    a: "VIP tickets include a reserved high-back or low-back chair and can be purchased online. General admission is open lawn seating — bring your own blanket or low-back chair.",
  },
];

export const SEASON_SCHEDULE = [
  { show: "Much Ado About Nothing", dates: "June 10–28, 2026", venue: "Shakespeare in Pinkney Park", status: "Ended", href: "/productions/much-ado-about-nothing/" },
  { show: "Kids' Show", dates: "Summer 2026", venue: "Shakespeare in Pinkney Park", status: "Ended", href: "/productions/kids-show/" },
  { show: "Mahjong Midsummer Classic", dates: "Sept 19, 2026", venue: "Rowayton, CT", status: "On Sale", href: "/events/mahjong-night/" },
  { show: "Much Ado About Something Gala", dates: "Oct 16, 2026", venue: "Norwalk, CT", status: "Tickets", href: "/events/much-ado-about-something/#tickets" },
];
