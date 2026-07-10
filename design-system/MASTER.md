# Shakespeare on the Sound — Design System (MASTER)

> Derived from the homepage Orpheum layout, site brand tokens, and [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) guidance for **storytelling-driven / nonprofit** experiences.

## Pattern

**Storytelling-driven, hero-centric.** Lead with photography (Pinkney Park, cast, education), gold eyebrow labels, and clear arrow CTAs. Avoid generic SaaS card grids and purple AI gradients.

## Colors

| Token | Usage |
| ----- | ----- |
| Navy `#0f2d4d` | Headlines (plain heroes), chrome, footer |
| Gold `#c9a227` | Eyebrows, accents, CTA emphasis, section underlines |
| White `#fff` | Page backgrounds, text on cinematic heroes |
| Stone `#4a5560` | Body copy on light surfaces |

Cinematic heroes: photo + navy veil gradient (20% → 88% opacity).

## Typography

| Role | Font | Notes |
| ---- | ---- | ----- |
| Display / H1–H2 | **Marcellus** | Inner page heroes, section titles, checkout headings |
| UI / body | **Source Sans 3** | Paragraphs, nav, forms, metadata |

Period after display headings where established (`About Us.`, `Tickets.`).

## Components

### Inner page hero (`InnerPageHero`)

- **Cinematic** — background image, veil, white title, gold eyebrow, optional actions row
- **Plain** — white band, navy title, gold eyebrow (fallback when no image)
- **Compact** — reduced min-height for dense flows (tickets hub)

### CTAs

Use `ArrowButton` / `TicketArrowButton` — gold fill primary, ghost on dark heroes.

### Content sections

`PageSection` prose blocks, gold underline on `orpheum-inner-page__section-title`, max-width ~52rem for readability.

## Motion

- Reveal on scroll via `data-reveal` (respect `prefers-reduced-motion` in polish layer)
- Hover transitions **150–300ms** on interactive elements
- No harsh bounce or neon glow

## Anti-patterns (avoid)

- Emoji as icons
- Inter/Roboto-only generic stacks on marketing pages
- Flat white heroes with no visual anchor on key landing pages
- Missing hover/focus on accordions, filters, cards

## Pre-delivery checklist

- [ ] `cursor-pointer` on all clickable non-button elements
- [ ] Visible `:focus-visible` rings (gold, 2px)
- [ ] Text contrast ≥ 4.5:1 on body copy
- [ ] Responsive at 375, 768, 1024, 1440px
- [ ] `prefers-reduced-motion` disables transform transitions
- [ ] Hero images have meaningful alt on content images (decorative hero bg uses `aria-hidden`)

## Page overrides

Add `design-system/pages/<slug>.md` only when a page deviates from this master (e.g. checkout minimal chrome).
