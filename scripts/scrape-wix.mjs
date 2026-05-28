#!/usr/bin/env node
/**
 * Scrape text content from shakespeareonthesound.org (Wix) pages.
 * Usage: node scripts/scrape-wix.mjs
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../public/data/scraped');

const PAGES = [
  { slug: 'home', url: 'https://www.shakespeareonthesound.org/' },
  { slug: 'muchado26', url: 'https://www.shakespeareonthesound.org/muchado26' },
  { slug: 'kids-show', url: 'https://www.shakespeareonthesound.org/kids-show' },
  { slug: 'mission-history', url: 'https://www.shakespeareonthesound.org/mission-history' },
  { slug: 'diversity-statement', url: 'https://www.shakespeareonthesound.org/diversity-statement' },
  { slug: 'staff', url: 'https://www.shakespeareonthesound.org/staff' },
  { slug: 'board-of-directors', url: 'https://www.shakespeareonthesound.org/board-of-directors' },
  { slug: 'faq', url: 'https://www.shakespeareonthesound.org/faq' },
  { slug: 'visit', url: 'https://www.shakespeareonthesound.org/visit' },
  { slug: 'getting-here', url: 'https://www.shakespeareonthesound.org/getting-here' },
  { slug: 'cancellation-policy', url: 'https://www.shakespeareonthesound.org/cancellation-policy' },
  { slug: 'in-schools', url: 'https://www.shakespeareonthesound.org/in-schools' },
  { slug: 'tours', url: 'https://www.shakespeareonthesound.org/tours' },
  { slug: 'summer-camps', url: 'https://www.shakespeareonthesound.org/summer-camps' },
  { slug: 'edu-in-the-park', url: 'https://www.shakespeareonthesound.org/edu-in-the-park' },
  { slug: 'apprentice-application', url: 'https://www.shakespeareonthesound.org/apprentice-application' },
  { slug: 'adult-enrichment', url: 'https://www.shakespeareonthesound.org/adult-enrichment' },
  { slug: 'donate', url: 'https://www.shakespeareonthesound.org/donate' },
  { slug: 'individual-giving', url: 'https://www.shakespeareonthesound.org/individual-giving' },
  { slug: 'program-ads-sponsorships', url: 'https://www.shakespeareonthesound.org/program-ads-sponsorships' },
  { slug: 'past-productions', url: 'https://www.shakespeareonthesound.org/past-productions' },
  { slug: 'contact', url: 'https://www.shakespeareonthesound.org/contact' },
];

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractBlocks(text) {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25 && !/^Wix\b/i.test(s) && !/cookie/i.test(s));
  const headings = text.match(
    /(?:Much Ado|Shakespeare|Education|Donate|Gala|Pinkney|Fairfield|Rowayton|Norwalk|Apprentice|Summer|Mission|Director|Board|FAQ|Visit|Cancel)[^.!?]{0,120}[.!?]?/gi
  );
  return { length: text.length, preview: text.slice(0, 800), sentences: sentences.slice(0, 40), headings: headings?.slice(0, 15) };
}

mkdirSync(OUT, { recursive: true });

const results = {};

for (const page of PAGES) {
  try {
    const res = await fetch(page.url, {
      headers: { 'User-Agent': 'SOTS-content-sync/1.0' },
    });
    const html = await res.text();
    const text = stripHtml(html);
    const data = {
      url: page.url,
      status: res.status,
      scrapedAt: new Date().toISOString(),
      ...extractBlocks(text),
    };
    results[page.slug] = data;
    writeFileSync(join(OUT, `${page.slug}.json`), JSON.stringify(data, null, 2));
    console.log(`✓ ${page.slug} (${data.length} chars)`);
  } catch (e) {
    console.error(`✗ ${page.slug}:`, e.message);
    results[page.slug] = { url: page.url, error: e.message };
  }
  await new Promise((r) => setTimeout(r, 400));
}

writeFileSync(join(OUT, 'index.json'), JSON.stringify(results, null, 2));
console.log(`\nWrote ${PAGES.length} pages to public/data/scraped/`);
