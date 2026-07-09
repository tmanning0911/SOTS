/** Slug for /images/{folder}/{slug}.jpg headshots. */
export function profileSlug(name) {
  return name
    .replace(/&/g, " and ")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function profileInitials(name) {
  const cleaned = name.replace(/&/g, " ").replace(/[^a-zA-Z\s]/g, " ").trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (!words.length) return "?";

  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  const first = words[0][0];
  const last = words[words.length - 1][0];
  return `${first}${last}`.toUpperCase();
}
