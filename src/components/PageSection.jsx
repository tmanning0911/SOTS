function ensurePeriod(text) {
  if (!text) return text;
  return text.endsWith(".") ? text : `${text}.`;
}

function BoardPersonMeta({ person }) {
  const parts = [person.note, person.location].filter(Boolean);
  if (!parts.length) return null;
  return <p className="orpheum-board-card__meta">{parts.join(" · ")}</p>;
}

export function PageSection({ section }) {
  const heading = section.heading ? ensurePeriod(section.heading) : null;

  if (section.type === "people") {
    return (
      <section className="orpheum-inner-page__section">
        {heading ? <h2 className="orpheum-inner-page__section-title">{heading}</h2> : null}
        <div className="orpheum-inner-page__people">
          {section.people.map((person) => (
            <article key={person.name} className="orpheum-inner-page__person">
              <h3>{person.name}</h3>
              {person.role ? <p className="orpheum-inner-page__person-role">{person.role}</p> : null}
              {person.pronouns ? (
                <p className="orpheum-inner-page__person-pronouns">{person.pronouns}</p>
              ) : null}
              {(person.paragraphs ?? (person.bio ? [person.bio] : [])).map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "board") {
    return (
      <section className="orpheum-inner-page__section orpheum-inner-page__section--board">
        {heading ? <h2 className="orpheum-inner-page__section-title">{heading}</h2> : null}

        <div className="orpheum-board">
          <div className="orpheum-board__officers">
            <h3 className="orpheum-board__label">Officers</h3>
            <ul className="orpheum-board__officer-grid">
              {section.officers.map((officer) => (
                <li key={officer.role}>
                  <article className="orpheum-board-card orpheum-board-card--officer">
                    <p className="orpheum-board-card__role">{officer.role}</p>
                    <h4>{officer.name}</h4>
                    {officer.location ? (
                      <p className="orpheum-board-card__meta">{officer.location}</p>
                    ) : null}
                  </article>
                </li>
              ))}
            </ul>
          </div>

          <div className="orpheum-board__members">
            <h3 className="orpheum-board__label">Board Members</h3>
            <ul className="orpheum-board__member-grid">
              {section.members.map((member) => (
                <li key={member.name}>
                  <article className="orpheum-board-card orpheum-board-card--member">
                    <h4>{member.name}</h4>
                    {member.location ? (
                      <p className="orpheum-board-card__meta">{member.location}</p>
                    ) : null}
                  </article>
                </li>
              ))}
            </ul>
          </div>

          {section.advisory?.length ? (
            <div className="orpheum-board__advisory">
              <h3 className="orpheum-board__label">Advisory Board</h3>
              <ul className="orpheum-board__member-grid orpheum-board__member-grid--advisory">
                {section.advisory.map((person) => (
                  <li key={person.name}>
                    <article className="orpheum-board-card orpheum-board-card--member orpheum-board-card--advisory">
                      <h4>{person.name}</h4>
                      <BoardPersonMeta person={person} />
                    </article>
                  </li>
                ))}
              </ul>
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
