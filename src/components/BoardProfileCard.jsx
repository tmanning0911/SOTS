import { getBoardProfile } from "../../js/board-profiles.js";
import { ProfileAvatar, profileHasPhoto } from "./ProfileAvatar.jsx";
import { ProfileBio } from "./ProfileBio.jsx";
import { ProfilePhotoFrame } from "./ProfilePhotoFrame.jsx";

export function BoardProfileCard({ person, variant = "member" }) {
  const profile = getBoardProfile(person.name);
  const bio = person.bio ?? profile.bio;
  const image = person.image ?? profile.image;
  const role = person.role;
  const meta = [person.note, person.location].filter(Boolean).join(" · ");
  const frameShape = variant === "officer" ? "square" : "circle";
  const frameSize = variant === "officer" ? "lg" : variant === "advisory" ? "sm" : "md";
  const hasPhoto = profileHasPhoto(person.name, "board", image);

  if (variant === "advisory") {
    return (
      <article className="orpheum-board-card orpheum-board-card--advisory">
        <ProfileAvatar
          name={person.name}
          image={image}
          folder="board"
          classPrefix="orpheum-board-card"
        />
        <div className="orpheum-board-card__body">
          <h4>{person.name}</h4>
          {meta ? <p className="orpheum-board-card__meta">{meta}</p> : null}
        </div>
      </article>
    );
  }

  return (
    <article className={`orpheum-board-card orpheum-board-card--${variant}`}>
      <div className="orpheum-board-card__media">
        <ProfilePhotoFrame shape={frameShape} size={frameSize} empty={!hasPhoto}>
          <ProfileAvatar
            name={person.name}
            image={image}
            folder="board"
            classPrefix="orpheum-board-card"
          />
        </ProfilePhotoFrame>
      </div>
      <div className="orpheum-board-card__body">
        {role ? <p className="orpheum-board-card__role">{role}</p> : null}
        <h4>{person.name}</h4>
        {meta ? <p className="orpheum-board-card__meta">{meta}</p> : null}
        <ProfileBio bio={bio} className="orpheum-board-card__bio" limit={variant === "member" ? 120 : 220} />
      </div>
    </article>
  );
}
