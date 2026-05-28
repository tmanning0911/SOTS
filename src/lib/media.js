/**
 * WebP helpers — keep .png/.jpg as fallbacks and for OG/social crawlers.
 */
export function webpSrc(src) {
  if (!src || typeof src !== 'string') return null;
  if (!/\.(png|jpe?g)$/i.test(src)) return null;
  return src.replace(/\.(png|jpe?g)$/i, '.webp');
}

export function withWebp(src) {
  const webp = webpSrc(src);
  return webp ? { src, webp } : { src, webp: null };
}
