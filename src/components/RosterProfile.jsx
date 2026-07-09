import { ProfilePhoto } from "./ProfilePhoto.jsx";

function rosterMeta(person) {
  return [person.note, person.location].filter(Boolean).join(" · ");
}

export function TeamProfile({ person, variant = "lead" }) {
  const paragraphs = person.paragraphs ?? (person.bio ? [person.bio] : []);

  return (
    <article className={`orpheum-roster__profile orpheum-roster__profile--${variant}`}>
      <ProfilePhoto
        name={person.name}
        image={person.image}
        folder="team"
        className="orpheum-roster__photo"
      />
      <div className="orpheum-roster__copy">
        <h3>{person.name}</h3>
        {person.role ? <p className="orpheum-roster__role">{person.role}</p> : null}
        {person.pronouns ? <p className="orpheum-roster__pronouns">{person.pronouns}</p> : null}
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

export function BoardOfficer({ person }) {
  return (
    <div className="orpheum-roster__officer">
      <p className="orpheum-roster__role">{person.role}</p>
      <p className="orpheum-roster__name">
        {person.name}
        {person.location ? <span className="orpheum-roster__town"> · {person.location}</span> : null}
      </p>
    </div>
  );
}

export function BoardRosterItem({ person }) {
  const meta = rosterMeta(person);

  return (
    <li className="orpheum-roster__item">
      <span className="orpheum-roster__name">{person.name}</span>
      {meta ? <span className="orpheum-roster__town">{meta}</span> : null}
    </li>
  );
}
