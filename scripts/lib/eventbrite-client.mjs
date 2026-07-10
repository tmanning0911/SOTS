const API_BASE = "https://www.eventbriteapi.com/v3";
export const AFFILIATE_CODE = "ebdsoporgprofile";

export function affiliateUrl(url) {
  if (!url) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}aff=${AFFILIATE_CODE}`;
}

export function createEventbriteClient(token) {
  if (!token?.trim()) {
    throw new Error("Missing EVENTBRITE_API_TOKEN");
  }

  const api = async (endpoint) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { Authorization: `Bearer ${token.trim()}` },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(body.error_description || body.error || res.statusText);
    }
    return body;
  };

  const fetchPaginated = async (buildPath) => {
    const items = [];
    let page = 1;
    let hasMore = true;
    while (hasMore) {
      const data = await api(buildPath(page));
      const key = Object.keys(data).find((k) => Array.isArray(data[k]) && k !== "pagination");
      if (key) items.push(...data[key]);
      hasMore = Boolean(data.pagination?.has_more_items);
      page += 1;
    }
    return items;
  };

  return { api, fetchPaginated };
}

export function loadEnvFile(filePath, fs) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}
