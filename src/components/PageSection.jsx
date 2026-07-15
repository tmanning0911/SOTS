import { BoardOfficer, BoardRosterItem, TeamProfile } from "./RosterProfile.jsx";
import { TicketCheckoutLink } from "./ticketing/TicketCheckoutLink.jsx";
import { isTicketCheckoutUrl, TICKETS_PAGE_PATH } from "../../js/ticketing.js";
import { looksLikeEmail, extractMailtoAddress } from "../../js/contact-recipients.js";
import { MailLink } from "./MailLink.jsx";
import { TextWithMailLinks } from "./TextWithMailLinks.jsx";

function ensurePeriod(text) {
  if (!text) return text;
  return text.endsWith(".") ? text : `${text}.`;
}

function parseTimelineEntry(paragraph) {
  const match = paragraph.trim().match(/^(\d{4}(?:–\d{4})?|\d{4}–\d{4})\s*[—–-]\s*(.+)$/s);
  if (!match) return { year: "", text: paragraph };
  return { year: match[1], text: match[2].trim() };
}

function isTimelineSection(section) {
  const paragraphs = section.paragraphs ?? [];
  if (!paragraphs.length) return false;
  return paragraphs.every((p) => /^\d{4}/.test(String(p).trim()));
}

export function PageSection({ section, band = false }) {
  const heading = section.heading ? ensurePeriod(section.heading) : null;
  const bandClass = band ? " orpheum-inner-page__section--band" : "";

  if (section.type !== "people" && isTimelineSection(section)) {
    return (
      <section className={`orpheum-inner-page__section orpheum-inner-page__section--timeline${bandClass}`}>
        {heading ? <h2 className="orpheum-inner-page__section-title">{heading}</h2> : null}
        <ol className="orpheum-timeline">
          {(section.paragraphs ?? []).map((paragraph) => {
            const { year, text } = parseTimelineEntry(paragraph);
            return (
              <li key={year + text.slice(0, 24)} className="orpheum-timeline__item">
                <span className="orpheum-timeline__year">{year}</span>
                <p className="orpheum-timeline__text">{text}</p>
              </li>
            );
          })}
        </ol>
      </section>
    );
  }

  if (section.type === "people") {
    const variant = section.layout === "history" ? "history" : "lead";

    return (
      <section className={`orpheum-inner-page__section orpheum-inner-page__section--team${bandClass}`}>
        {heading ? <h2 className="orpheum-inner-page__section-title">{heading}</h2> : null}
        <div className={`orpheum-roster orpheum-roster--team orpheum-roster--${variant}`}>
          {section.people.map((person) => (
            <TeamProfile key={person.name} person={person} variant={variant} />
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "board") {
    return (
      <section className={`orpheum-inner-page__section orpheum-inner-page__section--board${bandClass}`}>
        {heading ? <h2 className="orpheum-inner-page__section-title">{heading}</h2> : null}

        <div className="orpheum-roster orpheum-roster--board">
          <div className="orpheum-roster__group">
            <h3 className="orpheum-roster__heading">Officers</h3>
            <div className="orpheum-roster__officers">
              {section.officers.map((officer) => (
                <BoardOfficer key={officer.role} person={officer} />
              ))}
            </div>
          </div>

          <div className="orpheum-roster__group">
            <h3 className="orpheum-roster__heading">Board Members</h3>
            <ul className="orpheum-roster__list">
              {section.members.map((member) => (
                <BoardRosterItem key={member.name} person={member} />
              ))}
            </ul>
          </div>

          {section.advisory?.length ? (
            <div className="orpheum-roster__group">
              <h3 className="orpheum-roster__heading">Advisory Board</h3>
              <ul className="orpheum-roster__list orpheum-roster__list--advisory">
                {section.advisory.map((person) => (
                  <BoardRosterItem key={person.name} person={person} />
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
      <section className={`orpheum-inner-page__section${bandClass}`}>
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
      <section className={`orpheum-inner-page__section${bandClass}`}>
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
                <p key={paragraph.slice(0, 40)}>
                  <TextWithMailLinks text={paragraph} />
                </p>
              ))}
              {program.cta?.href ? (
                <p className="orpheum-inner-page__program-cta">
                  <a href={program.cta.href}>{program.cta.label || "Learn more"}</a>
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "tiers") {
    return (
      <section className={`orpheum-inner-page__section${bandClass}`}>
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
      <section className={`orpheum-inner-page__section${bandClass}`}>
        {heading ? <h2 className="orpheum-inner-page__section-title">{heading}</h2> : null}
        <dl className="orpheum-inner-page__details">
          {section.rows.map((row) => (
            <div key={row.label} className="orpheum-inner-page__detail">
              <dt>{row.label}</dt>
              <dd>
                {looksLikeEmail(row.value) ? (
                  <MailLink email={row.value}>{row.value}</MailLink>
                ) : (
                  <TextWithMailLinks text={row.value} />
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    );
  }

  if (section.type === "links") {
    return (
      <section className={`orpheum-inner-page__section orpheum-inner-page__section--links${bandClass}`}>
        {heading ? <h2 className="orpheum-inner-page__section-title">{heading}</h2> : null}
        <ul className="orpheum-inner-page__links">
          {section.links.map((link) => (
            <li key={link.href + link.label}>
              {isTicketCheckoutUrl(link.href, TICKETS_PAGE_PATH) ? (
                <TicketCheckoutLink href={link.href} className="sots-ticket-checkout-link">
                  {link.label}
                </TicketCheckoutLink>
              ) : /^mailto:/i.test(link.href) ? (
                <MailLink email={extractMailtoAddress(link.href)}>{link.label}</MailLink>
              ) : (
                <a href={link.href} {...(link.external ? { target: "_blank", rel: "noopener" } : {})}>
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className={`orpheum-inner-page__section${bandClass}`}>
      {heading ? <h2 className="orpheum-inner-page__section-title">{heading}</h2> : null}
      {(section.paragraphs ?? []).map((paragraph) => (
        <p key={paragraph.slice(0, 40)}>
          <TextWithMailLinks text={paragraph} />
        </p>
      ))}
      {section.bullets?.length ? (
        <ul className="orpheum-inner-page__bullets">
          {section.bullets.map((item) => (
            <li key={item}>
              <TextWithMailLinks text={item} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}