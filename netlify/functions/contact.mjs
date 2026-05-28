import { getStore } from '@netlify/blobs';
import { jsonResponse } from './lib/cors.mjs';
import { getClientIp, rateLimit } from './lib/rateLimit.mjs';

const FORMS = new Set(['contact', 'education', 'newsletter', 'sponsorship']);
const STORE_NAME = 'sots-form-submissions';

function sanitize(str, max = 5000) {
  if (str == null) return '';
  return String(str).trim().slice(0, max);
}

function validatePayload(form, fields) {
  const email = sanitize(fields.email, 254).toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'A valid email address is required.' };
  }

  const name = sanitize(fields.name, 200);
  if (!name && form !== 'newsletter') {
    return { error: 'Name is required.' };
  }

  if (form === 'contact' || form === 'education' || form === 'sponsorship') {
    const message = sanitize(fields.message, 5000);
    if (!message || message.length < 10) {
      return { error: 'Please enter a message (at least 10 characters).' };
    }
  }

  return {
    data: {
      ...fields,
      name,
      email,
      submittedAt: new Date().toISOString(),
    },
  };
}

async function appendSubmission(form, entry) {
  try {
    const store = getStore({ name: STORE_NAME, consistency: 'strong' });
    const key = `${form}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    await store.setJSON(key, entry);
  } catch {
    /* Blobs optional on some deploy types */
  }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(204, {}, event, { methods: 'POST, OPTIONS' });
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' }, event, { methods: 'POST, OPTIONS' });
  }

  const ip = getClientIp(event);
  if (!rateLimit(`contact:${ip}`, { max: 8, windowMs: 900_000 })) {
    return jsonResponse(429, { error: 'Too many submissions. Please try again later.' }, event, {
      methods: 'POST, OPTIONS',
    });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON' }, event, { methods: 'POST, OPTIONS' });
  }

  const form = sanitize(body.form, 40);
  if (!FORMS.has(form)) {
    return jsonResponse(400, { error: 'Unknown form' }, event, { methods: 'POST, OPTIONS' });
  }

  const fields = body.fields && typeof body.fields === 'object' ? body.fields : {};
  if (fields['bot-field']) {
    return jsonResponse(200, { ok: true }, event, { methods: 'POST, OPTIONS' });
  }

  const validation = validatePayload(form, fields);
  if (validation.error) {
    return jsonResponse(400, { error: validation.error }, event, { methods: 'POST, OPTIONS' });
  }

  await appendSubmission(form, { form, ...validation.data, ip });

  return jsonResponse(200, { ok: true }, event, { methods: 'POST, OPTIONS' });
}
