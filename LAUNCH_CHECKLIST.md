# Launch checklist — needs your action

These items cannot be completed in code alone. Do them in Netlify, DNS, or email before go-live.

## Required before launch

### 1. Netlify form email notifications
After a Git deploy, open **Netlify → Forms** and confirm these forms exist:

- `contact`
- `education`
- `newsletter`
- `sponsorship`

For each form (or one shared inbox), enable **Form notifications → Email notification**.

Without this, submissions may be stored but **no one receives email**.

### 2. Admin password
In **Netlify → Site configuration → Environment variables**, set:

- `ADMIN_PASSWORD` — staff login for `/admin`

Redeploy after saving. Test login at `https://your-site.netlify.app/admin/login`.

Optional: `ADMIN_SECRET` for signed session cookies (recommended for production).

### 3. Custom domain DNS
The new React site lives on Netlify (`ubiquitous-maamoul-8b9b7f.netlify.app`).

To replace the old Wix site at **www.shakespeareonthesound.org**:

1. Netlify → **Domain management** → Add domain
2. Update DNS at your registrar per Netlify’s instructions
3. Enable HTTPS

### 4. Always deploy via Git
Use `npm run deploy` (pushes to the `netlify` remote).

**Do not** rely on drag-and-drop uploads for production — admin APIs and form functions require Git deploy.

---

## Recommended after launch

### 5. Test all four forms
Submit a test from Contact, Education, Newsletter, and Sponsorship flows. Confirm email arrives and Netlify Forms shows the entry.

### 6. Google Search Console
Add the property for `www.shakespeareonthesound.org`, submit `sitemap.xml`, request indexing for `/` and `/plays`.

### 7. Analytics (optional)
The site currently uses **essential cookies only**. If you add Google Analytics or Plausible later, tell your developer to wire it to cookie consent.

### 8. CMS content workflow
Admin edits (plays, news, learning) save to Netlify Blobs. **Events, FAQs, team, and milestones** still require editing `public/data/*.json` and redeploying unless admin is extended.

After admin publishes a news article, run a **new deploy** if you want it in `sitemap.xml` (sitemap is generated at build time).

---

## Already handled in code

- Security headers and CSP (`netlify.toml`)
- Cookie consent banner and `/cookie-policy`
- SEO titles, Open Graph, JSON-LD
- Mobile nav, donate tab, responsive layout
- Image and nav anchor validation (`npm run audit`)

Run before each deploy:

```bash
npm run audit
```
