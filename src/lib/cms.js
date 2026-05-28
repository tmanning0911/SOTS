/**
 * Shakespeare on the Sound — content & admin API (JSON + Netlify Blobs).
 */
const TOKEN_KEY = 'sots_admin_token';

const COLLECTIONS = {
  plays: 'plays',
  articles: 'articles',
  learning: 'learning',
};

function apiBase(path) {
  return path;
}

async function readStaticCollection(collection, sort = '') {
  const res = await fetch(`/data/${collection}.json`);
  if (!res.ok) throw new Error(`Failed to load ${collection}`);
  const items = await res.json();
  return sortItems(items, sort);
}

async function readCollection(collection, sort = '') {
  if (import.meta.env.DEV) {
    return readStaticCollection(collection, sort);
  }
  try {
    const params = new URLSearchParams({ collection });
    if (sort) params.set('sort', sort);
    const res = await fetch(apiBase(`/api/content?${params}`));
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return res.json();
    }
    if (res.ok && contentType.includes('text/html')) {
      return readStaticCollection(collection, sort);
    }
    if (res.status === 403 || res.status === 401) {
      throw new Error(`Failed to load ${collection}`);
    }
  } catch (err) {
    if (err?.message?.startsWith('Failed to load')) throw err;
  }
  return readStaticCollection(collection, sort);
}

function sortItems(items, sortKey) {
  if (!sortKey) return items;
  const desc = sortKey.startsWith('-');
  const field = desc ? sortKey.slice(1) : sortKey;
  return [...items].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av === bv) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === 'number' && typeof bv === 'number') {
      return desc ? bv - av : av - bv;
    }
    return desc ? String(bv).localeCompare(String(av)) : String(av).localeCompare(String(bv));
  });
}

function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

async function adminRequest(body) {
  const token = getToken();
  const res = await fetch(apiBase('/api/content-admin'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function collectionApi(collection) {
  return {
    list: (sort) => readCollection(collection, sort),
    create: (data) => adminRequest({ action: 'create', collection, data }).then((r) => r.item),
    update: (id, data) => adminRequest({ action: 'update', collection, id, data }).then((r) => r.item),
    delete: (id) => adminRequest({ action: 'delete', collection, id }),
  };
}

export const cms = {
  plays: collectionApi(COLLECTIONS.plays),
  articles: collectionApi(COLLECTIONS.articles),
  learning: collectionApi(COLLECTIONS.learning),
  admin: {
    async login(password) {
      const res = await fetch(apiBase('/api/admin-auth'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Login failed');
      sessionStorage.setItem(TOKEN_KEY, data.token);
      return data.user;
    },
    async me() {
      const token = getToken();
      if (!token) throw new Error('Unauthorized');
      const res = await fetch(apiBase('/api/admin-auth'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Unauthorized');
      return data.user;
    },
    logout() {
      sessionStorage.removeItem(TOKEN_KEY);
    },
  },
};
