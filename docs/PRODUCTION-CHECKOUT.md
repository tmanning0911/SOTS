# Production checkout

Ticket and gift shop checkout use **Square Web Payments** on Netlify. Configure these in **Netlify → Site settings → Environment variables** for the **Production** context.

## Required (live payments)

| Variable | Value |
|----------|--------|
| `SQUARE_ENVIRONMENT` | `production` |
| `SQUARE_APPLICATION_ID` | Production app ID from [Square Developer Dashboard](https://developer.squareup.com/) |
| `SQUARE_ACCESS_TOKEN` | Production access token |
| `SQUARE_LOCATION_ID` | Your Square location ID (Pinkney Park / org location) |
| `RESEND_API_KEY` | For order confirmation emails **and** My Tickets magic-link emails |
| `RESEND_FROM_EMAIL` | Verified sender, e.g. `Shakespeare on the Sound <tickets@shakespeareonthesound.org>` |
| `PATRON_AUTH_SECRET` | HMAC secret for My Tickets sign-in (`openssl rand -hex 32`) |
| `TICKETING_TEST_MODE` | `false` (set automatically in `netlify.toml` for production builds) |

## Preview / QA (Netlify deploy previews)

Deploy previews set `TICKETING_TEST_MODE=true` so fake future dates appear when the real season catalog has no on-sale performances.

For **sandbox card testing** on preview, also set (Deploy Preview context only):

| Variable | Value |
|----------|--------|
| `SQUARE_ENVIRONMENT` | `sandbox` |
| `SQUARE_APPLICATION_ID` | Sandbox app ID |
| `SQUARE_ACCESS_TOKEN` | Sandbox access token |

Use Square sandbox test card `4111 1111 1111 1111`.

## Production behavior

- **Test performances** (`test-perf-*`) are stripped from the catalog and blocked at checkout.
- **Square** uses `web.squarecdn.com` and `connect.squareup.com` (CSP already allows both).
- **Real charges** only when `SQUARE_ENVIRONMENT=production` and patrons use real cards.
- When the season has ended, the tickets page shows no purchasable dates until `eventbrite.json` is synced with a new season and `npm run build` is deployed.

## After DNS cutover

1. Point `www.shakespeareonthesound.org` to Netlify.
2. Confirm production env vars above are set on the **Production** context (not only preview).
3. Run a live $1 test purchase, then refund in Square Dashboard.
4. Confirm confirmation email arrives (`RESEND_API_KEY`).

## Sync ticket dates

```bash
npm run sync:ticketing   # rebuild public/data/ticketing.json from eventbrite.json
npm run deploy:push
```

## Square ticket reporting (catalog line items)

Ticket checkout uses **Square for payment only**. Optionally, sync ticket **tiers** (General Admission, VIP, etc.) into Square Catalog so each sale appears in Square with proper line items — not one lump sum.

Ticket types use SKUs like `SOTS-TIX-GENERAL-ADMISSION`. They are **not** shown in the gift shop. Performance date is stored on the Square order note and metadata.

```bash
npm run sync:ticketing          # refresh ticket tiers + dates
npm run sync:square-tickets     # push tiers to Square, write square-ticket-catalog.json
npm run deploy:push
```

Run `sync:square-tickets` once per environment (sandbox for preview, production for live). Re-run when ticket prices change.

If `public/data/square-ticket-catalog.json` is missing or incomplete, checkout still works — payments fall back to a single charge with a note.
