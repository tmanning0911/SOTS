import { HOME_FOR_EVERYONE, HOME_PROGRAMS } from "../../../js/data.js";

/**
 * Collage “Dance is for everyone” + alternating image/copy program grid
 * as one continuous red section.
 */
export function EducationBlock() {
  return (
    <section className="cdc-education" aria-labelledby="cdc-everyone-heading">
      <div className="cdc-everyone">
        <h2 id="cdc-everyone-heading" className="cdc-everyone__headline">
          {HOME_FOR_EVERYONE.headline}
          <span>{HOME_FOR_EVERYONE.highlight}</span>
        </h2>
        <p className="cdc-everyone__sub">{HOME_FOR_EVERYONE.subhead}</p>
      </div>

      <div className="cdc-programs" aria-label="Education and community programs">
        {HOME_PROGRAMS.map((item) =>
          item.kind === "image" ? (
            <a
              key={item.id}
              className="cdc-program cdc-program--image"
              href={item.href}
              aria-label={item.title}
            >
              <img src={item.image} alt="" loading="lazy" />
              <h3 className="cdc-program__title">{item.title}</h3>
            </a>
          ) : (
            <div key={item.id} className="cdc-program cdc-program--copy">
              <p>{item.body}</p>
              <a className="cdc-btn cdc-btn--navy" href={item.ctaHref}>
                {item.ctaLabel}
              </a>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
