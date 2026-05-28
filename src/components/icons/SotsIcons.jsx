import Icon, { IconFilled } from './Icon';

const sw = 1.35;

/* —— Navigation & UI —— */
export function IconMenu({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </Icon>
  );
}

export function IconClose({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
  );
}

export function IconSearch({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l5 5" />
    </Icon>
  );
}

export function IconChevronLeft({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M14 6l-6 6 6 6" />
    </Icon>
  );
}

export function IconChevronRight({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M10 6l6 6-6 6" />
    </Icon>
  );
}

export function IconArrowRight({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Icon>
  );
}

export function IconExternalLink({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M10 5h9v9M19 5L9 15M19 14v5H5V5h5" />
    </Icon>
  );
}

export function IconLogOut({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M10 4H5v16h5M14 12H4M18 8l4 4-4 4" />
    </Icon>
  );
}

export function IconPlus({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  );
}

export function IconPencil({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M4 20h4l10-10-4-4L4 16v4zM14 6l4 4" />
    </Icon>
  );
}

export function IconTrash({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M4 7h16M9 7V5h6v2M10 11v6M14 11v6M6 7l1 12h10l1-12" />
    </Icon>
  );
}

export function IconCheck({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M5 12l5 5 9-10" />
    </Icon>
  );
}

export function IconImage({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <circle cx="9" cy="10" r="2" />
      <path d="M21 16l-5-5-8 8" />
    </Icon>
  );
}

/* —— Contact & location —— */
export function IconMapPin({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </Icon>
  );
}

export function IconMail({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <rect x="3" y="6" width="18" height="12" rx="1" />
      <path d="M3 8l9 6 9-6" />
    </Icon>
  );
}

export function IconPhone({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M6 4h4l2 5-2 1a11 11 0 005 5l1-2 5 2v4a2 2 0 01-2 2A14 14 0 014 6a2 2 0 012-2z" />
    </Icon>
  );
}

export function IconClock({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </Icon>
  );
}

/* —— Theatre & arts —— */
export function IconMasks({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M8 4c-3 0-5 2-5 5v2c0 3 2 5 5 5 1.5 0 2.5-.5 4-2 1.5 1.5 2.5 2 4 2 3 0 5-2 5-5V9c0-3-2-5-5-5-1.5 0-2.5.5-4 2C10.5 4.5 9.5 4 8 4z" />
      <path d="M9 10h.01M15 10h.01" />
      <path d="M10 13c1 1 3 1 4 0" />
    </Icon>
  );
}

export function IconStage({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M3 20h18M6 20V10l6-4 6 4v10" />
      <path d="M9 14h6M12 11v3" />
      <path d="M3 10l18-4" />
    </Icon>
  );
}

export function IconCurtain({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M4 4h16v2c0 4-2 6-4 6s-4-2-4-6v10H4V4z" />
      <path d="M12 12v8" />
    </Icon>
  );
}

export function IconPlay({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5l6 3.5-6 3.5V8.5z" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function IconFilm({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="M7 5v3M7 16v3M12 5v3M12 16v3M17 5v3M17 16v3" />
    </Icon>
  );
}

export function IconQuill({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M4 20c4-8 8-12 16-14-2 8-6 12-14 14" />
      <path d="M8 16l2 2" />
    </Icon>
  );
}

export function IconBookOpen({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M12 5c-2-2-6-2-8 0v12c2-1 6-1 8 0V5z" />
      <path d="M12 5c2-2 6-2 8 0v12c-2-1-6-1-8 0V5z" />
      <path d="M12 5v12" />
    </Icon>
  );
}

export function IconLaurel({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={1.15} {...p}>
      <path d="M8 4c-2 3-2 6 0 9M16 4c2 3 2 6 0 9" />
      <path d="M10 6c-1 2-1 4 0 6M14 6c1 2 1 4 0 6" />
      <path d="M12 20v-4" />
    </Icon>
  );
}

/* —— Education & programs —— */
export function IconSchool({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M12 3L2 8l10 5 10-5-10-5z" />
      <path d="M6 10v5c0 2 2.5 4 6 4s6-2 6-4v-5" />
      <path d="M20 8v8" />
    </Icon>
  );
}

export function IconUsers({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" />
      <path d="M16 11a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM19 19c0-2-1.5-3.5-3.5-3.5" />
    </Icon>
  );
}

export function IconGraduation({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M12 3L2 9l10 6 10-6-10-6z" />
      <path d="M6 11v4c0 2 2.5 4 6 4s6-2 6-4v-4" />
      <path d="M20 9v6" />
    </Icon>
  );
}

export function IconGlobe({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16M12 4c2.5 2.5 4 5.5 4 8s-1.5 5.5-4 8M12 4c-2.5 2.5-4 5.5-4 8s1.5 5.5 4 8" />
    </Icon>
  );
}

export function IconMic({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <rect x="9" y="3" width="6" height="10" rx="3" />
      <path d="M6 11a6 6 0 0012 0M12 17v4M9 21h6" />
    </Icon>
  );
}

export function IconDocument({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M8 4h8l4 4v12H8V4z" />
      <path d="M16 4v4h4M10 12h6M10 16h4" />
    </Icon>
  );
}

export function IconMusic({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <circle cx="8" cy="17" r="2" />
      <circle cx="17" cy="15" r="2" />
      <path d="M10 17V6l9-2v11" />
    </Icon>
  );
}

export function IconTent({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M4 20h16M12 4l8 16H4l8-16z" />
      <path d="M12 4v16" />
    </Icon>
  );
}

export function IconSparkle({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
      <path d="M18 4l.8 2.2L21 7l-2.2.8L18 10l-.8-2.2L15 7l2.2-.8L18 4z" />
    </Icon>
  );
}

export function IconHeart({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M12 20s-7-4.5-7-10a4 4 0 017-2 4 4 0 017 2c0 5.5-7 10-7 10z" />
    </Icon>
  );
}

export function IconBuilding({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M4 20V8l8-4 8 4v12H4z" />
      <path d="M9 20v-6h6v6M12 8v3" />
    </Icon>
  );
}

export function IconGift({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <rect x="4" y="10" width="16" height="10" rx="1" />
      <path d="M12 10V20M4 14h16M8 10c0-2 1-4 4-4s4 2 4 4" />
      <path d="M12 6v4" />
    </Icon>
  );
}

export function IconStar({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M12 3l2.4 5.8 6.3.5-4.8 4 1.5 6.2L12 17l-5.4 2.5 1.5-6.2-4.8-4 6.3-.5L12 3z" />
    </Icon>
  );
}

export function IconNewspaper({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M6 4h12v16H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
      <path d="M8 8h8M8 12h8M8 16h5" />
      <path d="M18 8h2v10h-2a1 1 0 01-1-1V9a1 1 0 011-1z" />
    </Icon>
  );
}

/* —— Social (refined brand silhouettes) —— */
export function IconFacebook({ size = 20, className, ...p }) {
  return (
    <IconFilled size={size} className={className} {...p}>
      <path d="M14 4h-2.5A3.5 3.5 0 008 7.5V10H5.5v3H8v7h3.5v-7h2.8l.7-3H11.5V8a1 1 0 011-1H14V4z" />
    </IconFilled>
  );
}

export function IconInstagram({ size = 20, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={1.5} {...p}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17" cy="7" r="0.75" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function IconTwitter({ size = 20, className, ...p }) {
  return (
    <IconFilled size={size} className={className} {...p}>
      <path d="M16.5 5.5h2.2l-4.8 5.5 5.6 7.5h-4.4l-3.4-4.5-3.9 4.5H6.3l5.1-5.9L6 5.5h4.5l3.1 4.1 3.6-4.1zm-.8 12h1.2L8.4 7h-1.2l8.5 10.5z" />
    </IconFilled>
  );
}

export function IconYoutube({ size = 20, className, ...p }) {
  return (
    <IconFilled size={size} className={className} {...p}>
      <path d="M21 8.5a2.5 2.5 0 00-1.8-1.8C17.2 6 12 6 12 6s-5.2 0-7.2.7A2.5 2.5 0 003 8.5 26 26 0 002.3 12a26 26 0 00.7 3.5 2.5 2.5 0 001.8 1.8C6.8 18 12 18 12 18s5.2 0 7.2-.7a2.5 2.5 0 001.8-1.8 26 26 0 00.7-3.5 26 26 0 00-.7-3.5zM10 15V9l5.5 3-5.5 3z" />
    </IconFilled>
  );
}

/** Maps learning program `icon` field → component */
export const learningIconMap = {
  BookOpen: IconBookOpen,
  Video: IconStage,
  FileText: IconDocument,
  Users: IconUsers,
  GraduationCap: IconGraduation,
  School: IconSchool,
  Globe: IconGlobe,
  Mic: IconMic,
  Music: IconMusic,
  Masks: IconMasks,
  Stage: IconStage,
  Quill: IconQuill,
};

export function LearningIcon({ name, ...props }) {
  const Cmp = learningIconMap[name] || IconBookOpen;
  return <Cmp {...props} />;
}
