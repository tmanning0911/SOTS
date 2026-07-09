import { ProfileAvatar } from "./ProfileAvatar.jsx";
import { ProfileBio } from "./ProfileBio.jsx";
import { ProfilePhotoFrame } from "./ProfilePhotoFrame.jsx";

export function TeamProfileCard({ person, variant = "featured" }) {
  const frameSize = variant === "featured" ? "xl" : "lg";
  const frameShape = variant === "featured" ? "portrait" : "portrait";

  return (
    <article className={`orpheum-team-card orpheum-team-card--${variant}`}>
      <div className="orpheum-team-card__media">
        <ProfilePhotoFrame shape={frameShape} size={frameSize}>
          <ProfileAvatar
            name={person.name}
            image={person.image}
            folder="team"
            classPrefix="orpheum-team-card"
          />
        </ProfilePhotoFrame>
      </div>
      <div className="orpheum-team-card__body">
        <div className="orpheum-team-card__header">
          <h3>{person.name}</h3>
          {person.role ? <p className="orpheum-team-card__role">{person.role}</p> : null}
          {person.pronouns ? <p className="orpheum-team-card__pronouns">{person.pronouns}</p> : null}
        </div>
        <ProfileBio
          paragraphs={person.paragraphs}
          bio={person.bio}
          className="orpheum-team-card__bio"
          limit={variant === "featured" ? 280 : 180}
        />
      </div>
    </article>
  );
}
