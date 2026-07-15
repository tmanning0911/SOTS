/**
 * Google Maps helpers for event venue embeds.
 */

export function googleMapsUrls(query) {
  const q = String(query || "").trim();
  if (!q) return null;
  const encoded = encodeURIComponent(q);
  return {
    embedUrl: `https://www.google.com/maps?q=${encoded}&output=embed`,
    linkUrl: `https://www.google.com/maps/search/?api=1&query=${encoded}`,
  };
}

/**
 * Prefer explicit map fields on an event, otherwise build from location string.
 * @param {{ location?: string, mapEmbedUrl?: string, mapLinkUrl?: string, mapQuery?: string }} event
 */
export function eventMapUrls(event) {
  if (!event) return null;
  if (event.mapEmbedUrl || event.mapLinkUrl) {
    return {
      embedUrl: event.mapEmbedUrl || googleMapsUrls(event.mapQuery || event.location)?.embedUrl || null,
      linkUrl: event.mapLinkUrl || googleMapsUrls(event.mapQuery || event.location)?.linkUrl || null,
    };
  }
  return googleMapsUrls(event.mapQuery || event.location);
}
