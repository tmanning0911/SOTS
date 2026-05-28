/**
 * Site icons — Lucide (UI), Tabler (theatre), custom (social + laurel).
 */
import {
  Menu,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Check,
  Image,
  BookOpen,
} from 'lucide-react';
import {
  IconMasksTheater,
  IconTheater,
  IconWriting,
  IconTent as TablerTent,
} from '@tabler/icons-react';
import Icon, { IconFilled } from './Icon';

const SW = 1.35;

function lucide(IconCmp, defaults = {}) {
  return function LucideWrapped({ size = 24, className = '', strokeWidth = SW, ...p }) {
    return <IconCmp size={size} className={className} strokeWidth={strokeWidth} {...defaults} {...p} />;
  };
}

function tabler(IconCmp) {
  return function TablerWrapped({ size = 24, className = '', strokeWidth = SW, ...p }) {
    return <IconCmp size={size} className={className} stroke={1.5} strokeWidth={strokeWidth} {...p} />;
  };
}

/* —— UI (Lucide) —— */
export const IconMenu = lucide(Menu);
export const IconClose = lucide(X);
export const IconSearch = lucide(Search);
export const IconChevronLeft = lucide(ChevronLeft);
export const IconChevronRight = lucide(ChevronRight);
export const IconArrowRight = lucide(ArrowRight);
export const IconExternalLink = lucide(ExternalLink);
export const IconLogOut = lucide(LogOut);
export const IconPlus = lucide(Plus);
export const IconPencil = lucide(Pencil);
export const IconTrash = lucide(Trash2);
export const IconCheck = lucide(Check);
export const IconImage = lucide(Image);

/* —— Theatre (Tabler + Lucide) —— */
export const IconMasks = tabler(IconMasksTheater);
export const IconStage = tabler(IconTheater);
export const IconBookOpen = lucide(BookOpen);
export const IconTent = tabler(TablerTent);
export const IconQuill = tabler(IconWriting);

/** Stage curtains — custom (Tabler has no close match at 24px) */
export function IconCurtain({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={SW} {...p}>
      <path d="M4 4h16v2c0 3.5-1.8 5.5-4 5.5S12 9.5 12 6v12H4V4z" />
      <path d="M12 11v9" />
      <path d="M8 8c0 1.5.8 2.5 2 2.5M16 8c0 1.5-.8 2.5-2 2.5" />
    </Icon>
  );
}

/** Laurel wreath — custom accent */
export function IconLaurel({ size, className, ...p }) {
  return (
    <Icon size={size} className={className} strokeWidth={1.15} {...p}>
      <path d="M8 4c-2 3-2 6 0 9M16 4c2 3 2 6 0 9" />
      <path d="M10 6c-1 2-1 4 0 6M14 6c1 2 1 4 0 6" />
      <path d="M12 20v-4" />
    </Icon>
  );
}

/* —— Social (brand marks) —— */
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
