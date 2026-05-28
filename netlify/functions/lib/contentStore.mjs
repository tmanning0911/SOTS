import crypto from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getStore } from '@netlify/blobs';

const COLLECTIONS = new Set(['plays', 'articles', 'learning']);
const STORE_NAME = 'sots-content';

const SEED_FILES = {
  plays: 'plays.json',
  articles: 'articles.json',
  learning: 'learning.json',
};

function stripMeta(item) {
  const {
    created_date,
    updated_date,
    created_by_id,
    created_by,
    is_sample,
    ...rest
  } = item;
  return rest;
}

function sortItems(items, sortKey) {
  const list = [...items];
  if (!sortKey) return list;
  const desc = sortKey.startsWith('-');
  const field = desc ? sortKey.slice(1) : sortKey;
  list.sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av === bv) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === 'number' && typeof bv === 'number') {
      return desc ? bv - av : av - bv;
    }
    return desc
      ? String(bv).localeCompare(String(av))
      : String(av).localeCompare(String(bv));
  });
  return list;
}

async function readSeed(collection) {
  const file = SEED_FILES[collection];
  const seedPath = path.join(process.cwd(), 'public', 'data', file);
  const raw = await readFile(seedPath, 'utf8');
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data.map(stripMeta) : [];
}

async function getBlobStore() {
  try {
    return getStore({ name: STORE_NAME, consistency: 'strong' });
  } catch {
    return null;
  }
}

export function isValidCollection(name) {
  return COLLECTIONS.has(name);
}

export async function getCollection(collection, sortKey) {
  const store = await getBlobStore();
  let items = null;
  if (store) {
    items = await store.get(collection, { type: 'json' });
  }
  if (!items) {
    items = await readSeed(collection);
  }
  return sortItems(items, sortKey);
}

export async function setCollection(collection, items) {
  const store = await getBlobStore();
  if (!store) {
    throw new Error('Content storage is not available');
  }
  await store.setJSON(collection, items);
  return items;
}

export async function createItem(collection, item) {
  const items = await getCollection(collection);
  const id = item.id || crypto.randomUUID();
  const next = { ...stripMeta(item), id };
  await setCollection(collection, [...items, next]);
  return next;
}

export async function updateItem(collection, id, patch) {
  const items = await getCollection(collection);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error('Not found');
  const updated = { ...items[idx], ...stripMeta(patch), id };
  const next = [...items];
  next[idx] = updated;
  await setCollection(collection, next);
  return updated;
}

export async function deleteItem(collection, id) {
  const items = await getCollection(collection);
  const next = items.filter((i) => i.id !== id);
  if (next.length === items.length) throw new Error('Not found');
  await setCollection(collection, next);
  return { ok: true };
}
