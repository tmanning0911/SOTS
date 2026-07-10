/**
 * Merge canonical content from Desktop/SOTS public/data into js/data.js and js/pages-data.js.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sotsDataCandidates = [
  path.resolve(root, "../SOTS/public/data"),
  path.resolve(root, "public/data"),
];
const sotsData = sotsDataCandidates.find((dir) => fs.existsSync(path.join(dir, "faqs.json")));

if (!sotsData) {
  throw new Error("Could not find SOTS data JSON (public/data/faqs.json).");
}

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(sotsData, name), "utf8"));
}

const faqs = readJson("faqs.json");
const articles = readJson("articles.json").filter((a) => a.published !== false);
const events = readJson("events.json");
const plays = readJson("plays.json");
const team = readJson("team.json");

const TICKETS_PAGE_PATH = "/productions/much-ado-about-nothing/";
const ticketsUrl = TICKETS_PAGE_PATH;

const dataPath = path.join(root, "js/data.js");
let data = fs.readFileSync(dataPath, "utf8");

data = data.replace(
  /ticketsUrl: "[^"]+"/,
  `ticketsUrl: "${ticketsUrl}"`,
);
if (!data.includes("donateUrl:")) {
  data = data.replace(
    /ticketsUrl: "[^"]+",/,
    `ticketsUrl: "${ticketsUrl}",\n  donateUrl: "https://www.paypal.com/donate/?hosted_button_id=5FTZQ4CXESHXY",`,
  );
} else {
  data = data.replace(
    /donateUrl: "[^"]+"/,
    `donateUrl: "https://www.paypal.com/donate/?hosted_button_id=5FTZQ4CXESHXY"`,
  );
}

const newsBlock = articles
  .slice(0, 4)
  .map((article) => {
    const href =
      article.category === "Production"
        ? "/productions/much-ado-about-nothing/"
        : article.category === "Education"
          ? "/education/in-schools/"
          : article.id === "gala-2026"
            ? "/support/events/"
            : "/#recent-news";
    const image = article.image?.startsWith("/") ? article.image : `/${article.image}`;
    return `  {
    title: ${JSON.stringify(article.title)},
    category: ${JSON.stringify(article.category)},
    excerpt: ${JSON.stringify(article.excerpt)},
    href: ${JSON.stringify(href)},
    image: ${JSON.stringify(image)},
  }`;
  })
  .join(",\n");

data = data.replace(
  /export const HOMEPAGE_NEWS = \[[\s\S]*?\];/,
  `export const HOMEPAGE_NEWS = [\n${newsBlock}\n];`,
);

const newsDates = articles.slice(0, 4).map((a) => a.date);
data = data.replace(
  /export const NEWS_LIST = HOMEPAGE_NEWS\.map\(\(item, i\) => \(\{[\s\S]*?\}\)\);/,
  `export const NEWS_LIST = HOMEPAGE_NEWS.map((item, i) => ({
  ...item,
  date: ${JSON.stringify(newsDates)}[i] ?? "",
}));`,
);

const sponsorsBlock = `export const SPONSORS = [
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
];`;

data = data.replace(/export const SPONSORS = \[[\s\S]*?\];/, sponsorsBlock);

fs.writeFileSync(dataPath, data);

const pagesPath = path.join(root, "js/pages-data.js");
let pages = fs.readFileSync(pagesPath, "utf8");

for (const faq of faqs) {
  const escapedQ = faq.question.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  pages = pages.replace(
    new RegExp(`(q: "${escapedQ}",\\s*\\n\\s*a: ")([^"]*)(")`),
    `$1${faq.answer.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}$3`,
  );
}

pages = pages.replace(
  /tickets: "https:\/\/MuchAdo2026\.eventbrite\.com"/g,
  `tickets: "${ticketsUrl}"`,
);

fs.writeFileSync(pagesPath, pages);

console.log("Synced from SOTS:");
console.log(`  ticketsUrl → ${ticketsUrl}`);
console.log(`  HOMEPAGE_NEWS → ${articles.slice(0, 4).length} articles`);
console.log(`  SPONSORS → 6 partners`);
console.log(`  FAQ answers → ${faqs.length} matched`);
console.log(`  team → ${team.length} members (pages-data staff section unchanged)`);
console.log(`  events → ${events.length} events (production pages include special events)`);
