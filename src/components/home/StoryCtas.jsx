import { HOME_STORY_CTAS } from "../../../js/data.js";

/**
 * Collage split membership / donate panels — full-bleed photo tiles, no gutters.
 */
export function StoryCtas() {
  return (
    <section className="cdc-story" aria-label="Support Shakespeare on the Sound">
      {HOME_STORY_CTAS.map((card, index) => (
        <article
          key={card.id}
          className={`cdc-story__card${index === 0 ? " cdc-story__card--lead" : ""}`}
        >
          <img src={card.image} alt="" loading="lazy" />
          {index === 0 ? (
            <>
              <div className="cdc-story__top">
                <p className="cdc-story__eyebrow">{card.eyebrow}</p>
                <h2 className="cdc-story__title cdc-story__title--top">{card.title}</h2>
              </div>
              <div className="cdc-story__copy cdc-story__copy--bottom">
                <p className="cdc-story__body">{card.body}</p>
                <a className="cdc-btn" href={card.ctaHref}>
                  {card.ctaLabel}
                </a>
              </div>
            </>
          ) : (
            <div className="cdc-story__copy">
              <h2 className="cdc-story__title">{card.title}</h2>
              <p className="cdc-story__body">{card.body}</p>
              <a className="cdc-btn" href={card.ctaHref}>
                {card.ctaLabel}
              </a>
            </div>
          )}
        </article>
      ))}
    </section>
  );
}
