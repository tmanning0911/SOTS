import { runEventbriteSync } from '../../scripts/lib/eventbrite-run-sync.mjs';

export const config = {
  schedule: '15 * * * *',
};

export async function handler() {
  try {
    const payload = await runEventbriteSync();
    console.log(`sync-eventbrite: synced ${payload.performances.length} performances at ${payload.syncedAt}`);
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        syncedAt: payload.syncedAt,
        performances: payload.performances.length,
      }),
    };
  } catch (err) {
    if (err.message === 'Missing EVENTBRITE_API_TOKEN') {
      console.error('sync-eventbrite: missing EVENTBRITE_API_TOKEN');
    } else {
      console.error('sync-eventbrite failed:', err);
    }
    return { statusCode: 500, body: err.message || 'Sync failed' };
  }
}
