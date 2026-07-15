# Sitewide Square checkout (quantities + multi-item)

Patrons pick quantities (and mix items) on-site; we create a Square Payment Link order via
`POST /api/checkout/payment-link` (`netlify/functions/create-payment-link.mjs`).

| Surface | Flow |
| --- | --- |
| **Tickets** | Qty per tier in picker → one **Checkout with Square** |
| **Shop** | Qty + Add to cart / Buy now → cart can mix SKUs → **Checkout with Square** |
| **Mahjong** | Qty per ticket/sponsor tier → one **Checkout with Square** |

Static Payment Links (`square.link`) remain as email one-click fallbacks (always qty 1). Prefer
landing-page CTAs when someone needs more than one item.

## Fallback link catalogs (optional / email)

```bash
npm run sync:shop-links
npm run sync:ticket-links
npm run sync:mahjong-links
```

Requires `SQUARE_ACCESS_TOKEN` and `SQUARE_APPLICATION_ID`.
