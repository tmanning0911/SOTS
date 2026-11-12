import { HOME_PROGRAMS } from "../../../js/data.js";

function ProgramImage({ item }) {
  return (
    <a className="cdc-program cdc-program--image" href={item.href} aria-label={item.title}>
      <img src={item.image} alt="" loading="lazy" />
      <h3 className="cdc-program__title">{item.title}</h3>
    </a>
  );
}

function ProgramCopy({ item }) {
  return (
    <div className="cdc-program cdc-program--copy">
      <p>{item.body}</p>
      <a className="cdc-btn" href={item.ctaHref}>
        {item.ctaLabel}
      </a>
    </div>
  );
}

export function ProgramsGrid() {
  return (
    <section className="cdc-programs" aria-label="Education and community programs">
      {HOME_PROGRAMS.map((item) =>
        item.kind === "image" ? (
          <ProgramImage key={item.id} item={item} />
        ) : (
          <ProgramCopy key={item.id} item={item} />
        ),
      )}
    </section>
  );
}
