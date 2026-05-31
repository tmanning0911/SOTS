const MONTHS =
  /(January|February|March|April|May|June|July|August|September|October|November|December)/i;

/** Parse display dates like "Saturday, June 13, 2026" for programme layout. */
export function formatProgrammeDate(dateStr = '') {
  if (!dateStr) {
    return {
      day: '',
      month: '',
      monthFull: '',
      weekday: '',
      weekdayFull: '',
      label: '',
      full: '',
    };
  }

  const monthMatch = dateStr.match(MONTHS);
  const monthFull = monthMatch ? monthMatch[1] : '';
  const month = monthFull ? monthFull.slice(0, 3) : '';

  const weekdayMatch = dateStr.match(
    /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i,
  );
  const weekdayFull = weekdayMatch ? weekdayMatch[1] : '';
  const weekday = weekdayFull ? weekdayFull.slice(0, 3) : '';

  const dayMatch = dateStr.match(
    new RegExp(`${monthFull || 'Month'}\\s+(\\d+(?:\\s*&\\s*\\d+)?)`, 'i'),
  );
  const day = dayMatch?.[1]?.replace(/\s*&\s*/g, ' & ') ?? '';

  const label = month && day ? `${month} ${day}` : dateStr;

  return { day, month, monthFull, weekday, weekdayFull, label, full: dateStr };
}

/** Split "Pinkney Park, Rowayton, CT" into venue + city lines. */
export function parseEventLocation(location = '') {
  const parts = location.split(',').map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return { venue: parts[0], city: parts.slice(1).join(', ') };
  }
  return { venue: location, city: '' };
}

/** Compact time label for the ticket pill — keeps long copy off the card footer. */
export function formatTicketTime(time = '') {
  if (!time) return '';
  const trimmed = time.trim();
  if (trimmed.length <= 14) return trimmed;
  if (/evening/i.test(trimmed)) return 'Evening';
  return trimmed;
}

/** Category slug for accent styling on programme cards. */
export function getCategoryAccent(category = '') {
  const key = category.toLowerCase();
  if (key.includes('reception')) return 'reception';
  if (key.includes('talk')) return 'talk';
  if (key.includes('community')) return 'community';
  if (key.includes('performance')) return 'performance';
  if (key.includes('fundraiser')) return 'fundraiser';
  return 'default';
}
