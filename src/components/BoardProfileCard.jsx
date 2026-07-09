import { getBoardProfile } from "../../js/board-profiles.js";
import { ProfileAvatar } from "./ProfileAvatar.jsx";

export function BoardProfileCard({ person, variant = "member" }) {
  const profile = getBoardProfile(person.name);
  const bio = person.bio ?? profile.bio;
  const image = person.image ?? profile.image;
  const role = person.role;
  const meta = [person.note, person.location].filter(Boolean).join(" · ");

  return (
    <article className={`orpheum-board-card orpheum-board-card--${variant}`}>
      <div className="orpheum-board-card__media">
        <ProfileAvatar
          name={person.name}
          image={image}
          folder="board"
          classPrefix="orpheum-board-card"
        />
      </div>
      <div className="orpheum-board-card__body">
        {role ? <p className="orpheum-board-card__role">{role}</p> : null}
        <h4>{person.name}</h4>
        {meta ? <p className="orpheum-board-card__meta">{meta}</p> : null}
        {bio ? <p className="orpheum-board-card__bio">{bio}</p> : null}
      </div>
    </article>
  );
}
