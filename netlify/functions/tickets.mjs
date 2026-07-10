import { getStore } from '@netlify/blobs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PREVIEW_SITE_URL, PRODUCTION_SITE_URL } from '../../scripts/lib/site-domains.mjs';
import { corsHeaders, jsonResponse } from './lib/cors.mjs';

const STORE_NAME = 'sots-ticketing';

const STATIC_CANDIDATES = [
  path.join(process.cwd(), 'dist', 'data', 'eventbrite.json'),
  path.join(process.cwd(), 'data', 'eventbrite.json'),
  path.join(process.cwd(), 'public', 'data', 'eventbrite.json'),
];

function siteDataUrls() {
  const urls = new Set([
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
    process.env.DEPLOY_URL,
    PRODUCTION_SITE_URL,
    PREVIEW_SITE_URL,
  ]);
  return [...urls]
    .filter(Boolean)
    .map((base) => `${String(base).replace(/\/$/, '')}/data/eventbrite.json`);
}

async function readStaticTicketData() {
  for (const filePath of STATIC_CANDIDATES) {
    try {
      const raw = await readFile(filePath, 'utf8');
      return JSON.parse(raw);
    } catch {
      // try next path
    }
  }

  for (const url of siteDataUrls()) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) continue;
      return await res.json();
    } catch {
      // try next URL
    }
  }

  return null;
}

async function readTicketData() {
  try {
    const store = getStore({ name: STORE_NAME, consistency: 'strong' });
    const cached = await store.get('eventbrite', { type: 'json' });
    if (cached) return cached;
  } catch {
    // blobs unavailable
  }

  const staticData = await readStaticTicketData();
  if (staticData) return staticData;

  return null;
}

export const handler = async (event) => {
  const { headers, allowed, origin } = corsHeaders(event, {
    methods: 'GET, OPTIONS',
  });

  if (event.httpMethod === 'OPTIONS') {
    if (!allowed && origin) return { statusCode: 403, headers };
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method not allowed' }, event);
  }

  try {
    const data = await readTicketData();
    if (!data) {
      return jsonResponse(503, { error: 'Ticket data unavailable' }, event);
    }

    const responseHeaders = {
      ...headers,
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
    };

    if (!allowed && origin) {
      return {
        statusCode: 403,
        headers: responseHeaders,
        body: JSON.stringify({ error: 'Origin not allowed' }),
      };
    }

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error('tickets handler failed:', err);
    return jsonResponse(500, { error: 'Ticket data unavailable' }, event);
  }
};
