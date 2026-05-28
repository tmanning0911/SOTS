/**
 * Post-build: refresh sitemap.xml with canonical URLs.
 * Run: node scripts/generate-seo.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const siteUrl = (process.env.VITE_SITE_URL || 'https://www.shakespeareonthesound.org').replace(
  /\/$/,
  '',
);

const routes = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/plays', changefreq: 'weekly', priority: '0.95' },
  { loc: '/learning', changefreq: 'monthly', priority: '0.85' },
  { loc: '/support', changefreq: 'monthly', priority: '0.8' },
  { loc: '/about', changefreq: 'monthly', priority: '0.8' },
  { loc: '/news', changefreq: 'weekly', priority: '0.75' },
  { loc: '/watch', changefreq: 'monthly', priority: '0.6' },
];

const lastmod = new Date().toISOString().slice(0, 10);

const urls = routes
  .map(
    (r) => `  <url>
    <loc>${siteUrl}${r.loc === '/' ? '' : r.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const distDir = path.resolve('dist');
const publicDir = path.resolve('public');

mkdirSync(distDir, { recursive: true });
writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);

const robots = `# https://www.shakespeareonthesound.org/robots.txt
User-agent: *
Allow: /

Disallow: /admin
Disallow: /admin/
Disallow: /api/content-admin
Disallow: /api/admin-auth

Sitemap: ${siteUrl}/sitemap.xml
`;

writeFileSync(path.join(distDir, 'robots.txt'), robots);
writeFileSync(path.join(publicDir, 'robots.txt'), robots);

console.log(`SEO files written for ${siteUrl}`);
