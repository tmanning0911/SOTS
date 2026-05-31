/** Five Mile River wave — section transition motif */
export default function RiverWave({ flip = false, className = '' }) {
  return (
    <div className={`river-wave ${flip ? 'river-wave--flip' : ''} ${className}`} aria-hidden>
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="w-full h-full">
        <path
          d="M0,24 C240,48 480,0 720,24 C960,48 1200,0 1440,24 L1440,48 L0,48 Z"
          className="river-wave__fill"
        />
        <path
          d="M0,28 C360,8 720,40 1080,20 C1260,10 1380,30 1440,26"
          fill="none"
          className="river-wave__line"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
