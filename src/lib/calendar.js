import { site } from '@/content/site';

const DEFAULT_TZ = 'America/New_York';
const SITE_URL = site.liveSiteUrl?.replace(/\/$/, '') || 'https://www.shakespeareonthesound.org';

/** @returns {{ start: string, end: string }[]} */
export function getCalendarOccurrences(item) {
  const cal = item?.calendar;
  if (!cal) return [];

  if (Array.isArray(cal.occurrences) && cal.occurrences.length > 0) {
    return cal.occurrences.filter((o) => o?.start && o?.end);
  }

  if (cal.start && cal.end) {
    return [{ start: cal.start, end: cal.end }];
  }

  return [];
}

function parseLocalDateTime(isoLocal) {
  const [datePart, timePart = '00:00:00'] = isoLocal.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second = 0] = timePart.split(':').map(Number);
  return { year, month, day, hour, minute, second: Number(second) || 0 };
}

function toGoogleDate(isoLocal) {
  const { year, month, day, hour, minute, second } = parseLocalDateTime(isoLocal);
  const pad = (n) => String(n).padStart(2, '0');
  return `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(minute)}${pad(second)}`;
}

function toIcsLocal(isoLocal) {
  const { year, month, day, hour, minute, second } = parseLocalDateTime(isoLocal);
  const pad = (n) => String(n).padStart(2, '0');
  return `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(minute)}${pad(second)}`;
}

function escapeIcs(text) {
  return String(text || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function eventDetails(item) {
  const parts = [item.description].filter(Boolean);
  if (item.priceNote) parts.push(item.priceNote);
  if (item.calendar?.recurrenceNote) parts.push(item.calendar.recurrenceNote);
  const path = item.dates ? `/plays#${item.id}` : `/events#${item.id}`;
  parts.push(`${SITE_URL}${path}`);
  return parts.join('\n\n');
}

function eventLocation(item) {
  return item.location || site.location;
}

function eventTitle(item) {
  return item.title || site.name;
}

export function buildGoogleCalendarUrl(item, occurrence) {
  const tz = item.calendar?.timezone || DEFAULT_TZ;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle(item),
    dates: `${toGoogleDate(occurrence.start)}/${toGoogleDate(occurrence.end)}`,
    details: eventDetails(item),
    location: eventLocation(item),
    ctz: tz,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildIcsFile(item, occurrenceFilter) {
  const all = getCalendarOccurrences(item);
  const occurrences = occurrenceFilter
    ? all.filter((o) => o.start === occurrenceFilter.start && o.end === occurrenceFilter.end)
    : all;
  const tz = item.calendar?.timezone || DEFAULT_TZ;
  const stamp = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
  const uidBase = item.id || 'event';

  const events = occurrences
    .map(
      (occ, index) => `BEGIN:VEVENT
UID:${uidBase}-${index}@shakespeareonthesound.org
DTSTAMP:${stamp}
DTSTART;TZID=${tz}:${toIcsLocal(occ.start)}
DTEND;TZID=${tz}:${toIcsLocal(occ.end)}
SUMMARY:${escapeIcs(eventTitle(item))}
DESCRIPTION:${escapeIcs(eventDetails(item))}
LOCATION:${escapeIcs(eventLocation(item))}
URL:${SITE_URL}${item.dates ? `/plays#${item.id}` : `/events#${item.id}`}
END:VEVENT`,
    )
    .join('\n');

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Shakespeare on the Sound//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Shakespeare on the Sound
${events}
END:VCALENDAR`;
}

export function downloadIcsFile(item, occurrence) {
  const blob = new Blob([buildIcsFile(item, occurrence)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  const suffix = occurrence ? `-${occurrence.start.slice(0, 10)}` : '';
  anchor.download = `${item.id || 'event'}${suffix}.ics`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function formatOccurrenceLabel(isoLocal) {
  const { year, month, day } = parseLocalDateTime(isoLocal);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
