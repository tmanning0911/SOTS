/**
 * Legacy static-page head helper — delegates to js/seo.js.
 * Prefer usePageMeta / generate-seo.mjs for the SPA.
 */
import {
  SITE_META,
  absoluteAssetUrl,
  absoluteUrl,
  escapeHtml,
  formatDocumentTitle,
  toCanonicalPath,
} from "../js/seo.js";

export function renderHead({
  title,
  description,
  path = "/",
  image = SITE_META.ogImage,
  noindex = false,
}) {
  const canonicalPath = toCanonicalPath(path);
  const canonical = absoluteUrl(canonicalPath);
  const fullTitle = formatDocumentTitle(title, { isHome: canonicalPath === "/" });
  const ogImage = absoluteAssetUrl(image);

  return `  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="theme-color" content="${SITE_META.themeColor}" />
  <meta name="robots" content="${noindex ? "noindex, nofollow" : "index, follow"}" />
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <link rel="canonical" href="${escapeHtml(canonical)}" />
  <link rel="icon" href="${SITE_META.favicon}" sizes="32x32" />
  <link rel="apple-touch-icon" href="${SITE_META.appleTouchIcon}" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${SITE_META.name}" />
  <meta property="og:title" content="${escapeHtml(fullTitle)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${escapeHtml(canonical)}" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />
  <meta property="og:locale" content="${SITE_META.locale}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="${SITE_META.twitter}" />
  <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(ogImage)}" />
  <link rel="preconnect" href="https://static.wixstatic.com" crossorigin />
  <link rel="dns-prefetch" href="https://static.wixstatic.com" />`;
}
