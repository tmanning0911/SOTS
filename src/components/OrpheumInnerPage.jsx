import { ArrowButton } from "./ArrowButton.jsx";
import { InnerPageShell } from "./InnerPageShell.jsx";
import { PageSection } from "./PageSection.jsx";
import { TicketArrowButton } from "./ticketing/TicketArrowButton.jsx";
import { isTicketCheckoutUrl, TICKETS_PAGE_PATH } from "../../js/ticketing.js";

export function OrpheumInnerPage({ page }) {
  if (!page) return null;

  const sections =
    page.sections ??
    (page.paragraphs || page.body
      ? [{ type: "prose", paragraphs: page.paragraphs ?? (page.body ? [page.body] : []) }]
      : []);

  return (
    <InnerPageShell
      showVisit={page.showVisit !== false}
      showSupport={Boolean(page.showSupport)}
      showNewsletter={page.showNewsletter !== false}
    >
      <article className="orpheum-inner-page">
        <header className="orpheum-inner-page__hero">
          <div className="orpheum-inner-page__hero-inner" data-reveal>
            {page.eyebrow ? <p className="orpheum-inner-page__eyebrow">{page.eyebrow}</p> : null}
            <h1>{page.heading}</h1>
            {page.intro ? <p className="orpheum-inner-page__intro">{page.intro}</p> : null}
          </div>
        </header>

        <div className="orpheum-inner-page__body">
          <div className="orpheum-inner-page__content" data-reveal>
            {sections.map((section, index) => (
              <PageSection key={`${section.heading ?? "section"}-${index}`} section={section} />
            ))}

            {page.cta ? (
              <div className="orpheum-inner-page__cta">
                <ArrowButton
                  href={page.cta.href}
                  {...(page.cta.external ? { target: "_blank", rel: "noopener" } : {})}
                >
                  {page.cta.label}
                </ArrowButton>
              </div>
            ) : null}

            {page.secondaryCta ? (
              <div className="orpheum-inner-page__cta">
                {isTicketCheckoutUrl(page.secondaryCta.href, TICKETS_PAGE_PATH) ? (
                  <TicketArrowButton label={page.secondaryCta.label} variant="ghost" />
                ) : (
                  <ArrowButton
                    href={page.secondaryCta.href}
                    variant="ghost"
                    {...(page.secondaryCta.external ? { target: "_blank", rel: "noopener" } : {})}
                  >
                    {page.secondaryCta.label}
                  </ArrowButton>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </article>
    </InnerPageShell>
  );
}
