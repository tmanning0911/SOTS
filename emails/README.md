# Shakespeare on the Sound — HTML Emails

Hand-coded HTML email templates inspired by a clean editorial newsletter layout (centered logo, framed hero, intro + pill CTA, 2×2 events grid, social footer).

## Folder structure

```
emails/
  README.md
  assets/                          ← all images used by templates (self-contained)
    sots-logo.jpg
    hero-under-the-stars.jpg
    event-much-ado.jpg
    event-kids-show.jpg
    event-opening-night.jpg
    event-directors-discuss.jpg
  templates/
    step-inside-summer-2026.html   ← full sample (start here)
    newsletter-blank.html          ← same chrome, placeholder body
```

## Before you send

1. **Host images** — For local preview, images load from `emails/assets/` automatically. When sending via an ESP, upload `emails/assets/` to your web host and replace `../assets/` in the HTML with your absolute URL (e.g. `https://www.shakespeareonthesound.org/emails/assets/`).
2. **Merge tags** — Swap `{{UNSUBSCRIBE_URL}}`, `{{VIEW_IN_BROWSER_URL}}`, and `{{PREFERENCES_URL}}` for your ESP (Mailchimp, Constant Contact, etc.).
3. **Test** — Paste HTML into [Litmus](https://www.litmus.com/) or send test messages to Gmail, Apple Mail, and Outlook.
4. **Preheader** — Edit the hidden preheader line at the top of each template (shows in inbox preview).

## Design tokens (SOTS)

| Token | Light mode | Dark mode | Notes |
|-------|------------|-----------|-------|
| Body text | `#2b2b2b` on `#ffffff` | `#e2e5e9` on `#1e2226` | 16px min, 1.65 line-height |
| Headings | `#1a1a1a` | `#f3f4f6` | Reduced letter-spacing for readability |
| Links | `#1a5090` + underline | `#9ec5f5` + underline | WCAG AA contrast |
| Buttons | White on `#0f2d4d` | Dark text on `#5a9fd4` | 14px min, 2px border |
| Muted footer | `#525252` | `#b8bec6` | Never below 15px equivalent |

Templates include `color-scheme: light dark` meta tags and `@media (prefers-color-scheme: dark)` plus Outlook `[data-ogsc]` / `[data-ogsb]` overrides.

**Avoid:** gold text on blue backgrounds (fails contrast). Use white on blue instead.

## Creating a new email

1. Duplicate `templates/newsletter-blank.html`
2. Update `<title>`, preheader, hero image, intro copy, and event grid cells
3. Keep the outer 600px table structure — it is tested for Outlook + mobile

## Preview locally

Open any file in `templates/` directly in a browser, or run:

```bash
open emails/templates/step-inside-summer-2026.html
```

Browsers will load images from the `IMAGE_BASE` URL defined at the top of each file.
