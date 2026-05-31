import {
  buildGoogleCalendarUrl,
  downloadIcsFile,
  formatOccurrenceLabel,
  getCalendarOccurrences,
} from '@/lib/calendar';

/**
 * Add to calendar — Google Calendar + .ics download (Apple, Outlook, etc.)
 */
export default function AddToCalendar({ item, className = '', compact = false }) {
  const occurrences = getCalendarOccurrences(item);
  if (!occurrences.length) return null;

  const multi = occurrences.length > 1;

  const handleIcs = (e) => {
    e.preventDefault();
    downloadIcsFile(item);
  };

  return (
    <div className={`add-to-calendar ${className}`}>
      <p className={`text-navy/45 ${compact ? 'text-xs mb-1.5' : 'text-xs mb-2'}`}>Add to calendar</p>
      <ul className={`list-none p-0 m-0 ${multi ? 'space-y-2' : ''}`}>
        {occurrences.map((occ, index) => (
          <li
            key={`${occ.start}-${index}`}
            className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${compact ? 'text-xs' : 'text-sm'}`}
          >
            {multi && (
              <span className="text-navy/55 shrink-0 w-full sm:w-auto">{formatOccurrenceLabel(occ.start)}</span>
            )}
            <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
              <a
                href={buildGoogleCalendarUrl(item, occ)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Google
              </a>
              <span className="text-navy/25" aria-hidden>
                ·
              </span>
              <button type="button" onClick={handleIcs} className="text-link bg-transparent border-0 p-0 cursor-pointer">
                Apple / Outlook
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
