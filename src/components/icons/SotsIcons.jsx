/**
 * Site icons — Noun Project theatre set (https://thenounproject.com/search/icons/?q=THEATRE)
 */
import NounIcon from './NounIcon';

function icon(name) {
  return function NounWrapped(props) {
    return <NounIcon name={name} {...props} />;
  };
}

/* —— UI —— */
export const IconMenu = icon('menu');
export const IconClose = icon('close');
export const IconSearch = icon('search');
export const IconChevronLeft = icon('chevron-left');
export const IconChevronRight = icon('chevron-right');
export const IconChevronDown = icon('chevron-down');
export const IconArrowRight = icon('arrow-right');
export const IconExternalLink = icon('external-link');
export const IconLogOut = icon('logout');
export const IconPlus = icon('plus');
export const IconPencil = icon('pencil');
export const IconTrash = icon('trash');
export const IconCheck = icon('check');
export const IconImage = icon('image');

/* —— Theatre —— */
export const IconMasks = icon('masks');
export const IconStage = icon('stage');
export const IconBookOpen = icon('book');
export const IconTent = icon('tent');
export const IconQuill = icon('quill');
export const IconCurtain = icon('curtain');
export const IconLaurel = icon('laurel');

/* —— Social —— */
export const IconFacebook = icon('facebook');
export const IconInstagram = icon('instagram');
export const IconTwitter = icon('twitter');
export const IconYoutube = icon('youtube');

export const learningIconMap = {
  BookOpen: IconBookOpen,
  School: IconBookOpen,
  Video: icon('video'),
  Mic: icon('mic'),
  Globe: icon('globe'),
  FileText: IconQuill,
  Document: IconQuill,
  Users: icon('users'),
  GraduationCap: icon('graduation'),
  Music: icon('music'),
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
