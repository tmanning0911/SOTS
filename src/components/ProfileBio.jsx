import { useId, useState } from "react";

function joinParagraphs(paragraphs, bio) {
  return paragraphs ?? (bio ? [bio] : []);
}

export function ProfileBio({ paragraphs, bio, limit = 180, className = "" }) {
  const content = joinParagraphs(paragraphs, bio);
  if (!content.length) return null;

  const fullText = content.join(" ");
  const isLong = fullText.length > limit;
  const [expanded, setExpanded] = useState(false);
  const controlId = useId();

  if (!isLong) {
    return (
      <div className={`orpheum-profile-bio ${className}`.trim()}>
        {content.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>
    );
  }

  const preview = `${fullText.slice(0, limit).trim()}…`;

  return (
    <div className={`orpheum-profile-bio orpheum-profile-bio--expandable ${className}`.trim()}>
      <div id={controlId} className="orpheum-profile-bio__text">
        {expanded
          ? content.map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>)
          : <p>{preview}</p>}
      </div>
      <button
        type="button"
        className="orpheum-profile-bio__toggle"
        aria-expanded={expanded}
        aria-controls={controlId}
        onClick={() => setExpanded((open) => !open)}
      >
        {expanded ? "Show less" : "Read bio"}
      </button>
    </div>
  );
}
