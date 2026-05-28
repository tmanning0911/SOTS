/** Premium engraved theatre ornaments — illustration-scale SVG, not scaled UI icons */

const stroke = {
  round: { strokeLinecap: 'round', strokeLinejoin: 'round' },
};

/** Symmetrical playbill divider with rosette centre */
export function PremiumScrollDivider({ className }) {
  return (
    <svg viewBox="0 0 480 56" fill="none" className={className} aria-hidden {...stroke}>
      <defs>
        <linearGradient id="sotsScrollFade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="45%" stopColor="currentColor" stopOpacity="0.85" />
          <stop offset="55%" stopColor="currentColor" stopOpacity="0.85" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <path d="M0 28h148" stroke="url(#sotsScrollFade)" strokeWidth="0.65" />
      <path d="M332 28h148" stroke="url(#sotsScrollFade)" strokeWidth="0.65" />
      <path
        d="M148 28c0-10 8-18 18-18 6 0 11 3 14 8 3-5 8-8 14-8 10 0 18 8 18 18s-8 18-18 18c-6 0-11-3-14-8-3 5-8 8-14 8-10 0-18-8-18-18z"
        stroke="currentColor"
        strokeWidth="0.85"
        opacity="0.55"
      />
      <path
        d="M168 28c6-14 22-22 38-16 8 3 14 10 16 18 2-8 8-15 16-18 16-6 32 2 38 16"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />
      <path
        d="M188 20c-4 6-4 14 0 20M212 16c6 8 6 20 0 28M236 20c4 6 4 14 0 20"
        stroke="currentColor"
        strokeWidth="0.75"
        opacity="0.5"
      />
      <circle cx="240" cy="28" r="5" stroke="currentColor" strokeWidth="0.9" opacity="0.65" />
      <circle cx="240" cy="28" r="1.8" fill="currentColor" opacity="0.55" />
      <path
        d="M240 20v3M240 33v3M233 28h-3M250 28h-3"
        stroke="currentColor"
        strokeWidth="0.55"
        opacity="0.45"
      />
      <path
        d="M235 23l3.5 3.5M245 23l-3.5 3.5M235 33l3.5-3.5M245 33l-3.5-3.5"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.4"
      />
      <path
        d="M124 28c14-6 28-4 38 6M356 28c-14-6-28-4-38 6"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.45"
      />
      <path
        d="M108 28c8-3 16-2 22 2M372 28c-8-3-16-2-22 2"
        stroke="currentColor"
        strokeWidth="0.65"
        opacity="0.35"
      />
      <path
        d="M96 26c4-1 8 0 10 3M384 26c-4-1-8 0-10 3"
        stroke="currentColor"
        strokeWidth="0.55"
        opacity="0.3"
      />
    </svg>
  );
}

/** Engraved corner — acanthus scroll + double rule */
export function PremiumCornerScroll({ className }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" className={className} aria-hidden {...stroke}>
      <path
        d="M6 154V52c0-22 18-40 40-42l18-4"
        stroke="currentColor"
        strokeWidth="1.15"
        opacity="0.75"
      />
      <path
        d="M6 154H118c22 0 40-18 40-40l4-18"
        stroke="currentColor"
        strokeWidth="1.15"
        opacity="0.75"
      />
      <path
        d="M14 146V58c0-17 14-31 31-33l12-2"
        stroke="currentColor"
        strokeWidth="0.55"
        opacity="0.4"
      />
      <path
        d="M14 146H106c17 0 31-14 31-31l2-12"
        stroke="currentColor"
        strokeWidth="0.55"
        opacity="0.4"
      />
      <path
        d="M22 138c0-28 18-48 44-52 14-2 28 4 36 16 8 12 6 28-6 38-12 10-30 12-44 4-14-8-24-22-26-38-2-16 6-28 18-32"
        stroke="currentColor"
        strokeWidth="0.95"
        opacity="0.6"
      />
      <path
        d="M32 124c10-14 28-18 42-8 8 6 10 16 4 24-6 8-18 10-28 4"
        stroke="currentColor"
        strokeWidth="0.75"
        opacity="0.5"
      />
      <path
        d="M48 108c6-8 16-10 24-4 4 3 5 9 2 13-3 4-9 5-13 2"
        stroke="currentColor"
        strokeWidth="0.65"
        opacity="0.45"
      />
      <path
        d="M38 98c4-6 10-8 16-5M54 92c-3 5-2 11 2 15"
        stroke="currentColor"
        strokeWidth="0.55"
        opacity="0.38"
      />
      <path
        d="M26 128c-6-10-4-22 6-30M70 76c8 4 12 12 10 20"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.35"
      />
      <circle cx="18" cy="142" r="4" stroke="currentColor" strokeWidth="0.75" opacity="0.55" />
      <circle cx="18" cy="142" r="1.2" fill="currentColor" opacity="0.45" />
      <path
        d="M18 136v3M15 142h6M18 148v-3"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.4"
      />
      <path
        d="M8 8c6 4 10 10 12 18M8 8c4 6 4 14 0 20"
        stroke="currentColor"
        strokeWidth="0.65"
        opacity="0.35"
      />
      <path
        d="M52 44c-3 5-2 11 2 14 5 4 12 2 16-3"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.32"
      />
    </svg>
  );
}

/** Comedy & tragedy masks with ribbon — watermark scale */
export function PremiumMasksWatermark({ className }) {
  return (
    <svg viewBox="0 0 320 200" fill="none" className={className} aria-hidden {...stroke}>
      <path
        d="M72 68c-28 0-50 22-50 50v12c0 28 22 50 50 50 14 0 24-5 40-22 16 17 26 22 40 22 28 0 50-22 50-50v-12c0-28-22-50-50-50-14 0-24 5-40 22C96 73 86 68 72 68z"
        stroke="currentColor"
        strokeWidth="2.2"
        opacity="0.22"
      />
      <path
        d="M108 52c-18 0-32 14-32 32v6c0 18 14 32 32 32 8 0 14-3 22-14 8 11 14 14 22 14 18 0 32-14 32-32v-6c0-18-14-32-32-32-8 0-14 3-22 14-8-11-14-14-22-14z"
        stroke="currentColor"
        strokeWidth="1.8"
        opacity="0.35"
      />
      <ellipse cx="98" cy="88" rx="5" ry="6" fill="currentColor" opacity="0.12" />
      <ellipse cx="130" cy="88" rx="5" ry="6" fill="currentColor" opacity="0.12" />
      <path d="M104 104c6 8 18 8 24 0" stroke="currentColor" strokeWidth="1.6" opacity="0.28" />
      <ellipse cx="218" cy="92" rx="5" ry="7" fill="currentColor" opacity="0.12" />
      <ellipse cx="252" cy="92" rx="5" ry="7" fill="currentColor" opacity="0.12" />
      <path d="M224 112c8-10 22-10 30 0" stroke="currentColor" strokeWidth="1.6" opacity="0.28" />
      <path
        d="M88 148h144c12 0 22 10 22 22H66c0-12 10-22 22-22z"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.25"
      />
      <path
        d="M160 148v28M140 162h40"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.2"
      />
      <path
        d="M24 100c-8-16-6-34 8-46M296 100c8-16 6-34-8-46"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.18"
      />
      <path
        d="M32 88c6-10 16-14 26-10M288 88c-6-10-16-14-26-10"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.15"
      />
    </svg>
  );
}

/** Feather quill with ink flourish */
export function PremiumQuillWatermark({ className }) {
  return (
    <svg viewBox="0 0 200 280" fill="none" className={className} aria-hidden {...stroke}>
      <path
        d="M36 248c48-72 88-120 148-168-8 56-32 104-72 140-20 18-44 30-76 28z"
        stroke="currentColor"
        strokeWidth="1.8"
        opacity="0.2"
      />
      <path
        d="M48 236c38-58 72-98 120-138"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.28"
      />
      <path
        d="M56 228c6-24 18-46 34-62 12-12 28-20 44-22"
        stroke="currentColor"
        strokeWidth="0.75"
        opacity="0.22"
      />
      <path
        d="M62 220c4-12 12-22 22-28M70 208c8-6 18-8 28-6"
        stroke="currentColor"
        strokeWidth="0.55"
        opacity="0.18"
      />
      <path
        d="M28 252c16 8 34 10 52 4"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.25"
      />
      <path
        d="M20 260c28 12 52 8 72-8 14-12 22-30 24-48"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.3"
      />
      <ellipse cx="88" cy="248" rx="8" ry="4" fill="currentColor" opacity="0.12" />
      <path
        d="M96 252c12 6 24 4 32-4"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.22"
      />
    </svg>
  );
}

/** Laurel wreath — full circle */
export function PremiumLaurelWatermark({ className }) {
  const leaves = Array.from({ length: 16 }, (_, i) => i * 22.5);
  return (
    <svg viewBox="0 0 280 280" fill="none" className={className} aria-hidden {...stroke}>
      <ellipse cx="140" cy="140" rx="98" ry="102" stroke="currentColor" strokeWidth="0.6" opacity="0.1" />
      {leaves.map((deg) => (
        <g key={deg} transform={`translate(140 140) rotate(${deg}) translate(0 -92)`} opacity="0.24">
          <path
            d="M0 0c10-14 24-16 28-4s-6 20-20 22c-12 2-16-10-8-18z"
            stroke="currentColor"
            strokeWidth="0.9"
          />
          <path d="M4-6c4-3 10-2 12 2" stroke="currentColor" strokeWidth="0.5" opacity="0.65" />
        </g>
      ))}
      <circle cx="140" cy="140" r="10" stroke="currentColor" strokeWidth="0.65" opacity="0.18" />
      <circle cx="140" cy="140" r="2.5" fill="currentColor" opacity="0.12" />
    </svg>
  );
}

/** Stage curtains with swag */
export function PremiumCurtainWatermark({ className }) {
  return (
    <svg viewBox="0 0 240 200" fill="none" className={className} aria-hidden {...stroke}>
      <path d="M8 24v152h56V24H8z" stroke="currentColor" strokeWidth="1.4" opacity="0.2" />
      <path d="M176 24v152h56V24h-56z" stroke="currentColor" strokeWidth="1.4" opacity="0.2" />
      <path
        d="M64 24c28-8 56-8 84 0 28 8 56 8 84 0"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.25"
      />
      <path
        d="M64 24c14 12 14 32 0 44M176 24c-14 12-14 32 0 44"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.2"
      />
      <path d="M20 40v8M44 36v16M68 32v24" stroke="currentColor" strokeWidth="0.55" opacity="0.18" />
      <path d="M220 40v8M196 36v16M172 32v24" stroke="currentColor" strokeWidth="0.55" opacity="0.18" />
      <path d="M32 176h176" stroke="currentColor" strokeWidth="1.8" opacity="0.22" />
      <path
        d="M88 176c16-6 32-6 48 0 16 6 32 6 48 0"
        stroke="currentColor"
        strokeWidth="0.85"
        opacity="0.18"
      />
      <ellipse cx="120" cy="168" rx="36" ry="8" stroke="currentColor" strokeWidth="0.7" opacity="0.15" />
    </svg>
  );
}

/** Wide masks band for section headers */
export function PremiumMasksBand({ className, light = false }) {
  const op = light ? 0.35 : 0.4;
  return (
    <svg
      viewBox="0 0 800 100"
      fill="none"
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
      {...stroke}
    >
      <path d="M0 50h220" stroke="currentColor" strokeWidth="0.6" opacity={op * 0.5} />
      <path d="M580 50h220" stroke="currentColor" strokeWidth="0.6" opacity={op * 0.5} />
      <path
        d="M220 50c0-18 14-32 32-32 10 0 18 6 22 16 4-10 12-16 22-16 18 0 32 14 32 32s-14 32-32 32c-10 0-18-6-22-16-4 10-12 16-22 16-18 0-32-14-32-32z"
        stroke="currentColor"
        strokeWidth="1"
        opacity={op * 0.65}
      />
      <path
        d="M248 50c8-22 32-36 58-30 16 4 28 16 32 30 4-14 16-26 32-30 26-6 50 8 58 30"
        stroke="currentColor"
        strokeWidth="1.15"
        opacity={op * 0.85}
      />
      <ellipse cx="318" cy="44" rx="6" ry="7" fill="currentColor" opacity={op * 0.25} />
      <ellipse cx="352" cy="44" rx="6" ry="7" fill="currentColor" opacity={op * 0.25} />
      <path d="M324 58c8 6 18 6 26 0" stroke="currentColor" strokeWidth="1" opacity={op * 0.7} />
      <ellipse cx="448" cy="44" rx="6" ry="7" fill="currentColor" opacity={op * 0.25} />
      <ellipse cx="482" cy="44" rx="6" ry="7" fill="currentColor" opacity={op * 0.25} />
      <path d="M454 58c8-8 20-8 28 0" stroke="currentColor" strokeWidth="1" opacity={op * 0.7} />
      <path
        d="M200 50c20-8 40-6 52 8M600 50c-20-8-40-6-52 8"
        stroke="currentColor"
        strokeWidth="0.85"
        opacity={op * 0.45}
      />
      <circle cx="400" cy="50" r="6" stroke="currentColor" strokeWidth="0.8" opacity={op * 0.5} />
      <path
        d="M400 42v4M396 50h8M400 58v-4"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity={op * 0.4}
      />
    </svg>
  );
}
