import { SUPPORT_MISSION } from "../../../js/data.js";
import { ArrowButton } from "../ArrowButton.jsx";

export function SupportMission() {
  const {
    eyebrow,
    title,
    body,
    image,
    donateLabel,
    donateHref,
    secondaryLabel,
    secondaryHref,
    stats,
    pathways,
  } = SUPPORT_MISSION;

  return (
    <section className="orpheum-support-split" aria-labelledby="support-heading">
      <div className="orpheum-support-split__inner" data-reveal>
        <div className="orpheum-support-split__copy">
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

        <div className="orpheum-support-split__media">
          <div className="orpheum-impact-frame">
            <span className="orpheum-impact-frame__accent" aria-hidden="true" />
            <div className="orpheum-impact-frame__photo">
              <img
                className="orpheum-impact-frame__image"
                src={image}
                alt="Audience at Shakespeare on the Sound in Pinkney Park"
                loading="lazy"
                width={600}
                height={600}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
