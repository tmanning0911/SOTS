import { corsHeaders, jsonResponse } from './lib/cors.mjs';
import { getCollection, isValidCollection } from './lib/contentStore.mjs';

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

  const collection =
    event.queryStringParameters?.collection ||
    event.path?.replace(/^.*\//, '') ||
    '';

  if (!isValidCollection(collection)) {
    return jsonResponse(400, { error: 'Unknown collection' }, event);
  }

  const sort = event.queryStringParameters?.sort || '';
  const items = await getCollection(collection, sort);

  const responseHeaders = {
    ...headers,
    'Cache-Control': 'public, max-age=60, stale-while-revalidate=120',
  };

  if (!allowed && origin) {
    return { statusCode: 403, headers: responseHeaders, body: JSON.stringify({ error: 'Origin not allowed' }) };
  }

  return {
    statusCode: 200,
    headers: responseHeaders,
    body: JSON.stringify(items),
  };
};
