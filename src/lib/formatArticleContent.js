/** Strip published emails from CMS text and split into paragraphs. */

const EMAIL_REPLACEMENTS = [
  [/contactus@shakespeareonthesound\.org/gi, 'our contact form'],
  [/stephanie@shakespeareonthesound\.org/gi, 'our education team'],
  [/nick@shakespeareonthesound\.org/gi, 'our outreach team'],
  [/[a-z0-9._%+-]+@shakespeareonthesound\.org/gi, 'our team'],
];

export function sanitizePublicText(text) {
  if (!text) return '';
  let out = text;
  for (const [pattern, replacement] of EMAIL_REPLACEMENTS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

export function paragraphsFromContent(content) {
  return sanitizePublicText(content)
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}
