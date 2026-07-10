import { heroImageForHref } from "../../js/page-heroes.js";
import { isTicketCheckoutUrl, TICKETS_PAGE_PATH } from "../../js/ticketing.js";
import { ArrowButton } from "./ArrowButton.jsx";
import { InnerPageHero } from "./InnerPageHero.jsx";
import { InnerPageShell } from "./InnerPageShell.jsx";
import { PageSection } from "./PageSection.jsx";
import { TicketArrowButton } from "./ticketing/TicketArrowButton.jsx";

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
        <InnerPageHero
          eyebrow={page.eyebrow}
          title={page.heading}
          intro={page.intro}
          image={page.heroImage ?? heroImageForHref(page.href)}
        />

        <div className="orpheum-inner-page__body">
          <div className="orpheum-inner-page__content" data-reveal>
            {sections.map((section, index) => (
              <PageSection key={`${section.heading ?? "section"}-${index}`} section={section} />
            ))}

            {(page.cta || page.secondaryCta) ? (
              <div className="orpheum-inner-page__cta">
                {page.cta ? (
                  <ArrowButton
                    href={page.cta.href}
                    {...(page.cta.external ? { target: "_blank", rel: "noopener" } : {})}
                  >
                    {page.cta.label}
                  </ArrowButton>
                ) : null}
                {page.secondaryCta ? (
                  isTicketCheckoutUrl(page.secondaryCta.href, TICKETS_PAGE_PATH) ? (
                    <TicketArrowButton label={page.secondaryCta.label} variant="ghost" />
                  ) : (
                    <ArrowButton
                      href={page.secondaryCta.href}
                      variant="ghost"
                      {...(page.secondaryCta.external ? { target: "_blank", rel: "noopener" } : {})}
                    >
                      {page.secondaryCta.label}
                    </ArrowButton>
                  )
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </article>
    </InnerPageShell>
  );
}
