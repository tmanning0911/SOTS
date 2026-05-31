import { seasonVoice } from '@/content/voice';

/** Anniversary season stamp — unique to SOTS */
export default function SeasonBadge({ light = false, className = '' }) {
  return (
    <div className={`season-badge ${light ? 'season-badge--light' : ''} ${className}`}>
      <span className="season-badge__ring" aria-hidden />
      <span className="season-badge__num">{seasonVoice.number}</span>
      <span className="season-badge__label">
        Seasons
        <span className="season-badge__sub">under the stars</span>
      </span>
    </div>
  );
}
