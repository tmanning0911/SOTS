import {
  buildGoogleCalendarUrl,
  downloadIcsFile,
  formatOccurrenceLabel,
  getCalendarOccurrences,
} from '@/lib/calendar';
import { formatProgrammeDate } from '@/lib/programmeDate';

function CalendarIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <rect x="3" y="5" width="18" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TicketCalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
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
 * variant="ticket-date" uses the date block as the trigger (ticket cards).
 */
export default function AddToCalendar({ item, className = '', variant = 'default' }) {
  const occurrences = getCalendarOccurrences(item);
  if (!occurrences.length) return null;

  const multi = occurrences.length > 1;
  const isTicketDate = variant === 'ticket-date';
  const parts = isTicketDate ? formatProgrammeDate(item.date) : null;
  const dateLine =
    parts?.monthFull && parts?.day ? `${parts.monthFull} ${parts.day}` : item.date;

  const menu = (
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
  );

  if (isTicketDate) {
    return (
      <details className={`add-to-calendar add-to-calendar--ticket-date group relative ${className}`}>
        <summary className="add-to-calendar__trigger-ticket" aria-label={`Add ${dateLine} to calendar`}>
          <TicketCalendarIcon />
          <span className="add-to-calendar__ticket-date-text">
            <span className="add-to-calendar__ticket-date-primary">{dateLine}</span>
            {parts?.weekdayFull && (
              <span className="add-to-calendar__ticket-date-secondary">{parts.weekdayFull}</span>
            )}
          </span>
          <ChevronIcon />
        </summary>
        {menu}
      </details>
    );
  }

  return (
    <details className={`add-to-calendar group relative inline-block ${className}`}>
      <summary className="add-to-calendar__trigger btn-outline">
        <CalendarIcon />
        <span>Add to calendar</span>
        <ChevronIcon />
      </summary>
      {menu}
    </details>
  );
}
