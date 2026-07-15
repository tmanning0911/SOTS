# Square Payment Links — Mahjong Night

Landing page: `/events/mahjong-night/`

Live Payment Links are stored in `js/mahjong-night.js` (`paymentLink` on each tier).

## Create / refresh links

Credentials come from Netlify env (`SQUARE_*`). Locally:

```bash
# load Square env from Netlify, then:
npm run sync:mahjong-links
```

Or: `node scripts/create-mahjong-payment-links.mjs` with `SQUARE_ACCESS_TOKEN`, `SQUARE_APPLICATION_ID`, and `SQUARE_LOCATION_ID` set.

- Skips tiers that already have a `paymentLink`
- Redirect after pay: `/events/mahjong-night/?thanks=1`

## Current production links (Sept 19, 2026)

| Tier | Amount | Link |
|------|--------|------|
| Individual player | $100 | https://square.link/u/sYXElfNO |
| Table of four | $400 | https://square.link/u/D6CaPCTz |
| Patron player | $150 | https://square.link/u/vUHXO6wj |
| Beginner lesson | $125 | https://square.link/u/2vhHywYJ |
| Presenting sponsor | $2,500 | https://square.link/u/ZrS2MBBJ |
| Community sponsor | $1,000 | https://square.link/u/x7NnTN1M |
| Table sponsor | $500 | https://square.link/u/rZoYhlng |
| Tile sponsor | $250 | https://square.link/u/KEKvfqDh |
| Friend of SOTS | $100 | https://square.link/u/yqmPAOPL |

Manage in [Square Dashboard → Payment Links](https://squareup.com/dashboard/payment-links).
