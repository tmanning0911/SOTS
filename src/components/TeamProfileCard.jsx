import { ProfileAvatar } from "./ProfileAvatar.jsx";

function TeamBio({ person }) {
  const paragraphs = person.paragraphs ?? (person.bio ? [person.bio] : []);
  if (!paragraphs.length) return null;

  return (
    <div className="orpheum-team-card__bio">
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
    </div>
  );
}

export function TeamProfileCard({ person, variant = "featured" }) {
  return (
    <article className={`orpheum-team-card orpheum-team-card--${variant}`}>
      <div className="orpheum-team-card__media">
        <ProfileAvatar
          name={person.name}
          image={person.image}
          folder="team"
          classPrefix="orpheum-team-card"
        />
      </div>
      <div className="orpheum-team-card__body">
        <h3>{person.name}</h3>
        {person.role ? <p className="orpheum-team-card__role">{person.role}</p> : null}
        {person.pronouns ? <p className="orpheum-team-card__pronouns">{person.pronouns}</p> : null}
        <TeamBio person={person} />
      </div>
    </article>
  );
}
