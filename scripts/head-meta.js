/**
 * Shared <head> markup — Front-End Checklist (SEO, OG, performance hints)
 * Used by generate-pages.js and mirrored in index.html
 */

const SITE_URL = "https://www.shakespeareonthesound.org";
const OG_IMAGE =
  "https://static.wixstatic.com/media/2fda61_ed5498c346784fa7a58d686004f62ad1~mv2.jpg/v1/fill/w_1200,h_630,al_c,q_85,usm_0.66_1.00_0.01/2fda61_ed5498c346784fa7a58d686004f62ad1~mv2.jpg";
const FAVICON =
  "https://static.wixstatic.com/media/2fda61_2e65ecb094584570823c5e5c30d11c49~mv2.jpg/v1/fill/w_32,h_32,al_c,q_85/2fda61_2e65ecb094584570823c5e5c30d11c49~mv2.jpg";

export function renderHead({
  title,
  description,
  path = "/",
  image = OG_IMAGE,
  noindex = false,
}) {
  const canonical = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path.replace(/\/$/, "")}/`;
  const fullTitle =
    path === "/" ? title : `${title} | Shakespeare on the Sound`;

  return `  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="theme-color" content="#0a3d30" />
  <meta name="robots" content="${noindex ? "noindex, nofollow" : "index, follow"}" />
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" href="${FAVICON}" sizes="32x32" />
  <link rel="apple-touch-icon" href="${FAVICON}" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Shakespeare on the Sound" />
  <meta property="og:title" content="${escapeHtml(fullTitle)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:locale" content="en_US" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@shakesonsound" />
  <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${image}" />
  <link rel="preconnect" href="https://static.wixstatic.com" crossorigin />
  <link rel="dns-prefetch" href="https://static.wixstatic.com" />`;
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
