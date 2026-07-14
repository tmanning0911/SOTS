/**
 * Shakespeare on the Sound news & history archive (1995–present).
 * Each item has its own /news/:slug/ article page.
 */

const IMG = {
  /** Macbeth 2025 season art — only for Macbeth stories */
  macbeth: "/images/news/season-banner-2026.jpg",
  muchAdo: "/images/news/much-ado-production.jpg",
  muchAdoHero: "/images/hero-much-ado.jpg",
  gala: "/images/news/gala-2026.jpg",
  park: "/images/news/pinkney-park-audience.jpg",
  kids: "/images/news/shakespeare-for-kids.jpg",
  education: "/images/news/education-banner.jpg",
  kidsKings: "/images/news/kids-kings.webp",
  maanBanner: "/images/news/season-maan-banner.jpg",
  parkPerf: "/images/park-performance.jpg",
  galaPromo: "/images/news/gala-promo.png",
};

/**
 * @typedef {{
 *   slug: string,
 *   title: string,
 *   category: "Production" | "Events" | "News" | "History" | "Education",
 *   date: string,
 *   dateIso: string,
 *   excerpt: string,
 *   href: string,
 *   image: string,
 *   imagePosition?: string,
 *   body: string[],
 *   sourceUrl?: string,
 *   sourceLabel?: string,
 * }} NewsItem
 */

/** @type {Omit<NewsItem, "href">[]} */
const RAW = [
  {
    slug: "2026-season-sponsors",
    title: "2026 Season Sponsors Announced",
    category: "News",
    date: "22 Apr 2026",
    dateIso: "2026-04-22",
    excerpt:
      "We thank DR Bank, Neil Hauck Architects, R+C, Russo & Rizio, Rowayton Seafood, and Fairfield County Bank for supporting our 30th season.",
    image: IMG.park,
    imagePosition: "center 40%",
    body: [
      "Shakespeare on the Sound's 30th summer season at Pinkney Park is made possible by partners across Fairfield County.",
      "We gratefully acknowledge DR Bank, Neil Hauck Architects, R+C, Russo & Rizio, Rowayton Seafood, and Fairfield County Bank for underwriting professional outdoor Shakespeare and year-round education.",
      "Ticket sales alone never cover a full season. Sponsorship and individual giving keep general admission affordable and classrooms connected to the park stage.",
    ],
  },
  {
    slug: "much-ado-2026-30th-season",
    title: "Much Ado About Nothing — 30th Summer Season",
    category: "Production",
    date: "15 Apr 2026",
    dateIso: "2026-04-15",
    excerpt:
      "Join us June 10–28, 2026 at Pinkney Park for Shakespeare's sparkling comedy. VIP pre-sale April 7–14; general admission on sale April 15.",
    image: IMG.muchAdoHero,
    imagePosition: "center 35%",
    body: [
      "For our 30th anniversary season, Shakespeare on the Sound returns to the play that started it all: Much Ado About Nothing — under the stars at Pinkney Park on the Five Mile River in Rowayton.",
      "Performances run June 10–28, 2026. VIP reserved seating pre-sale opened April 7–14; general admission went on sale April 15.",
      "Bring a blanket, arrive early, and settle into the natural amphitheater for wit, romance, and mistaken identity. Directed by David Frederick Mold.",
    ],
  },
  {
    slug: "vip-and-general-tickets-2026",
    title: "VIP Pre-Sale & General Tickets Now Available",
    category: "Production",
    date: "7 Apr 2026",
    dateIso: "2026-04-07",
    excerpt:
      "VIP reserved seating $75. General admission $25 adults / $5 children. Student & senior rush $15 at the box office day-of.",
    image: IMG.parkPerf,
    imagePosition: "center 40%",
    body: [
      "Tickets for Much Ado About Nothing are open. Choose VIP reserved seating or general admission on the lawn.",
      "VIP reserved seating is $75. General admission is $25 for adults and $5 for children. Student and senior rush seats are $15 at the box office on the day of performance when available.",
      "Purchase online through our ticketing calendar, or visit the box office after you arrive in the park.",
    ],
  },
  {
    slug: "much-ado-about-something-gala-2026",
    title: "Save the Date: Much Ado About Something Gala",
    category: "Events",
    date: "1 Mar 2026",
    dateIso: "2026-03-01",
    excerpt:
      "Friday, October 16, 2026, 6–10pm at The House Up on the Hill, 26 Seir Hill Rd., Norwalk, CT.",
    image: IMG.gala,
    imagePosition: "center 30%",
    body: [
      "Join us for Much Ado About Something — our annual gala supporting next summer's festival and education programs.",
      "Friday, October 16, 2026, 6–10pm at The House Up on the Hill, 26 Seir Hill Rd., Norwalk, CT. Expect cocktails, dinner bites, dancing, and live and silent auctions.",
      "Want to help shape the evening? Reach the gala committee at contactus@shakespeareonthesound.org.",
    ],
  },
  {
    slug: "2025-macbeth-pinkney-park",
    title: "2025: Macbeth returns to Pinkney Park",
    category: "Production",
    date: "Jun 2025",
    dateIso: "2025-06-01",
    excerpt:
      "Shakespeare on the Sound presented Macbeth for the summer main-stage season at Pinkney Park — another chapter in nearly three decades under the stars.",
    image: IMG.macbeth,
    imagePosition: "center center",
    body: [
      "Summer 2025 brought Macbeth back to the Pinkney Park amphitheater — storm, ambition, and Scottish tragedy against the Five Mile River.",
      "The production continued Shakespeare on the Sound's tradition of professional casts, picnic audiences, and nightly community gathering on the lawn.",
      "Explore the full season list on our past productions archive.",
    ],
  },
  {
    slug: "2024-romeo-and-juliet",
    title: "2024: Aaron Simms & Romeo and Juliet — Shakespeare's Back!",
    category: "History",
    date: "2024",
    dateIso: "2024-06-01",
    excerpt:
      "Aaron Simms was hired to rebuild and lead the company. He produced a 6-person Romeo and Juliet directed by Claire Karpen that drew over 4,100 to Pinkney Park.",
    image: IMG.parkPerf,
    imagePosition: "center 40%",
    body: [
      "Aaron Simms was hired to rebuild and lead the company in 2024.",
      "He produced a 6-person production of Romeo and Juliet directed by Claire Karpen that attracted over 4,100 to Pinkney Park.",
      "\"Shakespeare's Back!\" was the repeated refrain.",
    ],
  },
  {
    slug: "2023-as-you-like-it",
    title: "2023: As You Like It under the stars",
    category: "Production",
    date: "Jun 2023",
    dateIso: "2023-06-01",
    excerpt:
      "A beloved pastoral comedy returned to Rowayton, continuing the tradition of picnics, blankets, and live Shakespeare by the water.",
    image: IMG.park,
    imagePosition: "center 45%",
    body: [
      "As You Like It brought Forest of Arden energy to Pinkney Park in 2023 — songs, mistaken identities, and one of Shakespeare's warmest comedies.",
      "The season reaffirmed outdoor Shakespeare as a Fairfield County summer ritual: early arrival, a picnic, and theatre under open sky.",
    ],
  },
  {
    slug: "2022-king-john",
    title: "2022: King John — a first for our stage",
    category: "Production",
    date: "Jun 2022",
    dateIso: "2022-06-01",
    excerpt:
      "Shakespeare on the Sound staged King John for the first time in company history — expanding the canon beyond the usual summer favorites.",
    image: IMG.education,
    imagePosition: "center 50%",
    body: [
      "In 2022 the company presented King John — never before seen on the Shakespeare on the Sound stage.",
      "Choosing a less-produced history play expanded the festival repertoire and gave audiences a rare chance to meet the work live in the park.",
    ],
  },
  {
    slug: "2021-25th-season-midsummer",
    title: "2021: Midsummer returns for the 25th season",
    category: "History",
    date: "Jun 2021",
    dateIso: "2021-06-01",
    excerpt:
      "After the pandemic pause, Shakespeare on the Sound returned to Pinkney Park with A Midsummer Night's Dream to rave reviews for the 25th season.",
    image: IMG.kids,
    imagePosition: "center 35%",
    body: [
      "After a disrupted 2020, Shakespeare on the Sound returned to Pinkney Park for its 25th season with a crowd-favorite A Midsummer Night's Dream.",
      "Critics and neighbors welcomed the company back to the lawn — a reminder of how central the festival is to Rowayton summers.",
    ],
  },
  {
    slug: "2020-virtual-seasons",
    title: "2020: Virtual stages when the park went dark",
    category: "History",
    date: "2020",
    dateIso: "2020-06-01",
    excerpt:
      "When outdoor programming was cut short, the company held a virtual Macbeth reunion, a Short New Play Festival, A Christmas Carol on Zoom, and a high-school new-play festival.",
    image: IMG.education,
    imagePosition: "center 45%",
    body: [
      "Pandemic closures cut the outdoor season short in 2020, but Shakespeare on the Sound kept creating.",
      "The company hosted a virtual reunion of the 2017 Macbeth company, produced a Short New Play Festival with five playwrights, streamed A Christmas Carol on Zoom, and supported a high-school Short New Play Festival in the spring.",
      "Those experiments kept artists connected and paved the way for the 2021 return to Pinkney Park.",
    ],
  },
  {
    slug: "2019-twelfth-night-25-years",
    title: "2019: Twelfth Night closes a quarter century",
    category: "Production",
    date: "Jun 2019",
    dateIso: "2019-06-01",
    excerpt:
      "A captivating Twelfth Night rounded out 25 years of outdoor Shakespeare alongside year-round education programs across southern Connecticut.",
    image: IMG.park,
    imagePosition: "center 40%",
    body: [
      "Twelfth Night marked a quarter-century of professional outdoor Shakespeare for the company.",
      "Alongside the park production, education programs continued in schools across southern Connecticut — extending the festival's reach long after the set came down.",
    ],
  },
  {
    slug: "2018-midsummer-year-23",
    title: "2018: A Midsummer Night's Dream — year twenty-three",
    category: "Production",
    date: "Jun 2018",
    dateIso: "2018-06-01",
    excerpt:
      "The twenty-third season brought another magical Midsummer to Pinkney Park's natural amphitheater on the Five Mile River.",
    image: IMG.kidsKings,
    imagePosition: "center 30%",
    body: [
      "Year twenty-three returned to A Midsummer Night's Dream — fairies, mechanicals, and moonlit comedy on the banks of the Five Mile River.",
      "Midsummer has become one of the company's signature park titles, returning whenever audiences are ready for enchantment outdoors.",
    ],
  },
  {
    slug: "2017-macbeth-apprentice-company",
    title: "2017: Macbeth & the Apprentice Company pre-show",
    category: "Production",
    date: "Jun 2017",
    dateIso: "2017-06-01",
    excerpt:
      "Macbeth took the main stage while the Apprentice Company continued its beloved nightly pre-show for children of all ages.",
    image: IMG.parkPerf,
    imagePosition: "center 35%",
    body: [
      "Macbeth filled the main stage in 2017 while the Apprentice Company offered its nightly pre-show for young audiences.",
      "The apprentice tradition introduces emerging artists to professional outdoor production and gives kids a front row into Shakespeare before the evening curtain.",
    ],
  },
  {
    slug: "2016-claire-shannon-kelly-hamlet",
    title: "2016: Claire Shannon Kelly stages Hamlet",
    category: "History",
    date: "Jun 2016",
    dateIso: "2016-06-01",
    excerpt:
      "Claire Shannon Kelly stepped in as Artistic Director and staged an enormously successful Hamlet — still a landmark season for the company.",
    image: IMG.education,
    imagePosition: "center 50%",
    body: [
      "Claire Shannon Kelly became Artistic Director and staged Hamlet in 2016 — a landmark main-stage season for Shakespeare on the Sound.",
      "Her leadership era also deepened education work, including touring classroom pieces and ongoing development of young artists.",
    ],
  },
  {
    slug: "2015-twentieth-anniversary",
    title: "2015: Twentieth anniversary — All's Well That Ends Well",
    category: "History",
    date: "2015",
    dateIso: "2015-06-01",
    excerpt:
      "Shakespeare on the Sound celebrated twenty years with All's Well That Ends Well and honored the founders who started it all around a Rowayton kitchen table.",
    image: IMG.maanBanner,
    imagePosition: "center 40%",
    body: [
      "The twentieth anniversary season presented All's Well That Ends Well and looked back to Megan Crowley McAllister's kitchen-table vision in 1995.",
      "Two decades of Pinkney Park summers — and a growing education mission — had turned a neighborhood idea into Fairfield County's outdoor Shakespeare home.",
    ],
  },
  {
    slug: "2015-founders-gala",
    title: "Founders honored at the 2015 annual gala",
    category: "Events",
    date: "18 Apr 2015",
    dateIso: "2015-04-18",
    excerpt:
      "At Wee Burn Country Club, the gala celebrated Megan Crowley McAllister, Ezra Barnes, and the original board on the company's twentieth anniversary.",
    image: IMG.galaPromo,
    imagePosition: "center center",
    body: [
      "The 2015 gala at Wee Burn Country Club in Darien honored the founders who launched outdoor Shakespeare in Rowayton.",
      "Celebrated were Megan Crowley McAllister, founding artistic director Ezra Barnes, and board members Susan Reed Basche, Dorsey Gude, Tim Massad, Adrienne and Steven Southworth, and Andrew Woolford.",
      "Founders recalled the first Much Ado — including nights when headlights stood in for stage lights when power failed.",
    ],
    sourceUrl:
      "https://www.broadwayworld.com/connecticut/article/Shakespeare-on-the-Sound-to-Host-Annual-Gala-418-20150320",
    sourceLabel: "BroadwayWorld coverage",
  },
  {
    slug: "speaking-daggers-anti-bullying",
    title: "Speaking Daggers: Shakespeare against bullying",
    category: "Education",
    date: "Oct 2012",
    dateIso: "2012-10-01",
    excerpt:
      "Director of Education Emily Bryan's anti-bullying workshop — piloted with nearly 800 students in Norwalk — used Shakespeare to teach empathy, conflict resolution, and standing up to aggression.",
    image: IMG.kids,
    imagePosition: "center 30%",
    body: [
      "Speaking Daggers: Shakespeare and the Fight Against Bullying became a signature education offering.",
      "Piloted in spring 2012 with support including GE Capital and the George Washington Carver Center, the workshop reached nearly 800 students at Carver Center, Nathan Hale, Ponus Ridge, and Roton Middle Schools in Norwalk.",
      "Using scenes from A Midsummer Night's Dream, Romeo and Juliet, and The Merchant of Venice, teaching artists tackled cyberbullying, conflict resolution, and empathy through Shakespeare's complex characters.",
    ],
    sourceUrl:
      "https://www.broadwayworld.com/connecticut/article/Shakespeare-on-the-Sound-Seeks-17500-for-Anti-Bullying-Program-Speaking-Daggers-20121002",
    sourceLabel: "BroadwayWorld coverage",
  },
  {
    slug: "2013-2014-education-expansion",
    title: "2013–2014: Rowayton again, guest directors & Speaking Daggers",
    category: "History",
    date: "2013",
    dateIso: "2013-06-01",
    excerpt:
      "Steven Yuhasz became Executive Director; As You Like It (Claire Shannon Kelly) won critical praise; Emily Bryan expanded schools programming and launched Speaking Daggers; 2014 brought Two Gentlemen of Verona.",
    image: IMG.kidsKings,
    imagePosition: "center 35%",
    body: [
      "Steven Yuhasz became Executive Director as the company refocused on Rowayton after the dual-venue years.",
      "Claire Shannon Kelly's As You Like It (2013) drew critical praise. Emily Bryan expanded lower Fairfield County school work, strengthened summer camp, and established Speaking Daggers.",
      "2014's Two Gentlemen of Verona continued the guest-director model while the Apprentice Program kept introducing young people to theatre arts.",
    ],
  },
  {
    slug: "2010-othello-joanna-settle-stew",
    title: "2010: Othello with Joanna Settle & Stew",
    category: "Production",
    date: "2010",
    dateIso: "2010-06-01",
    excerpt:
      "Artistic Director Joanna Settle directed Othello with original music by Tony Award-winning songwriter Stew — playing both Pinkney Park and Baldwin Park, Greenwich.",
    image: IMG.parkPerf,
    imagePosition: "center 30%",
    body: [
      "Joanna Settle directed Othello with original music and songs by Tony Award-winning artist Stew and scenic design by Andrew Lieberman.",
      "The 15th-season production played site-specifically at Pinkney Park, Rowayton, and Baldwin Park, Greenwich — affordable outdoor Shakespeare with a suggested donation.",
    ],
    sourceUrl:
      "https://www.broadwayworld.com/connecticut/article/Shakespeare-on-the-Sound-Presents-OTHELLO-In-The-Summer-Of-2010-20091105",
    sourceLabel: "BroadwayWorld coverage",
  },
  {
    slug: "2009-midsummer-largest-audience",
    title: "2009: Midsummer draws nearly 14,000 — largest audience ever",
    category: "History",
    date: "Jul 2009",
    dateIso: "2009-07-01",
    excerpt:
      "Joanna Settle's first season as Artistic Director, with music by Stew, drew nearly fourteen thousand people. The New York Times reviewed the production; the Apprentice Company and a play-reading series launched.",
    image: IMG.park,
    imagePosition: "center 40%",
    body: [
      "Joanna Settle's first season as Artistic Director transformed A Midsummer Night's Dream with a score by Stew of Broadway's Passing Strange.",
      "Nearly fourteen thousand people attended — the largest audience in company history. Charles Isherwood reviewed the production for The New York Times.",
      "The same year launched the Apprentice Company and a new play-reading series, raising artistic stakes across the festival.",
    ],
    sourceUrl: "https://www.nytimes.com/2009/07/02/theater/reviews/02dream.html",
    sourceLabel: "New York Times review",
  },
  {
    slug: "2007-2008-greenwich-baldwin-park",
    title: "2007–2008: Two venues — Rowayton & Greenwich",
    category: "History",
    date: "2007",
    dateIso: "2007-06-01",
    excerpt:
      "After Comedy of Errors and Julius Caesar seasons, Shakespeare on the Sound tested Baldwin Park on Greenwich harbor — transferring the Rowayton run for added waterfront performances.",
    image: IMG.park,
    imagePosition: "center 45%",
    body: [
      "Greenwich agreed to test a short season at Baldwin Park on the harbor. After Rowayton, The Comedy of Errors (2007) transferred for four Greenwich performances that drew about four thousand people.",
      "In 2008 Julius Caesar doubled Greenwich performances. For several seasons Shakespeare on the Sound was a two-venue festival before returning fully to Pinkney Park.",
    ],
  },
  {
    slug: "2000-2006-growth-years",
    title: "2000–2006: Sixteen performances and 9,000 spectators a year",
    category: "History",
    date: "2000",
    dateIso: "2000-06-01",
    excerpt:
      "Seasons stretched to sixteen performances: Midsummer, Henry V, As You Like It, Merchant of Venice, The Winter's Tale, The Tempest, and Macbeth. The annual gala became a Fairfield County staple.",
    image: IMG.parkPerf,
    imagePosition: "center 35%",
    body: [
      "By 2000 the festival ran sixteen performances a summer. Titles included A Midsummer Night's Dream, Henry V, As You Like It, The Merchant of Venice, The Winter's Tale, The Tempest, and Macbeth.",
      "Audiences averaged about 9,000 per year. The annual gala solidified as a major fundraiser and community event. In 2006 leadership began seeking a second venue.",
    ],
  },
  {
    slug: "1997-1999-growing-the-festival",
    title: "1997–1999: Growing the festival",
    category: "History",
    date: "1997",
    dateIso: "1997-06-01",
    excerpt:
      "Performances grew from eight to twelve with Twelfth Night, The Taming of the Shrew, and Romeo and Juliet — community support locked in financial stability.",
    image: IMG.muchAdo,
    imagePosition: "center 40%",
    body: [
      "After the inaugural summer, Shakespeare on the Sound expanded from eight to twelve performances.",
      "Twelfth Night (1997), The Taming of the Shrew (1998), and Romeo and Juliet (1999) built a loyal audience and the financial footing to keep accessible outdoor Shakespeare in Rowayton.",
    ],
  },
  {
    slug: "1996-inaugural-much-ado",
    title: "1996: First Much Ado — 6,000 find Pinkney Park",
    category: "History",
    date: "1996",
    dateIso: "1996-06-01",
    excerpt:
      "Rowayton's 6th Taxing District approved Pinkney Park on the Five Mile River. The inaugural Much Ado About Nothing drew an estimated 6,000 people to the natural amphitheater.",
    image: IMG.maanBanner,
    imagePosition: "center 35%",
    body: [
      "Rowayton's 6th Taxing District approved Pinkney Park on the Five Mile River — a sloping natural amphitheater perfect for outdoor theatre.",
      "The inaugural production was Much Ado About Nothing. An estimated 6,000 people came. Three decades later, the 30th anniversary season returns to the same play on the same lawn.",
    ],
  },
  {
    slug: "1995-founded-rowayton",
    title: "1995: Founded around a Rowayton kitchen table",
    category: "History",
    date: "1995",
    dateIso: "1995-01-01",
    excerpt:
      "Megan Crowley McAllister recruited Ezra Barnes (founding artistic director) and six neighbors — Susan Reed Basche, Dorsey Gude, Tim Massad, Adrienne & Steven Southworth, Andrew Woolford — to launch outdoor Shakespeare in Fairfield County.",
    image: IMG.parkPerf,
    imagePosition: "center 35%",
    body: [
      "Outdoor Shakespeare in Rowayton was the brainchild of Megan Crowley McAllister. She approached actor-director Ezra Barnes, who had founded a similar company in Westerly, Rhode Island.",
      "Together they recruited Susan Reed Basche, Dorsey Gude, Tim Massad, Adrienne and Steven Southworth, and Andrew Woolford. Barnes became founding artistic director. They raised funds for a first production the following summer.",
      "That kitchen-table plan became Shakespeare on the Sound — still presenting affordable professional Shakespeare and year-round education across Fairfield County.",
    ],
  },
  {
    slug: "mission-affordable-shakespeare-education",
    title: "Mission: affordable Shakespeare & year-round education",
    category: "News",
    date: "Ongoing",
    dateIso: "1995-06-01",
    excerpt:
      "Shakespeare on the Sound produces professional open-air theatre and builds community through schools, libraries, camps, apprentices, and adult enrichment across Fairfield County.",
    image: IMG.education,
    imagePosition: "center 45%",
    body: [
      "Shakespeare on the Sound is committed to affordable, professional open-air productions of Shakespeare and related authors in Fairfield County.",
      "Working with civic, business, and educational partners, the annual festival creates a forum for learning, appreciation, and celebration.",
      "Education programming — schools, libraries, adult enrichment, camps, and apprentices — keeps Shakespeare's language alive beyond June.",
    ],
  },
  {
    slug: "production-archive-1996-2026",
    title: "Full production archive: 1996–2026",
    category: "History",
    date: "Archive",
    dateIso: "1995-01-02",
    excerpt:
      "From the first Much Ado through Macbeth, Hamlet, King John, and the 30th-anniversary return to Much Ado About Nothing — every summer season in one place.",
    image: IMG.park,
    imagePosition: "center 40%",
    body: [
      "Every main-stage title from 1996 through the 30th anniversary season lives in our past productions archive.",
      "Trace Midsummers, tragedies, comedies, and rarities like King John — then buy tickets for this summer's Much Ado About Nothing at Pinkney Park.",
    ],
  },
];

/** @type {NewsItem[]} */
export const NEWS_ARCHIVE = RAW.map((item) => ({
  ...item,
  href: `/news/${item.slug}/`,
})).sort((a, b) => String(b.dateIso).localeCompare(String(a.dateIso)));

export const HOMEPAGE_NEWS = NEWS_ARCHIVE.filter((item) => item.dateIso >= "2026-01-01");

export const NEWS_FEATURED = NEWS_ARCHIVE.slice(0, 3);

export const NEWS_LIST = NEWS_ARCHIVE;

export const NEWS_FILTERS = ["All", "Production", "Events", "News", "History", "Education"];

/**
 * @param {string} filter
 * @returns {NewsItem[]}
 */
export function newsForFilter(filter) {
  if (filter === "All") return NEWS_ARCHIVE;
  return NEWS_ARCHIVE.filter((item) => item.category === filter);
}

/**
 * @param {string | undefined} slug
 * @returns {NewsItem | undefined}
 */
export function getNewsBySlug(slug) {
  if (!slug) return undefined;
  return NEWS_ARCHIVE.find((item) => item.slug === slug);
}

/**
 * @param {string} slug
 * @returns {NewsItem[]}
 */
export function relatedNews(slug, limit = 3) {
  const current = getNewsBySlug(slug);
  if (!current) return NEWS_ARCHIVE.slice(0, limit);
  return NEWS_ARCHIVE.filter(
    (item) => item.slug !== slug && (item.category === current.category || item.category === "History"),
  ).slice(0, limit);
}
