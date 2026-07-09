import { MEDIA, SUPPORT_MISSION } from "../../../js/data.js";
import { ArrowButton } from "../ArrowButton.jsx";

export function SupportMission() {
  const { eyebrow, title, body, donateLabel, donateHref, secondaryLabel, secondaryHref, stats, pathways } =
    SUPPORT_MISSION;

  return (
    <section className="orpheum-support-banner" aria-labelledby="support-heading">
      <div className="orpheum-support-banner__stage">
        <img
          className="orpheum-support-banner__bg"
          src={MEDIA.donateImage}
          alt=""
          loading="lazy"
          width={1200}
          height={675}
        />
        <span className="orpheum-support-banner__gradient" aria-hidden="true" />

        <div className="orpheum-support-banner__shell">
          <div className="orpheum-support-banner__frame" aria-hidden="true" />

          <div className="orpheum-support-banner__content" data-reveal>
            <p className="orpheum-support-banner__eyebrow">{eyebrow}</p>
            <h2 id="support-heading">{title}</h2>
            <p>{body}</p>

            <ul className="orpheum-support-banner__stats" aria-label="Impact highlights">
              {stats.map((stat) => (
                <li key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </li>
              ))}
            </ul>

            <div className="orpheum-support-banner__actions">
              <ArrowButton href={donateHref} target="_blank" rel="noopener noreferrer">
                {donateLabel}
              </ArrowButton>
              <ArrowButton href={secondaryHref} variant="ghost">
                {secondaryLabel}
              </ArrowButton>
            </div>

            <nav className="orpheum-support-banner__pathways" aria-label="Support options">
              {pathways.map((path) => (
                <a key={path.href} href={path.href}>
                  {path.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
