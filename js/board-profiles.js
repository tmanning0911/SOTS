import { profileSlug } from "./profile-utils.js";

export const boardSlug = profileSlug;

/** Optional bios sourced from SOTS history, donor pages, and founding records. */
export const BOARD_PROFILES = {
  "charlotte-lyeth-burton": {
    bio: "Board president and longtime champion of Shakespeare on the Sound. The Charlotte Lyeth Burton Leadership Giving Society recognizes leadership gifts of $20,000 and above.",
  },
  "michael-sagalyn": {
    bio: "Vice president and Rowayton resident. A longtime supporter whose philanthropy helps sustain affordable summer productions in Pinkney Park.",
  },
  "viola-yee": {
    bio: "Board secretary supporting governance and community outreach for the company’s year-round education and summer festival programs.",
  },
  "peggy-parskey": {
    bio: "Board treasurer overseeing fiscal stewardship for Shakespeare on the Sound’s nonprofit operations in Norwalk and Rowayton.",
  },
  "megan-and-keith-mcallister": {
    bio: "Co-founder who first proposed outdoor Shakespeare in Rowayton. With Ezra Barnes and the founding board, she helped launch the company and raise funds for the first production in 1995.",
  },
  "andy-and-melissa-woolford": {
    bio: "Founding board members who helped establish Shakespeare on the Sound and build its early community support in South Norwalk.",
  },
  "daniel-barzach": {
    bio: "Board member and Darien resident supporting fundraising and community partnerships for the summer festival.",
  },
  "russell-coleman": {
    bio: "Rowayton-based board member helping guide production planning and local engagement around Pinkney Park.",
  },
  "kristen-ennis": {
    bio: "Board member from Rowayton active in donor development and community events for the company.",
  },
  "john-hollywood": {
    bio: "Rowayton board member and longtime supporter recognized among the organization’s Angels-level donors.",
  },
  "maria-mendoza-smith": {
    bio: "New Canaan board member supporting education outreach and audience development across Fairfield County.",
  },
  "justin-hokin": {
    bio: "Silvermine-based board member connected to local arts philanthropy through the Dave Hokin Foundation’s support of the festival.",
  },
  "taylor-manning": {
    bio: "Norwalk board member supporting digital presence, communications, and audience engagement for Shakespeare on the Sound.",
  },
};

export function getBoardProfile(name) {
  return BOARD_PROFILES[boardSlug(name)] ?? {};
}
