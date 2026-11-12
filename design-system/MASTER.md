# Shakespeare on the Sound — Design System (MASTER)

> Visual language inspired by [Collage Dance Collective](https://collagedance.org/) — bold red CTAs, dark navy chrome, full-bleed photography, all-caps Montserrat, rectangular modules — filled with SOTS content and photos.

## Pattern

**Performance-forward, block-based.** Full-bleed hero, season feature + date-card sidebar, solid red statement banners, alternating image/copy program grids, split support CTAs. Avoid Orpheum gold-serif chrome, rounded cards, and SaaS pill clusters.

## Colors (sampled from live collagedance.org)

| Token | Usage |
| ----- | ----- |
| Red `#d00000` | Primary CTAs, statement banners, Donate / Get Tickets |
| Red deep `#a80000` | Hover |
| Navy `#181030` | “ONE” emphasis, Sign Up / Learn More buttons, chrome |
| Sidebar `#382858` | Event-card rail |
| Season gold `#c5a07d` | Season label |
| Footer `#783830` | Footer ground |
| Card `#f8f8f0` | Performance cards |
| Ink `#080018` / `#000010` | Dark page / season grounds |

## Typography

| Role | Font | Notes |
| ----- | ---- | ----- |
| Display | **Oswald** | Condensed all-caps headlines (hero, ESSENCE-style titles, banners) |
| UI / body / nav / buttons | **Montserrat** | Uppercase nav & CTAs; body copy |
| Dates | **Playfair Display** | Large month/day on performance cards |

## Homepage modules (`home--collage`)

1. Transparent chrome over full-viewport hero (`cdc-hero`)
2. Season feature + show cards (`cdc-season`)
3. Red “for everyone” banner (`cdc-everyone`)
4. Four-up programs grid (`cdc-programs`)
5. Split story CTAs (`cdc-story`)
6. Newsletter + sponsors + multi-column footer

## Components

### CTAs

Use `.cdc-btn` on collage surfaces — solid red, sharp corners, uppercase. Navy variant for buttons on red fields.

### Inner pages

Keep existing shells; brand tokens now map gold→red and navy→Collage navy so chrome/CTAs stay coherent.

## Motion

- Reveal on scroll via `data-reveal` (respect `prefers-reduced-motion`)
- Hover transitions **150–300ms**
- No neon glow or bounce

## Anti-patterns (avoid)

- Purple AI gradients as the primary look
- Rounded-full pills and multi-layer soft card shadows on marketing surfaces
- Crowding the first viewport with schedules, stats, or promo chips
- Detached badges/stickers on hero media

## Pre-delivery checklist

- [ ] `cursor-pointer` on all clickable non-button elements
- [ ] Visible `:focus-visible` rings (red/white, 2px)
- [ ] Text contrast ≥ 4.5:1 on body copy
- [ ] Responsive at 375, 768, 1024, 1440px
- [ ] `prefers-reduced-motion` disables transform transitions
- [ ] Hero images decorative bg use `aria-hidden`

## Page overrides

Add `design-system/pages/<slug>.md` only when a page deviates from this master (e.g. checkout minimal chrome).
