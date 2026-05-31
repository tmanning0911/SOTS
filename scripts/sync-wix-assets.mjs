#!/usr/bin/env node
/**
 * Download key images from shakespeareonthesound.org (Wix CDN).
 * Usage: node scripts/sync-wix-assets.mjs
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../public/images');

/** Wix media id → local path (under public/images) */
const ASSETS = [
  {
    id: '2fda61_ed5498c346784fa7a58d686004f62ad1~mv2.jpg',
    dest: 'news/season-maan-banner.jpg',
    note: 'Season_MAAN_WebBanner',
  },
  {
    id: '2fda61_62cb4626d7df4887b266915e2f9c3acf~mv2.png',
    dest: 'news/gala-promo.png',
    note: 'Gala promo graphic',
  },
  {
    id: '2fda61_58e853fcce884727a4deba3453b4c1ed~mv2.jpeg',
    dest: 'learning/kids-classroom.jpeg',
    note: 'Kids in classroom',
  },
  {
    id: '2fda61_399ba132b8fd486fbcecb61bd5bf0152~mv2.jpg',
    dest: 'news/kids-kings.jpg',
    note: 'SOS Kid Kings',
  },
  {
    id: '2fda61_7c217d43df9449748f30515a8625d28f~mv2.jpg',
    dest: 'backgrounds/park-audience-nyt.jpg',
    note: 'Park audience (NYT)',
  },
  {
    id: '2fda61_40d7e102e7e34217993b1143d8e3eb6b~mv2.jpg',
    dest: 'news/education-banner.jpg',
    note: 'Education digital banner',
  },
];

mkdirSync(join(OUT, 'news'), { recursive: true });
mkdirSync(join(OUT, 'learning'), { recursive: true });
mkdirSync(join(OUT, 'backgrounds'), { recursive: true });

for (const asset of ASSETS) {
  const url = `https://static.wixstatic.com/media/${asset.id}`;
  const dest = join(OUT, asset.dest);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'SOTS-asset-sync/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(dest, buf);
    console.log(`✓ ${asset.dest} (${asset.note}, ${Math.round(buf.length / 1024)}KB)`);
  } catch (e) {
    console.error(`✗ ${asset.dest}: ${e.message}`);
  }
}

console.log('\nDone.');
