# Square checkout branding (SOTS)

Payment Links and Square-hosted checkout use the **Pinkney Park** location settings.

## Applied brand

| Setting | Value |
|---------|--------|
| Header | Framed business logo |
| Buy button | Navy `#0f2d4d`, rounded |
| Business | Shakespeare On The Sound |
| Apple Pay / Google Pay | Enabled on hosted checkout |

On-site ticket & gift-shop card fields are styled in `js/square-payments.js` (same navy/blue tokens).

## Refresh branding

```bash
npm run brand:square-checkout
```

(Requires Netlify `SQUARE_*` env vars, same as other Square scripts.)

## Preview

Open any Mahjong Payment Link, e.g. https://square.link/u/sYXElfNO

Logo is managed in Square Dashboard → Locations → Pinkney Park (already set).
