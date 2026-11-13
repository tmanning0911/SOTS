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
      {/* Soft brand watermark — Collage’s translucent mark, without purple AI glow */}
      <div className="cdc-hero__watermark" aria-hidden="true">
        <span>S</span>
      </div>

      <div className="cdc-hero__content" data-hero-animate>
        <h1 id="cdc-hero-heading" className="cdc-hero__brand">
          <span className="cdc-hero__brand-line">Shakespeare</span>
          <span className="cdc-hero__brand-line">on the Sound</span>
        </h1>
        <p className="cdc-hero__tagline">{HERO_HOME.tagline}</p>
      </div>
    </section>
  );
}
