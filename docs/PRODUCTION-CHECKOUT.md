# Production checkout

Ticket and gift shop checkout use **Square Web Payments** on Netlify. Configure these in **Netlify → Site settings → Environment variables** for the **Production** context.

## Required (live payments)

| Variable | Value |
|----------|--------|
| `SQUARE_ENVIRONMENT` | `production` |
| `SQUARE_APPLICATION_ID` | Production app ID from [Square Developer Dashboard](https://developer.squareup.com/) |
| `SQUARE_ACCESS_TOKEN` | Production access token |
| `SQUARE_LOCATION_ID` | Your Square location ID (Pinkney Park / org location) |
| `RESEND_API_KEY` | For order confirmation emails |
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
