import { HERO_HOME, MEDIA } from "../../../js/data.js";

export function Hero() {
  return (
    <section className="cdc-hero" aria-labelledby="cdc-hero-heading">
      <div className="cdc-hero__media" aria-hidden="true">
        <img
          src={MEDIA.heroHome}
          alt=""
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className="cdc-hero__veil" aria-hidden="true" />

      <div className="cdc-hero__content" data-hero-animate>
        <h1 id="cdc-hero-heading" className="cdc-hero__brand">
          {HERO_HOME.brand}
        </h1>
        <p className="cdc-hero__tagline">{HERO_HOME.tagline}</p>
      </div>
    </section>
  );
}
