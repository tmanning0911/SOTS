# Operating the SOTS Website

Quick guide for staff and volunteers — no coding required for day-to-day updates.

## Edit content (easiest: Admin panel)

1. Deploy on Netlify with `ADMIN_PASSWORD` set (see README).
2. Go to **your-site.netlify.app/admin/login**
3. Sign in and edit:
   - **Productions** — shows, dates, ticket links
   - **News** — articles and announcements
   - **Learning** — education programs

Changes save to Netlify and appear after a few seconds.

## Edit content (no admin: JSON files)

Edit files in `public/data/` and redeploy:

| File | What it controls |
|------|------------------|
| `plays.json` | Main stage & kids show |
| `articles.json` | News page |
| `learning.json` | Education programs |
| `faqs.json` | About page FAQs |
| `team.json` | Staff on About page |
| `milestones.json` | History timeline |

Site-wide text (address, gala, donate link): `src/content/site.js`

## Sync from live Wix site

To pull fresh copy from [shakespeareonthesound.org](https://www.shakespeareonthesound.org/):

```bash
npm run scrape
```

Output is saved to `public/data/scraped/` for reference — review and copy into the JSON files above.

## Form submissions (contact, education, newsletter, sponsorship)

Visitors can submit forms on **Home**, **About**, **Contact** (`/contact`), **Learning**, **Support**, and the **footer** mailing list.

### Netlify Forms (production — Git deploy)

1. In Netlify → **Forms**, confirm these forms appear after deploy: `contact`, `education`, `newsletter`, `sponsorship`.
2. **Form notifications** → add email addresses for each form (or one shared inbox).
3. Submissions also appear under **Forms** in the dashboard.

Forms are registered via `public/forms.html` at build time. If a form is missing in the dashboard, redeploy from Git (not drag-and-drop only).

### Backup API (optional)

`POST /api/contact` stores a copy in Netlify Blobs (`sots-form-submissions`) when functions run. Local dev logs to `.dev-form-submissions.jsonl`.

### If email stops working

| Issue | Fix |
|-------|-----|
| Form not in Netlify dashboard | Redeploy from Git; ensure `public/forms.html` is in the build |
| Submit succeeds but no email | Enable notifications under Netlify → Forms |
| Error in browser | Check spam; use mailto links on Contact page as fallback |

## Deploy

**Git (recommended)** — Netlify watches the `netlify` remote repo and rebuilds on push:

```bash
npm run deploy
# same as: git push netlify main
```

Live site: **https://ubiquitous-maamoul-8b9b7f.netlify.app**

Optional: `git push origin main` backs up code to the SOTS GitHub repo (does not trigger Netlify).

**Drag-and-drop** — after `npm run build`, upload `NETLIFY-DROP-UPLOAD.zip` in Netlify → Deploys.

> Drag-and-drop does **not** run admin APIs. Use Git deploy for `/admin`.

## Key links to keep updated

- **Tickets:** Eventbrite URL in `site.ticketsUrl` and `plays.json`
- **Donate:** PayPal in `site.donateUrl`
- **YouTube:** `site.youtubeUrl`

## Troubleshooting

| Issue | Fix |
|-------|-----|
| News/plays empty on Netlify | Ensure `public/data/*.json` is in the build; check browser console |
| Admin won’t log in | Set `ADMIN_PASSWORD` in Netlify env; redeploy |
| Old content after edit | Hard refresh (Cmd+Shift+R) or clear cache |
| 404 on `/news/xyz` | Add article with matching `id` in `articles.json` |

## Support

Technical: repository owner. Content: contactus@shakespeareonthesound.org
