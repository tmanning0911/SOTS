import { BoardProfileCard } from "./BoardProfileCard.jsx";
import { TeamProfileCard } from "./TeamProfileCard.jsx";

function ensurePeriod(text) {
  if (!text) return text;
  return text.endsWith(".") ? text : `${text}.`;
}

export function PageSection({ section }) {
  const heading = section.heading ? ensurePeriod(section.heading) : null;

  if (section.type === "people") {
    const variant = section.layout === "history" ? "history" : "featured";

    return (
      <section className="orpheum-inner-page__section orpheum-inner-page__section--team">
        {heading ? <h2 className="orpheum-inner-page__section-title">{heading}</h2> : null}
        <ul className={`orpheum-team__grid orpheum-team__grid--${variant}`}>
          {section.people.map((person) => (
            <li key={person.name}>
              <TeamProfileCard person={person} variant={variant} />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (section.type === "board") {
    return (
      <section className="orpheum-inner-page__section orpheum-inner-page__section--board">
        {heading ? <h2 className="orpheum-inner-page__section-title">{heading}</h2> : null}

        <div className="orpheum-board">
          <div className="orpheum-board__band orpheum-board__band--officers">
            <div className="orpheum-board__officers">
              <h3 className="orpheum-board__label">Officers</h3>
              <ul className="orpheum-board__officer-grid">
                {section.officers.map((officer) => (
                  <li key={officer.role}>
                    <BoardProfileCard person={officer} variant="officer" />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="orpheum-board__members">
            <h3 className="orpheum-board__label">Board Members</h3>
            <ul className="orpheum-board__member-grid">
              {section.members.map((member) => (
                <li key={member.name}>
                  <BoardProfileCard person={member} variant="member" />
                </li>
              ))}
            </ul>
          </div>

          {section.advisory?.length ? (
            <div className="orpheum-board__band orpheum-board__band--advisory">
              <div className="orpheum-board__advisory">
                <h3 className="orpheum-board__label">Advisory Board</h3>
                <ul className="orpheum-board__advisory-grid">
                  {section.advisory.map((person) => (
                    <li key={person.name}>
                      <BoardProfileCard person={person} variant="advisory" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  if (section.type === "groups") {
    return (
      <section className="orpheum-inner-page__section">
        {heading ? <h2 className="orpheum-inner-page__section-title">{heading}</h2> : null}
        <div className="orpheum-inner-page__groups">
          {section.groups.map((group) => (
            <div key={group.label} className="orpheum-inner-page__group">
              <h3>{group.label}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "programs") {
    return (
      <section className="orpheum-inner-page__section">
        {heading ? <h2 className="orpheum-inner-page__section-title">{heading}</h2> : null}
        <div className="orpheum-inner-page__programs">
          {section.programs.map((program) => (
            <article key={program.title} className="orpheum-inner-page__program">
              <h3>{ensurePeriod(program.title)}</h3>
              {program.meta?.length ? (
                <ul className="orpheum-inner-page__program-meta">
                  {program.meta.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : null}
              {(program.paragraphs ?? []).map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "tiers") {
    return (
      <section className="orpheum-inner-page__section">
        {heading ? <h2 className="orpheum-inner-page__section-title">{heading}</h2> : null}
        <div className="orpheum-inner-page__tiers">
          {section.tiers.map((tier) => (
            <article key={tier.title} className="orpheum-inner-page__tier">
              <h3>{tier.title}</h3>
              <ul>
                {tier.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "details") {
    return (
      <section className="orpheum-inner-page__section">
        {heading ? <h2 className="orpheum-inner-page__section-title">{heading}</h2> : null}
        <dl className="orpheum-inner-page__details">
          {section.rows.map((row) => (
            <div key={row.label} className="orpheum-inner-page__detail">
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    );
  }

  if (section.type === "links") {
    return (
      <section className="orpheum-inner-page__section orpheum-inner-page__section--links">
        {heading ? <h2 className="orpheum-inner-page__section-title">{heading}</h2> : null}
        <ul className="orpheum-inner-page__links">
          {section.links.map((link) => (
            <li key={link.href + link.label}>
              <a href={link.href} {...(link.external ? { target: "_blank", rel: "noopener" } : {})}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="orpheum-inner-page__section">
      {heading ? <h2 className="orpheum-inner-page__section-title">{heading}</h2> : null}
      {(section.paragraphs ?? []).map((paragraph) => (
        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
      ))}
      {section.bullets?.length ? (
        <ul className="orpheum-inner-page__bullets">
          {section.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
