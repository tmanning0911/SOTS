import { SUPPORT_MISSION } from "../../../js/data.js";
import { ArrowButton } from "../ArrowButton.jsx";

export function SupportMission() {
  const {
    eyebrow,
    title,
    body,
    backgroundImage,
    donateLabel,
    donateHref,
    secondaryLabel,
    secondaryHref,
    stats,
    pathways,
  } = SUPPORT_MISSION;

  return (
    <section
      className="orpheum-support-split"
      aria-labelledby="support-heading"
      style={{ "--support-bg": `url(${backgroundImage})` }}
    >
      <div className="orpheum-support-split__scrim" aria-hidden="true" />
      <div className="orpheum-support-split__inner" data-reveal>
        <div className="orpheum-support-split__prose">
          <p className="orpheum-support-split__eyebrow">{eyebrow}</p>
          <h2 id="support-heading" className="orpheum-support-split__title">
            {title}
          </h2>
          <p>{body}</p>

          <ul className="orpheum-support-split__stats" aria-label="Support highlights">
            {stats.map((stat) => (
              <li key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </li>
            ))}
          </ul>

          <div className="orpheum-support-split__actions">
            <ArrowButton href={donateHref} target="_blank" rel="noopener noreferrer">
              {donateLabel}
            </ArrowButton>
            <a className="orpheum-support-split__secondary" href={secondaryHref}>
              {secondaryLabel}
            </a>
          </div>

          <nav className="orpheum-support-split__pathways" aria-label="Support options">
            {pathways.map((path) => (
              <a key={path.href} href={path.href}>
                {path.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
