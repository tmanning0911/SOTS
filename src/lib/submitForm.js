/**
 * Submit forms via /api/contact (primary) with optional Netlify Forms backup.
 */

function encodeFormBody(formName, fields) {
  const params = new URLSearchParams();
  params.set('form-name', formName);
  for (const [key, value] of Object.entries(fields)) {
    if (value != null && value !== '') params.set(key, String(value));
  }
  return params.toString();
}

async function submitNetlifyForm(formName, fields) {
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodeFormBody(formName, fields),
  });
  if (!res.ok) return false;

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return true;

  // SPA hosts return index.html with 200 — not a real Netlify Forms success.
  if (contentType.includes('text/html')) {
    const text = await res.text();
    if (text.includes('id="root"') || text.includes('/assets/index')) return false;
  }

  return true;
}

async function submitApiForm(formName, fields) {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ form: formName, fields }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Could not send message');
  }
  return true;
}

export async function submitForm(formName, fields) {
  if (fields['bot-field']) {
    return { ok: true, silent: true };
  }

  await submitApiForm(formName, fields);

  // Best-effort Netlify Forms (dashboard notifications) — never block on failure.
  submitNetlifyForm(formName, fields).catch(() => {});

  return { ok: true };
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}
