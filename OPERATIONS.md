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

## Deploy

**Git (recommended)** — push to GitHub; Netlify rebuilds automatically:

```bash
git push origin main
git push netlify main   # if Netlify uses the netlify remote
```

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
