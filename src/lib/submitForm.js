/**
 * Submit forms to Netlify Forms (production) or /api/contact (dev + backup).
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
  return res.ok;
}

async function submitApiForm(formName, fields) {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ form: formName, fields }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Could not send message');
  }
  return true;
}

export async function submitForm(formName, fields) {
  if (fields['bot-field']) {
    return { ok: true, silent: true };
  }

  try {
    const netlifyOk = await submitNetlifyForm(formName, fields);
    if (netlifyOk) return { ok: true };
  } catch {
    /* fall through */
  }

  await submitApiForm(formName, fields);
  return { ok: true };
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}
