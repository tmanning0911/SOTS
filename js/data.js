export const SITE = {
  name: "Shakespeare on the Sound",
  tagline: "Where Shakespeare Lives Now!",
  email: "contactus@shakespeareonthesound.org",
  boxOffice: "(203) 957-1006",
  address: "PO Box 15, Norwalk, CT, 06853",
  educationContact: "stephanie@shakespeareonthesound.org",
  educationOutreachContact: "nick@shakespeareonthesound.org",
  educationOutreachName: "Nick Urda, Director of Educational Programming",
  educationDirectorName: "Stephanie Eiss, Director of Education and Outreach",
  ticketsUrl: "/tickets/",
  donateUrl: "https://www.paypal.com/donate/?hosted_button_id=5FTZQ4CXESHXY",
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
  logo: wixFit("2fda61_2e65ecb094584570823c5e5c30d11c49~mv2.jpg", 720, 240),
  heroHome: "/images/hero-much-ado.jpg",
  heroBanner: wix("2fda61_ed5498c346784fa7a58d686004f62ad1~mv2.jpg", 1970, 667),
  muchAdoPoster: wix("2fda61_52a2b5db62ea4c22b8da935de226b8de~mv2.jpg", 450, 712),
  galaImage: wix("2fda61_62cb4626d7df4887b266915e2f9c3acf~mv2.png", 400, 300),
  donateImage: wix("2fda61_82dcc57bf05740e9a011b352af16d186~mv2.png", 600, 400),
  kidsImage: wix("2fda61_58e853fcce884727a4deba3453b4c1ed~mv2.jpeg", 600, 400),
  educationImage: wix("2fda61_7c217d43df9449748f30515a8625d28f~mv2.jpg", 800, 500),
  educationBanner: wix("2fda61_40d7e102e7e34217993b1143d8e3eb6b~mv2.jpg", 1970, 667),
  staLogo: wix("2fda61_f444735fb7654e17aa6d16f529efd25f~mv2.jpg", 200, 80),
  heroVideo: "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4",
};

export const HERO_HOME = {
  titleLines: ["Experience", "the Magic of", "Shakespeare"],
  titleLastLine: "Under the",
  titleHighlight: "Stars",
  ctaLabel: "Tickets",
  ctaHref: SITE.ticketsUrl,
  ctaExternal: false,
};

export const SEASON_PROMO = {
  eyebrow: "2026 Summer Tickets Are On Sale Now",
  heading: "Join Us for a Summer of Laughter, Magic, Mystery and More!",
  ctaLabel: "Tickets",
  ctaHref: SITE.ticketsUrl,
  ctaExternal: false,
  showId: "much-ado",
};

export const PILL_NAV = [
  { label: "Shows & Tickets", href: "/tickets/" },
  { label: "Support Us", href: "/support/donate/" },
  { label: "Venues", href: "/about/visit/" },
  { label: "Education", href: "/education/in-schools/" },
  { label: "About", href: "/about/mission-history/" },
];

export const UTILITY_LEFT = [
  { label: "Pinkney Park", href: "/about/visit/" },
  { label: "Education Programs", href: "/education/in-schools/" },
];

export const UTILITY_LINKS = [
  {
    label: "About",
    children: [
      { label: "About Us", href: "/about/mission-history/" },
      { label: "Contact Us", href: "/about/contact/" },
      { label: "Board of Directors", href: "/about/board-of-directors/" },
      { label: "Team", href: "/about/staff/" },
      { label: "History", href: "/about/history/" },
      { label: "Employment", href: "/about/employment/" },
    ],
  },
  { label: "News", href: "/#recent-news" },
  { label: "Shop", href: SITE.shopUrl },
  { label: "My Tickets", href: SITE.accountUrl },
];

export const FEATURED_SPOTLIGHT = [
  {
    title: "Much Ado About Nothing",
    venue: "Main Stage · Pinkney Park",
    dates: "June 10–28, 2026",
    image: MEDIA.muchAdoPoster,
    href: "/productions/much-ado-about-nothing/",
  },
  {
    title: "Kids' Show",
    venue: "Family · Pinkney Park",
    dates: "Summer 2026",
    image: MEDIA.kidsImage,
    href: "/productions/kids-show/",
  },
];

export const NAV_ITEMS = [
  {
    label: "Events and Tickets",
    columns: [
      {
        title: "Events By Location",
        links: [
          { label: "All Events", href: "/tickets/" },
          { label: "Pinkney Park", href: "/about/visit/" },
          { label: "Education Events", href: "/education/events/" },
        ],
      },
      {
        title: "Events By Genre",
        twoColumn: true,
        links: [
          { label: "Main Stage", href: "/tickets/" },
          { label: "Family", href: "/productions/kids-show/" },
          { label: "Gala", href: "/support/events/" },
          { label: "Education", href: "/education/in-schools/" },
          { label: "Comedy", href: "/productions/much-ado-about-nothing/" },
          { label: "Past Productions", href: "/productions/past-productions/" },
          { label: "Special Event", href: "/support/events/" },
          { label: "Youth Programs", href: "/education/summer-camps/" },
        ],
      },
      {
        title: "Ticket Information",
        links: [
          { label: "Box Office", href: "/about/contact/" },
          { label: "Tickets", href: SITE.ticketsUrl },
          { label: "VIP & Ticket Types", href: `${SITE.ticketsUrl}#ticket-pricing` },
          { label: "FAQ", href: "/about/faq/" },
          { label: "Cancellation Policy", href: "/about/cancellation-policy/" },
        ],
      },
    ],
    featured: {
      title: "Much Ado About Nothing",
      meta: "Main Stage · Pinkney Park",
      dates: "June 10–28, 2026",
      href: "/productions/much-ado-about-nothing/",
      image: MEDIA.muchAdoPoster,
    },
  },
  {
    label: "Plan A Visit",
    columns: [
      {
        title: "Parking And Directions",
        links: [
          { label: "Accessibility", href: "/about/visit/" },
          { label: "Getting Here", href: "/about/getting-here/" },
          { label: "Plan Your Visit", href: "/about/visit/" },
          { label: "FAQ", href: "/about/faq/" },
          { label: "Cancellation Policy", href: "/about/cancellation-policy/" },
        ],
      },
    ],
    venues: [
      {
        name: "Pinkney Park",
        address: "Rowayton, CT 06853",
        href: "/about/visit/",
      },
    ],
  },
  {
    label: "Education & Community",
    columns: [
      {
        title: "School Programs",
        links: [
          { label: "In Schools", href: "/education/in-schools/" },
          { label: "Tours", href: "/education/tours/" },
          { label: "In the Park", href: "/education/in-the-park/" },
        ],
      },
      {
        title: "Youth and Family Programs",
        links: [
          { label: "Summer Camps", href: "/education/summer-camps/" },
          { label: "Kids' Show", href: "/productions/kids-show/" },
          { label: "Apprentice Application", href: "/education/apprentice-application/" },
        ],
      },
      {
        title: "Community Programs",
        links: [
          { label: "Adult Enrichment", href: "/education/adult-enrichment/" },
          { label: "Events", href: "/education/events/" },
          { label: "Donate", href: "/support/donate/" },
        ],
      },
    ],
    featured: {
      title: "Summer Camps",
      meta: "Education · Pinkney Park",
      dates: "Summer 2026",
      href: "/education/summer-camps/",
      image: MEDIA.kidsImage,
    },
  },
  {
    label: "Support Our Mission",
    columns: [
      {
        title: "Support Our Mission",
        links: [
          { label: "Individual Giving", href: "/support/individual-giving/" },
          { label: "Program Ads & Sponsorships", href: "/support/program-ads-sponsorships/" },
          { label: "Donate", href: "/support/donate/" },
          { label: "Gift Shop", href: SITE.shopUrl },
          { label: "Events", href: "/support/events/" },
          { label: "Thank You", href: "/support/donors/" },
        ],
      },
    ],
  },
];

export const PRODUCTIONS = [
  {
    title: "Much Ado About Nothing",
    date: "June 10–28, 2026 · Pinkney Park, Rowayton, CT",
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
    href: "/support/events/",
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
  { label: "Pinkney Park", href: "/about/visit/" },
  { label: "Education & Community", href: "/education/in-schools/" },
];

export const FOOTER_MAIN = {
  columns: [
    {
      title: "Visit",
      links: [
        { label: "Tickets", href: SITE.ticketsUrl },
        { label: "Events", href: "/tickets/" },
        { label: "Plan a Visit", href: "/about/visit/" },
        { label: "Parking & Directions", href: "/about/getting-here/" },
        { label: "Gift Shop", href: SITE.shopUrl },
        { label: "My Tickets", href: SITE.accountUrl },
      ],
    },
    {
      title: "Experience",
      links: [
        { label: "This Season", href: "/productions/much-ado-about-nothing/" },
        { label: "Kids Show", href: "/productions/kids-show/" },
        { label: "Summer Camps", href: "/education/summer-camps/" },
        { label: "Education in Schools", href: "/education/in-schools/" },
        { label: "Tours", href: "/education/tours/" },
      ],
    },
    {
      title: "About & Support",
      links: [
        { label: "Our Mission", href: "/about/mission-history/" },
        { label: "Staff", href: "/about/staff/" },
        { label: "Donate", href: "/support/donate/" },
        { label: "Individual Giving", href: "/support/individual-giving/" },
        { label: "Contact", href: "/about/contact/" },
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
    name: "Pinkney Park",
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
} from "./news-archive.js";

export const MAIN_NAV = NAV_ITEMS.map((item) => ({
  label: item.label,
  href: item.columns?.[0]?.links?.[0]?.href || "/",
}));

/** Homepage mobile quick bar — keep exactly 4 for the 2×2 layout. */
export const QUICK_BAR_LINKS = [
  { label: "Parking", href: "/about/getting-here/" },
  { label: "Seating", href: "/about/visit/" },
  { label: "Buy Tickets", href: "/tickets/" },
  { label: "My Tickets", href: "/my-tickets/" },
];

export const SEASON_SHOWS = [
  {
    id: "much-ado",
    title: "Much Ado About Nothing",
    dates: "June 10–28, 2026",
    dateShort: "Jun 10–28, 2026",
    venue: "Pinkney Park, Rowayton, CT",
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
    venue: "Pinkney Park, Rowayton, CT",
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
    href: "/support/events/",
    badge: "Gala",
  },
  {
    id: "past",
    title: "Past Productions",
    dates: "1998–2025",
    dateShort: "Archive",
    venue: "Norwalk & Rowayton, CT",
    description:
      "Explore decades of free outdoor Shakespeare presented by Shakespeare on the Sound across Fairfield County.",
    image: MEDIA.educationImage,
    heroImage: MEDIA.educationImage,
    href: "/productions/past-productions/",
    badge: "Archive",
  },
];

export const SEASON_MILESTONES = [
  { date: "Jun 10", label: "2026 summer season opens with Much Ado About Nothing at Pinkney Park." },
  { date: "Jun 10–28", label: "Performance run — arrive early, spread a blanket, and settle in for the show." },
  { date: "Summer", label: "Kids' Show and education programs in the park." },
  { date: "Oct 16", label: "Much Ado About Something gala — support the season ahead." },
];

export const SEASON_BENEFITS = [
  {
    title: "Free admission",
    text: "Professional outdoor Shakespeare at no charge. Open lawn seating for everyone.",
  },
  {
    title: "Under the stars",
    text: "Pinkney Park, Rowayton — blankets on the grass, fireflies overhead, Long Island Sound nearby.",
  },
  {
    title: "Reserved options",
    text: "Limited reserved seating and special packages available through Eventbrite for select performances.",
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
    text: "Nearly three decades of free theatre for Fairfield County communities.",
  },
];

export const VISIT_ESSENTIALS = [
  { label: "Admission", value: "Free — donations welcome" },
  { label: "Venue", value: "Pinkney Park, Rowayton, CT" },
  { label: "Seating", value: "Open lawn — bring a blanket or low chair" },
  { label: "Gates", value: "Opens one hour before curtain" },
  { label: "Weather", value: "Performances may delay for rain — check same-day updates" },
];

export const FEATURED_SHOW = {
  title: "Much Ado About Nothing",
  tagline: "Shakespeare's sparkling comedy of wit, romance, and mistaken identity",
  dates: "June 10–28, 2026",
  venue: "Pinkney Park, Rowayton, CT",
  director: "David Frederick Mold",
  image: MEDIA.muchAdoPoster,
  heroImage: MEDIA.heroBanner,
  href: "/productions/much-ado-about-nothing/",
  tickets: SITE.ticketsUrl,
};

export const HOMEPAGE_STATS = [
  { value: "1996", label: "Serving Fairfield County since" },
  { value: "Free", label: "Outdoor Shakespeare under the stars" },
  { value: "Pinkney Park", label: "Rowayton, Connecticut" },
  { value: "June 10–28", label: "2026 summer season" },
];

export const SUPPORT_MISSION = {
  eyebrow: "Support the Arts",
  title: "Your Gift Powers the Season",
  body:
    "Ticket sales alone do not cover the full cost of our productions. Each year we raise more than $115,000 from donors, sponsors, and volunteers to sustain performances, education in schools, and community programs across Fairfield County.",
  donateLabel: "Donate Now",
  donateHref: "/support/donate/",
  secondaryLabel: "Explore Giving Options",
  secondaryHref: "/support/individual-giving/",
  image: "/images/backgrounds/park-audience-nyt.jpg",
  stats: [
    { value: "30 seasons", label: "of Shakespeare in the park" },
    { value: "$115K+", label: "annual fundraising goal" },
    { value: "From $5", label: "general admission for children" },
  ],
  pathways: [
    { label: "Individual Giving", href: "/support/individual-giving/" },
    { label: "Sponsorships", href: "/support/program-ads-sponsorships/" },
    { label: "Gala & Events", href: "/support/events/" },
  ],
};

export const HOMEPAGE_PATHWAYS = [
  {
    title: "Productions",
    desc: "Browse the season, explore past shows, and reserve your seats.",
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
    a: "General admission is $25 for adults, $15 for students and seniors, and $5 for children 12 and under. VIP reserved seating is $75. Tuesdays are donation-only performances — pay what you can at the door.",
  },
  {
    q: "What should I bring to Pinkney Park?",
    a: "Bring a blanket or low beach chair, layers for cool evenings, and mosquito repellent. Picnics are welcome. Please arrive early for the best seating on the lawn.",
  },
  {
    q: "What happens if it rains?",
    a: "Performances may be delayed or rescheduled due to weather. Check our website and social channels for same-day updates, or review our cancellation policy for full details.",
  },
  {
    q: "How do I get reserved seating?",
    a: "VIP tickets include a reserved high-back or low-back chair and can be purchased through Eventbrite. General admission is open lawn seating — bring your own blanket or low-back chair.",
  },
];

export const SEASON_SCHEDULE = [
  { show: "Much Ado About Nothing", dates: "June 10–28, 2026", venue: "Pinkney Park", status: "On Sale", href: "/productions/much-ado-about-nothing/" },
  { show: "Kids' Show", dates: "Summer 2026", venue: "Pinkney Park", status: "Coming Soon", href: "/productions/kids-show/" },
  { show: "Much Ado About Something Gala", dates: "Oct 16, 2026", venue: "Norwalk, CT", status: "Save the Date", href: "/support/events/" },
];
