import {
  buildGoogleCalendarUrl,
  downloadIcsFile,
  formatOccurrenceLabel,
  getCalendarOccurrences,
} from '@/lib/calendar';

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <rect x="3" y="5" width="18" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="add-to-calendar__chevron shrink-0"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Add to calendar — compact dropdown with Google + .ics options.
 */
export default function AddToCalendar({ item, className = '' }) {
  const occurrences = getCalendarOccurrences(item);
  if (!occurrences.length) return null;

  const multi = occurrences.length > 1;

  return (
    <details className={`add-to-calendar group relative inline-block ${className}`}>
      <summary className="add-to-calendar__trigger">
        <CalendarIcon />
        <span>Add to calendar</span>
        <ChevronIcon />
      </summary>

      <div className="add-to-calendar__menu" role="menu">
        {occurrences.map((occ, index) => (
          <div key={`${occ.start}-${index}`} className={multi ? 'add-to-calendar__group' : ''}>
            {multi && (
              <p className="add-to-calendar__date">{formatOccurrenceLabel(occ.start)}</p>
            )}
            <a
              href={buildGoogleCalendarUrl(item, occ)}
              target="_blank"
              rel="noopener noreferrer"
              className="add-to-calendar__option"
              role="menuitem"
            >
              Google Calendar
            </a>
            <button
              type="button"
              className="add-to-calendar__option"
              role="menuitem"
              onClick={() => downloadIcsFile(item, multi ? occ : undefined)}
            >
              Apple / Outlook
            </button>
          </div>
        ))}
      </div>
    </details>
  );
}
