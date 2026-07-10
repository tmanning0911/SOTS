import { HERO_HOME, MEDIA } from "../../../js/data.js";
import { TicketArrowButton } from "../ticketing/TicketArrowButton.jsx";
import { HeroStarrySky } from "./HeroStarrySky.jsx";

export function Hero() {
  return (
    <section className="orpheum-hero" aria-labelledby="orpheum-hero-heading">
      <div className="orpheum-hero__media" aria-hidden="true">
        <img
          src={MEDIA.heroHome}
          alt=""
          fetchPriority="high"
          decoding="async"
          width={1024}
          height={535}
        />
      </div>
      <div className="orpheum-hero__veil" aria-hidden="true" />
      <HeroStarrySky />

      <div className="orpheum-hero__shell">
        <div className="orpheum-hero__content" data-hero-animate>
          <h1 id="orpheum-hero-heading" className="orpheum-hero__title" data-hero-title>
            {HERO_HOME.titleLines.map((line, index) => (
              <span
                key={line}
                className={`orpheum-hero__title-line${index === 0 ? " orpheum-hero__title-line--lead" : ""}`}
              >
                {line}
              </span>
            ))}
            <span className="orpheum-hero__title-line orpheum-hero__title-line--final">
              {HERO_HOME.titleLastLine}{" "}
              <mark className="orpheum-hero__highlight">{HERO_HOME.titleHighlight}</mark>
            </span>
          </h1>
          <TicketArrowButton
            label={HERO_HOME.ctaLabel}
            className="orpheum-arrow-btn--hero"
          />
        </div>
      </div>
    </section>
  );
}
