import { SPONSORS } from "../../../js/data.js";

const CAROUSEL_SPONSORS = [...SPONSORS, ...SPONSORS];

export function Sponsors() {
  return (
    <section className="orpheum-partners" aria-labelledby="sponsors-heading">
      <div className="orpheum-partners__shell">
        <div className="orpheum-partners__intro" data-reveal>
          <h2 id="sponsors-heading">Our Sponsors</h2>
        </div>

        <div
          className="orpheum-partners__carousel"
          aria-label="Sponsor logos carousel"
          aria-live="off"
        >
          <div className="orpheum-partners__track">
            {CAROUSEL_SPONSORS.map((sponsor, index) => (
              <div
                key={`${sponsor.name}-${index}`}
                className="orpheum-partners__slide"
                style={{
                  "--partner-max-width": sponsor.maxWidth?.sm ?? sponsor.maxWidth?.base ?? "175px",
                  "--partner-max-height": sponsor.maxHeight ?? "4.75rem",
                }}
              >
                <img src={sponsor.image} alt={sponsor.name} loading="lazy" width={200} height={80} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
