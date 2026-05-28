import { verifyAdmin } from './lib/auth.mjs';
import { corsHeaders, jsonResponse } from './lib/cors.mjs';
import {
  createItem,
  deleteItem,
  isValidCollection,
  updateItem,
} from './lib/contentStore.mjs';

export const handler = async (event) => {
  const { headers, allowed, origin } = corsHeaders(event, {
    methods: 'POST, OPTIONS',
  });

  if (event.httpMethod === 'OPTIONS') {
    if (!allowed && origin) return { statusCode: 403, headers };
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' }, event);
  }

  if (!allowed && origin) {
    return jsonResponse(403, { error: 'Origin not allowed' }, event);
  }

  const admin = verifyAdmin(event);
  if (!admin || admin.role !== 'admin') {
    return jsonResponse(401, { error: 'Unauthorized' }, event);
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON' }, event);
  }

  const { action, collection, id, data } = body;
  if (!isValidCollection(collection)) {
    return jsonResponse(400, { error: 'Unknown collection' }, event);
  }

  try {
    if (action === 'create') {
      const item = await createItem(collection, data || {});
      return jsonResponse(200, { item }, event);
    }
    if (action === 'update') {
      const item = await updateItem(collection, id, data || {});
      return jsonResponse(200, { item }, event);
    }
    if (action === 'delete') {
      await deleteItem(collection, id);
      return jsonResponse(200, { ok: true }, event);
    }
    return jsonResponse(400, { error: 'Unknown action' }, event);
  } catch (err) {
    const message = err?.message || 'Request failed';
    const status = message === 'Not found' ? 404 : 500;
    return jsonResponse(status, { error: message }, event);
  }
};
