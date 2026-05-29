/**
 * Icon paths for NounIcon (inline SVG, no external files).
 */
export const nounCatalog = {
  /* —— Theatre (solid, 512 viewBox) —— */
  stage: {
    viewBox: '0 0 512 512',
    paths: [
      'm0 0h512v232l-56-36v-136h-396v136l-60 40zm148 290c0 34-28 62-62 62s-62-28-62-62 28-62 62-62 62 28 62 62zm364 222h-511.697l-.303-92 50-46h72l49 46 49-46h72l49 46 49-46h72l50 46zm-194-222c0 34-28 62-62 62s-62-28-62-62 28-62 62-62 62 28 62 62zm170 0c0 34-28 62-62 62s-62-28-62-62 28-62 62-62 62 28 62 62z',
    ],
  },
  masks: {
    viewBox: '0 0 512 512',
    paths: [
      'M256 48c-72 0-128 56-128 128 0 40 16 76 42 102l-10 234h192l-10-234c26-26 42-62 42-102 0-72-56-128-128-128zm-80 128c0-44 36-80 80-80s80 36 80 80-36 80-80 80-80-36-80-80zm-96 96c-32 0-56 24-56 56v80c0 32 24 56 56 56h64v-192H80zm352 0h-64v192h64c32 0 56-24 56-56v-80c0-32-24-56-56-56z',
    ],
  },
  curtain: {
    viewBox: '0 0 512 512',
    paths: [
      'M32 64h448v48H32V64zm0 64h64v320H32V128zm128 0h64v320h-64V128zm128 0h64v320h-64V128zm128 0h64v320h-64V128z',
    ],
  },
  laurel: {
    viewBox: '0 0 512 512',
    paths: [
      'M256 448c-80-40-128-120-128-208 0-40 12-76 32-108-20 8-40 12-64 12-48 0-88-32-96-76 52 8 96-28 96-80 0 52 44 88 96 80-8 44-48 76-96 76-24 0-44-4-64-12 20 32 32 68 32 108 0 88-48 168-128 208z',
    ],
  },
  book: {
    viewBox: '0 0 512 512',
    paths: [
      'M96 64h160v384H96c-18 0-32-14-32-32V96c0-18 14-32 32-32zm192 0h160c18 0 32 14 32 32v320c0 18-14 32-32 32H288V64z',
    ],
  },
  tent: {
    viewBox: '0 0 512 512',
    paths: [
      'M256 48L48 464h416L256 48zm0 96l96 256H160l96-256zm0 64v128h64l-64-128z',
    ],
  },
  quill: {
    viewBox: '0 0 512 512',
    paths: [
      'M384 64L128 320l-32 128 128-32L448 128 384 64zm-64 64l32 32-192 192-32 32 32-32 192-192z',
    ],
  },

  /* —— UI (Noun Project line style, 24×24) —— */
  menu: {
    viewBox: '0 0 24 24',
    stroke: true,
    paths: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  },
  close: {
    viewBox: '0 0 24 24',
    stroke: true,
    paths: ['M6 6l12 12', 'M18 6L6 18'],
  },
  search: {
    viewBox: '0 0 24 24',
    stroke: true,
    circles: [{ cx: 10.5, cy: 10.5, r: 6.5 }],
    lines: [[16, 16, 21, 21]],
  },
  'chevron-left': {
    viewBox: '0 0 24 24',
    stroke: true,
    paths: ['M14 6l-6 6 6 6'],
  },
  'chevron-right': {
    viewBox: '0 0 24 24',
    stroke: true,
    paths: ['M10 6l6 6-6 6'],
  },
  'chevron-down': {
    viewBox: '0 0 24 24',
    stroke: true,
    paths: ['M6 9l6 6 6-6'],
  },
  'arrow-right': {
    viewBox: '0 0 24 24',
    stroke: true,
    paths: ['M5 12h14', 'M13 6l6 6-6 6'],
  },
  'external-link': {
    viewBox: '0 0 24 24',
    stroke: true,
    paths: ['M14 5h5v5', 'M10 14L19 5', 'M19 14v5H5V5h5'],
  },
  logout: {
    viewBox: '0 0 24 24',
    stroke: true,
    paths: ['M10 5H5v14h5', 'M14 12H8', 'M18 8l4 4-4 4'],
  },
  plus: {
    viewBox: '0 0 24 24',
    stroke: true,
    paths: ['M12 5v14', 'M5 12h14'],
  },
  pencil: {
    viewBox: '0 0 24 24',
    stroke: true,
    paths: ['M4 20h4l10-10-4-4L4 16v4z', 'M14 6l4 4'],
  },
  trash: {
    viewBox: '0 0 24 24',
    stroke: true,
    paths: ['M4 7h16', 'M9 7V5h6v2', 'M8 7l1 12h6l1-12'],
  },
  check: {
    viewBox: '0 0 24 24',
    stroke: true,
    paths: ['M5 12l5 5L20 7'],
  },
  image: {
    viewBox: '0 0 24 24',
    stroke: true,
    paths: ['M4 6h16v12H4V6z', 'M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M4 16l5-5 4 4 3-3 4 4'],
  },
  users: {
    viewBox: '0 0 24 24',
    stroke: true,
    paths: [
      'M16 19v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2',
      'M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
      'M22 19v-2a4 4 0 0 0-3-3.87',
      'M16 3.13a4 4 0 0 1 0 7.75',
    ],
  },
  globe: {
    viewBox: '0 0 24 24',
    stroke: true,
    paths: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M3 12h18', 'M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9z'],
  },
  mic: {
    viewBox: '0 0 24 24',
    stroke: true,
    paths: ['M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z', 'M6 11a6 6 0 0 0 12 0', 'M12 17v3'],
  },
  video: {
    viewBox: '0 0 24 24',
    stroke: true,
    paths: ['M4 7h10v10H4V7z', 'M14 10l6-3v10l-6-3'],
  },
  graduation: {
    viewBox: '0 0 24 24',
    stroke: true,
    paths: ['M12 3L2 9l10 6 10-6-10-6z', 'M6 12v4c0 2 2.5 4 6 4s6-2 6-4v-4', 'M22 9v6'],
  },
  music: {
    viewBox: '0 0 24 24',
    stroke: true,
    paths: ['M9 18V6l10-2v12', 'M9 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z', 'M15 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0z'],
  },

  /* —— Social (filled brand marks) —— */
  facebook: {
    viewBox: '0 0 24 24',
    paths: ['M14 4h-2.5A3.5 3.5 0 008 7.5V10H5.5v3H8v7h3.5v-7h2.8l.7-3H11.5V8a1 1 0 011-1H14V4z'],
  },
  instagram: {
    viewBox: '0 0 24 24',
    stroke: true,
    paths: ['M4 4h16v16H4V4z', 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
    circles: [{ cx: 17, cy: 7, r: 0.75, fill: true }],
  },
  twitter: {
    viewBox: '0 0 24 24',
    paths: ['M16.5 5.5h2.2l-4.8 5.5 5.6 7.5h-4.4l-3.4-4.5-3.9 4.5H6.3l5.1-5.9L6 5.5h4.5l3.1 4.1 3.6-4.1z'],
  },
  youtube: {
    viewBox: '0 0 24 24',
    paths: [
      'M21 8.5a2.5 2.5 0 00-1.8-1.8C17.2 6 12 6 12 6s-5.2 0-7.2.7A2.5 2.5 0 003 8.5 26 26 0 002.3 12a26 26 0 00.7 3.5 2.5 2.5 0 001.8 1.8C6.8 18 12 18 12 18s5.2 0 7.2-.7a2.5 2.5 0 001.8-1.8 26 26 0 00.7-3.5 26 26 0 00-.7-3.5zM10 15V9l5.5 3-5.5 3z',
    ],
  },
};
