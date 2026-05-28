import Icon, { IconFilled } from './Icon';

const sw = 1.35;

/* —— Essential UI (navigation & admin only) —— */
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
      <path d="M6 16l4-4 3 3 5-6 4 5" />
    </Icon>
  );
}

/* —— Shakespeare & theatre (public site) —— */
export function IconMasks({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M7 5c-2.5 0-4.5 2-4.5 4.5v1.5c0 2.5 2 4.5 4.5 4.5 1.2 0 2-.4 3.5-1.8 1.5 1.4 2.3 1.8 3.5 1.8 2.5 0 4.5-2 4.5-4.5V9.5C18.5 7 16.5 5 14 5c-1.2 0-2 .4-3.5 1.8C9 5.4 8.2 5 7 5z" />
      <circle cx="9.5" cy="10" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="10" r="0.75" fill="currentColor" stroke="none" />
      <path d="M10 12.5c.8.8 2.2.8 3 0" />
    </Icon>
  );
}

export function IconStage({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M3 20h18" />
      <path d="M6 20V11l6-5 6 5v9" />
      <path d="M3 11l18-5" />
      <path d="M10 14h4" />
    </Icon>
  );
}

export function IconCurtain({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M4 4h16v2c0 3.5-1.8 5.5-4 5.5S12 9.5 12 6v12H4V4z" />
      <path d="M12 11v9" />
      <path d="M8 8c0 1.5.8 2.5 2 2.5M16 8c0 1.5-.8 2.5-2 2.5" />
    </Icon>
  );
}

export function IconQuill({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M4 20c5-9 9-13 17-15-2.5 9-7 13-16 15" />
      <path d="M7.5 16.5l2 2" />
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

export function IconBookOpen({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M12 5c-2-2-6-2-8 0v12c2-1 6-1 8 0V5z" />
      <path d="M12 5c2-2 6-2 8 0v12c-2-1-6-1-8 0V5z" />
      <path d="M12 5v12" />
    </Icon>
  );
}

/** Outdoor amphitheatre tent — Pinkney Park performances */
export function IconTent({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={sw} {...p}>
      <path d="M4 20h16M12 4l8 16H4l8-16z" />
      <path d="M12 4v16" />
      <path d="M8 14h8" />
    </Icon>
  );
}

/* —— Social (brand marks only) —— */
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

/** Learning programs → Shakespeare-themed icons only */
export const learningIconMap = {
  BookOpen: IconBookOpen,
  School: IconBookOpen,
  Video: IconStage,
  Mic: IconStage,
  Globe: IconStage,
  FileText: IconQuill,
  Document: IconQuill,
  Users: IconMasks,
  GraduationCap: IconLaurel,
  Music: IconCurtain,
  Masks: IconMasks,
  Stage: IconStage,
  Quill: IconQuill,
  Tent: IconTent,
  Curtain: IconCurtain,
  Laurel: IconLaurel,
};

export function LearningIcon({ name, ...props }) {
  const Cmp = learningIconMap[name] || IconBookOpen;
  return <Cmp {...props} />;
}
