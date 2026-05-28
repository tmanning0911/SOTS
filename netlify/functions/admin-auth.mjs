import {
  issueAdminSession,
  verifyAdmin,
  verifyPassword,
} from './lib/auth.mjs';
import { corsHeaders, jsonResponse } from './lib/cors.mjs';
import { getClientIp, rateLimit } from './lib/rateLimit.mjs';

export const handler = async (event) => {
  const { headers, allowed, origin } = corsHeaders(event, {
    methods: 'GET, POST, OPTIONS',
  });

  if (event.httpMethod === 'OPTIONS') {
    if (!allowed && origin) return { statusCode: 403, headers };
    return { statusCode: 204, headers };
  }

  if (event.httpMethod === 'GET') {
    if (!allowed && origin) {
      return jsonResponse(403, { error: 'Origin not allowed' }, event);
    }
    const admin = verifyAdmin(event);
    if (!admin) return jsonResponse(401, { error: 'Unauthorized' }, event);
    return jsonResponse(200, { user: { email: admin.email, role: admin.role } }, event);
  }

  if (event.httpMethod === 'POST') {
    if (!allowed && origin) {
      return jsonResponse(403, { error: 'Origin not allowed' }, event);
    }

    const ip = getClientIp(event);
    if (!rateLimit(`admin-auth:${ip}`, { max: 8, windowMs: 900_000 })) {
      return jsonResponse(429, { error: 'Too many attempts. Try again later.' }, event);
    }

    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return jsonResponse(400, { error: 'Invalid JSON' }, event);
    }

    if (!verifyPassword(body.password)) {
      return jsonResponse(401, { error: 'Invalid password' }, event);
    }

    const session = issueAdminSession(body.email);
    if (session.error) return jsonResponse(503, { error: session.error }, event);
    return jsonResponse(200, session, event);
  }

  return jsonResponse(405, { error: 'Method not allowed' }, event);
};
