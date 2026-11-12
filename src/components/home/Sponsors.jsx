import { SPONSORS } from "../../../js/data.js";

export function Sponsors() {
  return (
    <section className="cdc-sponsors" aria-labelledby="cdc-sponsors-heading">
      <h2 id="cdc-sponsors-heading" className="cdc-sponsors__title">
        Season support generously provided by
      </h2>
      <div className="cdc-sponsors__grid">
        {SPONSORS.map((sponsor) => (
          <img
            key={sponsor.name}
            src={sponsor.image}
            alt={sponsor.name}
            loading="lazy"
            style={{
              maxWidth: sponsor.maxWidth?.sm || sponsor.maxWidth?.base || "160px",
              maxHeight: sponsor.maxHeight || undefined,
            }}
          />
        ))}
      </div>
    </section>
  );
}
