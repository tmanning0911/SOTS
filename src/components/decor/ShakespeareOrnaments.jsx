import {
  PremiumCornerScroll,
  PremiumMasksWatermark,
  PremiumQuillWatermark,
  PremiumLaurelWatermark,
  PremiumCurtainWatermark,
  PremiumMasksBand,
} from './PremiumSvgArt';

const cornerRotate = {
  tl: '',
  tr: 'rotate-90',
  br: 'rotate-180',
  bl: '-rotate-90',
};

const cornerPosition = {
  tl: 'top-0 left-0 sm:top-1 sm:left-1',
  tr: 'top-0 right-0 sm:top-1 sm:right-1',
  bl: 'bottom-0 left-0 sm:bottom-1 sm:left-1',
  br: 'bottom-0 right-0 sm:bottom-1 sm:right-1',
};

/** Clean section rule — no heavy scroll SVGs */
export function OrnamentDivider({ className = '', light = false }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 w-full max-w-xs sm:max-w-sm mx-auto ${className}`}
      aria-hidden
    >
      <span
        className={`h-px flex-1 ${light ? 'bg-gradient-to-r from-transparent to-white/35' : 'bg-gradient-to-r from-transparent to-navy/15'}`}
      />
      <span className={`h-1 w-1 rounded-full shrink-0 ${light ? 'bg-gold/80' : 'bg-gold'}`} />
      <span
        className={`h-px flex-1 ${light ? 'bg-gradient-to-l from-transparent to-white/35' : 'bg-gradient-to-l from-transparent to-navy/15'}`}
      />
    </div>
  );
}

/** Corner scrollwork — engraved acanthus */
export function CornerOrnament({ position = 'tl', theme = 'light', className = '' }) {
  const color = theme === 'dark' ? 'text-white/25' : 'text-navy/18';
  return (
    <PremiumCornerScroll
      className={`absolute w-[88px] h-[88px] sm:w-[110px] sm:h-[110px] md:w-[128px] md:h-[128px] pointer-events-none select-none ${color} ${cornerRotate[position]} ${cornerPosition[position]} ${className}`}
    />
  );
}

const WATERMARKS = {
  masks: PremiumMasksWatermark,
  quill: PremiumQuillWatermark,
  laurel: PremiumLaurelWatermark,
  curtain: PremiumCurtainWatermark,
};

const watermarkSize = {
  masks: 'w-[min(320px,85vw)] h-auto',
  quill: 'w-[min(200px,50vw)] h-auto',
  laurel: 'w-[min(360px,90vw)] h-auto',
  curtain: 'w-[min(240px,60vw)] h-auto',
};

/** Large-format engraved watermark (not scaled UI icons) */
export function ArtWatermark({ type = 'masks', className = '', opacity = 0.12 }) {
  const Svg = WATERMARKS[type] || PremiumMasksWatermark;
  return (
    <Svg
      className={`pointer-events-none select-none absolute ${watermarkSize[type] || watermarkSize.masks} ${className}`}
      style={{ opacity }}
      aria-hidden
    />
  );
}

/** @deprecated use ArtWatermark — kept for imports */
export function IconWatermark({ icon = 'masks', className = '', opacity = 0.08 }) {
  const map = { masks: 'masks', quill: 'quill', laurel: 'laurel', curtain: 'curtain', stage: 'curtain', book: 'quill' };
  return <ArtWatermark type={map[icon] || 'masks'} className={className} opacity={opacity} />;
}

/** Cluster of premium watermarks */
export function WatermarkCluster({ theme = 'light' }) {
  const tone = theme === 'dark' ? 'text-white' : 'text-navy';
  const o = theme === 'dark' ? { m: 0.07, q: 0.055, l: 0.04, c: 0.045 } : { m: 0.065, q: 0.05, l: 0.035, c: 0.04 };

  return (
    <div className="theatre-decor-layer absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      <ArtWatermark type="masks" className={`${tone} -top-6 -right-8 sm:right-4`} opacity={o.m} />
      <ArtWatermark type="quill" className={`${tone} bottom-0 -left-10 sm:left-0`} opacity={o.q} />
      <ArtWatermark
        type="laurel"
        className={`${tone} top-[28%] left-1/2 -translate-x-1/2 hidden md:block`}
        opacity={o.l}
      />
      <ArtWatermark type="curtain" className={`${tone} -bottom-4 right-[12%] hidden lg:block`} opacity={o.c} />
    </div>
  );
}

/** Full-width masks band for section headers */
export function MasksBanner({ className = '', light = false }) {
  return (
    <div className={`w-full overflow-hidden pointer-events-none ${className}`} aria-hidden>
      <PremiumMasksBand
        light={light}
        className={`w-full h-16 sm:h-20 ${light ? 'text-white' : 'text-navy'}`}
      />
    </div>
  );
}
