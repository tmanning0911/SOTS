# Shakespeare on the Sound

Marketing site for Shakespeare on the Sound, built with React + Vite and deployed on **Netlify**.

## Local development

```bash
npm install
npm run dev
```

- Public pages load content from `public/data/*.json`.
- Admin at `/admin/login` — in dev, any password works and edits save to `public/data/`.

## Production (Netlify)

1. Create a **new** site in Netlify (Import from Git or drag-and-drop this folder).
2. Build settings (also in `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
3. Set environment variables in Netlify → Site configuration → Environment variables:

| Variable | Required | Notes |
|----------|----------|--------|
| `ADMIN_PASSWORD` | Yes | Password for `/admin/login` |
| `ADMIN_SECRET` | Recommended | Signs admin session tokens (can match a long random string; defaults to `ADMIN_PASSWORD` if unset) |
| `VITE_SITE_URL` | Recommended | Canonical site URL for SEO files (default in `netlify.toml`: `https://www.shakespeareonthesound.org`) |
| `SITE_ALLOWED_ORIGINS` | Recommended | Comma-separated origins allowed to call admin APIs; add your `*.netlify.app` preview URL |

4. Deploy. Content is served via Netlify Functions + **Netlify Blobs** (seeded from `public/data/` on first read).

## SEO

- Per-page `<title>`, meta description, canonical URL, Open Graph, and Twitter cards (`PageSEO` + `src/content/seo.js`)
- `robots.txt` and build-generated `sitemap.xml` (all public routes)
- JSON-LD structured data: `PerformingArtsTheater` + `TheaterEvent` (Much Ado 2026)
- `/admin` excluded from indexing (`noindex` + `X-Robots-Tag` header)

After deploy, submit `https://www.shakespeareonthesound.org/sitemap.xml` in [Google Search Console](https://search.google.com/search-console).

## Security

Netlify headers (see `netlify.toml`): **HSTS**, **CSP**, `X-Frame-Options: DENY`, `COOP`, `CORP`, `Referrer-Policy`, and `Permissions-Policy`.

- Admin APIs require allowed origins (`SITE_ALLOWED_ORIGINS`) — no more wildcard `Access-Control-Allow-Origin: *`
- Admin login rate-limited (8 attempts / 15 min per IP)
- `/.well-known/security.txt` for responsible disclosure contact

## Content

| Collection | File (seed) | Admin tab |
|------------|-------------|-----------|
| Productions | `public/data/plays.json` | Productions |
| News | `public/data/articles.json` | News & Articles |
| Learning | `public/data/learning.json` | Learning Programs |

Static images live in `public/images/`.

## Scripts

- `npm run dev` — Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build locally
- `npm run scrape` — pull text from shakespeareonthesound.org into `public/data/scraped/`

See **OPERATIONS.md** for a non-technical guide to updating content and deploying.
