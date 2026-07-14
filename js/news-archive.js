/**
 * Shakespeare on the Sound news & history archive.
 * Sourced from mission/history, past productions, and public press (1995–present).
 */

const IMG = {
  season: "/images/news/season-banner-2026.jpg",
  muchAdo: "/images/news/much-ado-production.jpg",
  gala: "/images/news/gala-2026.jpg",
  park: "/images/news/pinkney-park-audience.jpg",
  kids: "/images/news/shakespeare-for-kids.jpg",
  education: "/images/news/education-banner.jpg",
  kidsKings: "/images/news/kids-kings.jpg",
  maanBanner: "/images/news/season-maan-banner.jpg",
  parkPerf: "/images/park-performance.jpg",
};

/**
 * @typedef {{
 *   title: string,
 *   category: "Production" | "Events" | "News" | "History" | "Education",
 *   date: string,
 *   dateIso: string,
 *   excerpt: string,
 *   href: string,
 *   image: string,
 *   external?: boolean,
 * }} NewsItem
 */

/** @type {NewsItem[]} */
export const NEWS_ARCHIVE = [
  // ─── 2026 season ───────────────────────────────────────────────
  {
    title: "2026 Season Sponsors Announced",
    category: "News",
    date: "22 Apr 2026",
    dateIso: "2026-04-22",
    excerpt:
      "We thank DR Bank, Neil Hauck Architects, R+C, Russo & Rizio, Rowayton Seafood, and Fairfield County Bank for supporting our 30th season.",
    href: "/support/donors/",
    image: IMG.park,
  },
  {
    title: "Much Ado About Nothing — 30th Summer Season",
    category: "Production",
    date: "15 Apr 2026",
    dateIso: "2026-04-15",
    excerpt:
      "Join us June 10–28, 2026 at Pinkney Park for Shakespeare's sparkling comedy. VIP pre-sale April 7–14; general admission on sale April 15.",
    href: "/productions/much-ado-about-nothing/",
    image: IMG.season,
  },
  {
    title: "VIP Pre-Sale & General Tickets Now Available",
    category: "Production",
    date: "7 Apr 2026",
    dateIso: "2026-04-07",
    excerpt:
      "VIP reserved seating $75. General admission $25 adults / $5 children. Student & senior rush $15 at the box office day-of.",
    href: "/productions/much-ado-about-nothing/",
    image: IMG.muchAdo,
  },
  {
    title: "Save the Date: Much Ado About Something Gala",
    category: "Events",
    date: "1 Mar 2026",
    dateIso: "2026-03-01",
    excerpt:
      "Friday, October 16, 2026, 6–10pm at The House Up on the Hill, 26 Seir Hill Rd., Norwalk, CT.",
    href: "/support/events/",
    image: IMG.gala,
  },

  // ─── Recent seasons ────────────────────────────────────────────
  {
    title: "2025: Macbeth returns to Pinkney Park",
    category: "Production",
    date: "Jun 2025",
    dateIso: "2025-06-01",
    excerpt:
      "Shakespeare on the Sound presented Macbeth for the summer main-stage season at Pinkney Park — another chapter in nearly three decades under the stars.",
    href: "/productions/past-productions/",
    image: IMG.parkPerf,
  },
  {
    title: "2024: Romeo & Juliet on the Five Mile River",
    category: "Production",
    date: "Jun 2024",
    dateIso: "2024-06-01",
    excerpt:
      "The company returned to Shakespeare's great tragedy of young love for the Pinkney Park summer festival.",
    href: "/productions/past-productions/",
    image: IMG.muchAdo,
  },
  {
    title: "2023: As You Like It under the stars",
    category: "Production",
    date: "Jun 2023",
    dateIso: "2023-06-01",
    excerpt:
      "A beloved pastoral comedy returned to Rowayton, continuing the tradition of picnics, blankets, and live Shakespeare by the water.",
    href: "/productions/past-productions/",
    image: IMG.park,
  },
  {
    title: "2022: King John — a first for our stage",
    category: "Production",
    date: "Jun 2022",
    dateIso: "2022-06-01",
    excerpt:
      "Shakespeare on the Sound staged King John for the first time in company history — expanding the canon beyond the usual summer favorites.",
    href: "/productions/past-productions/",
    image: IMG.education,
  },
  {
    title: "2021: Midsummer returns for the 25th season",
    category: "History",
    date: "Jun 2021",
    dateIso: "2021-06-01",
    excerpt:
      "After the pandemic pause, Shakespeare on the Sound returned to Pinkney Park with A Midsummer Night's Dream to rave reviews for the 25th season.",
    href: "/about/mission-history/",
    image: IMG.kids,
  },
  {
    title: "2020: Virtual stages when the park went dark",
    category: "History",
    date: "2020",
    dateIso: "2020-06-01",
    excerpt:
      "When outdoor programming was cut short, the company held a virtual Macbeth reunion, a Short New Play Festival, A Christmas Carol on Zoom, and a high-school new-play festival.",
    href: "/about/mission-history/",
    image: IMG.education,
  },

  // ─── Mid era / artistic milestones ─────────────────────────────
  {
    title: "2019: Twelfth Night closes a quarter century",
    category: "Production",
    date: "Jun 2019",
    dateIso: "2019-06-01",
    excerpt:
      "A captivating Twelfth Night rounded out 25 years of outdoor Shakespeare alongside year-round education programs across southern Connecticut.",
    href: "/productions/past-productions/",
    image: IMG.park,
  },
  {
    title: "2018: A Midsummer Night's Dream — year twenty-three",
    category: "Production",
    date: "Jun 2018",
    dateIso: "2018-06-01",
    excerpt:
      "The twenty-third season brought another magical Midsummer to Pinkney Park's natural amphitheater on the Five Mile River.",
    href: "/productions/past-productions/",
    image: IMG.kidsKings,
  },
  {
    title: "2017: Macbeth & the Apprentice Company pre-show",
    category: "Production",
    date: "Jun 2017",
    dateIso: "2017-06-01",
    excerpt:
      "Macbeth took the main stage while the Apprentice Company continued its beloved nightly pre-show for children of all ages.",
    href: "/education/apprentice-application/",
    image: IMG.parkPerf,
  },
  {
    title: "2016: Claire Shannon Kelly stages Hamlet",
    category: "History",
    date: "Jun 2016",
    dateIso: "2016-06-01",
    excerpt:
      "Claire Shannon Kelly stepped in as Artistic Director and staged an enormously successful Hamlet — still a landmark season for the company.",
    href: "/about/mission-history/",
    image: IMG.education,
  },
  {
    title: "2015: Twentieth anniversary — All's Well That Ends Well",
    category: "History",
    date: "2015",
    dateIso: "2015-06-01",
    excerpt:
      "Shakespeare on the Sound celebrated twenty years with All's Well That Ends Well and honored the founders who started it all around a Rowayton kitchen table.",
    href: "/about/mission-history/",
    image: IMG.maanBanner,
  },
  {
    title: "Founders honored at the 2015 annual gala",
    category: "Events",
    date: "18 Apr 2015",
    dateIso: "2015-04-18",
    excerpt:
      "At Wee Burn Country Club, the gala celebrated Megan Crowley McAllister, Ezra Barnes, and the original board on the company's twentieth anniversary.",
    href: "https://www.broadwayworld.com/connecticut/article/Shakespeare-on-the-Sound-to-Host-Annual-Gala-418-20150320",
    image: IMG.gala,
    external: true,
  },

  // ─── Education & Greenwich years ───────────────────────────────
  {
    title: "Speaking Daggers: Shakespeare against bullying",
    category: "Education",
    date: "Oct 2012",
    dateIso: "2012-10-01",
    excerpt:
      "Director of Education Emily Bryan's anti-bullying workshop — piloted with nearly 800 students in Norwalk — used Shakespeare to teach empathy, conflict resolution, and standing up to aggression.",
    href: "https://www.broadwayworld.com/connecticut/article/Shakespeare-on-the-Sound-Seeks-17500-for-Anti-Bullying-Program-Speaking-Daggers-20121002",
    image: IMG.education,
    external: true,
  },
  {
    title: "2013–2014: Rowayton again, guest directors & Speaking Daggers",
    category: "History",
    date: "2013",
    dateIso: "2013-06-01",
    excerpt:
      "Steven Yuhasz became Executive Director; As You Like It (Claire Shannon Kelly) won critical praise; Emily Bryan expanded schools programming and launched Speaking Daggers; 2014 brought Two Gentlemen of Verona.",
    href: "/about/mission-history/",
    image: IMG.kids,
  },
  {
    title: "2010: Othello with Joanna Settle & Stew",
    category: "Production",
    date: "2010",
    dateIso: "2010-06-01",
    excerpt:
      "Artistic Director Joanna Settle directed Othello with original music by Tony Award-winning songwriter Stew — playing both Pinkney Park and Baldwin Park, Greenwich.",
    href: "https://www.broadwayworld.com/connecticut/article/Shakespeare-on-the-Sound-Presents-OTHELLO-In-The-Summer-Of-2010-20091105",
    image: IMG.parkPerf,
    external: true,
  },
  {
    title: "2009: Midsummer draws nearly 14,000 — largest audience ever",
    category: "History",
    date: "Jul 2009",
    dateIso: "2009-07-01",
    excerpt:
      "Joanna Settle's first season as Artistic Director, with music by Stew, drew nearly fourteen thousand people. The New York Times reviewed the production; the Apprentice Company and a play-reading series launched.",
    href: "https://www.nytimes.com/2009/07/02/theater/reviews/02dream.html",
    image: IMG.park,
    external: true,
  },
  {
    title: "2007–2008: Two venues — Rowayton & Greenwich",
    category: "History",
    date: "2007",
    dateIso: "2007-06-01",
    excerpt:
      "After Comedy of Errors and Julius Caesar seasons, Shakespeare on the Sound tested Baldwin Park on Greenwich harbor — transferring the Rowayton run for added waterfront performances.",
    href: "/about/mission-history/",
    image: IMG.park,
  },

  // ─── Growth years & founding ───────────────────────────────────
  {
    title: "2000–2006: Sixteen performances and 9,000 spectators a year",
    category: "History",
    date: "2000",
    dateIso: "2000-06-01",
    excerpt:
      "Seasons stretched to sixteen performances: Midsummer, Henry V, As You Like It, Merchant of Venice, The Winter's Tale, The Tempest, and Macbeth. The annual gala became a Fairfield County staple.",
    href: "/about/mission-history/",
    image: IMG.parkPerf,
  },
  {
    title: "1997–1999: Growing the festival",
    category: "History",
    date: "1997",
    dateIso: "1997-06-01",
    excerpt:
      "Performances grew from eight to twelve with Twelfth Night, The Taming of the Shrew, and Romeo and Juliet — community support locked in financial stability.",
    href: "/productions/past-productions/",
    image: IMG.muchAdo,
  },
  {
    title: "1996: First Much Ado — 6,000 find Pinkney Park",
    category: "History",
    date: "1996",
    dateIso: "1996-06-01",
    excerpt:
      "Rowayton's 6th Taxing District approved Pinkney Park on the Five Mile River. The inaugural Much Ado About Nothing drew an estimated 6,000 people to the natural amphitheater.",
    href: "/about/mission-history/",
    image: IMG.maanBanner,
  },
  {
    title: "1995: Founded around a Rowayton kitchen table",
    category: "History",
    date: "1995",
    dateIso: "1995-01-01",
    excerpt:
      "Megan Crowley McAllister recruited Ezra Barnes (founding artistic director) and six neighbors — Susan Reed Basche, Dorsey Gude, Tim Massad, Adrienne & Steven Southworth, Andrew Woolford — to launch outdoor Shakespeare in Fairfield County.",
    href: "/about/mission-history/",
    image: IMG.season,
  },
  {
    title: "Mission: affordable Shakespeare & year-round education",
    category: "News",
    date: "Ongoing",
    dateIso: "1995-06-01",
    excerpt:
      "Shakespeare on the Sound produces professional open-air theatre and builds community through schools, libraries, camps, apprentices, and adult enrichment across Fairfield County.",
    href: "/about/mission-history/",
    image: IMG.education,
  },
  {
    title: "Full production archive: 1996–2026",
    category: "History",
    date: "Archive",
    dateIso: "1995-01-01",
    excerpt:
      "From the first Much Ado through Macbeth, Hamlet, King John, and the 30th-anniversary return to Much Ado About Nothing — every summer season in one place.",
    href: "/productions/past-productions/",
    image: IMG.park,
  },
].slice().sort((a, b) => String(b.dateIso).localeCompare(String(a.dateIso)));

/** Homepage / season hub: current cycle items (also included in the full archive). */
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
