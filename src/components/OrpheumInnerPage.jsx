import { heroImageForHref } from "../../js/page-heroes.js";
import { isContactMailto } from "../../js/contact-recipients.js";
import { isTicketCheckoutUrl, TICKETS_PAGE_PATH } from "../../js/ticketing.js";
import { ArrowButton } from "./ArrowButton.jsx";
import { ContactCtaButton } from "./ContactCtaButton.jsx";
import { InnerPageHero } from "./InnerPageHero.jsx";
import { InnerPageShell } from "./InnerPageShell.jsx";
import { PageSection } from "./PageSection.jsx";
import { TicketArrowButton } from "./ticketing/TicketArrowButton.jsx";

function PageCta({ cta, variant = "gold" }) {
  if (!cta) return null;

  if (isContactMailto(cta.href)) {
    return (
      <ContactCtaButton href={cta.href} variant={variant}>
        {cta.label}
      </ContactCtaButton>
    );
  }

  if (isTicketCheckoutUrl(cta.href, TICKETS_PAGE_PATH) && variant !== "gold") {
    return <TicketArrowButton label={cta.label} variant="ghost" />;
  }

  return (
    <ArrowButton
      href={cta.href}
      variant={variant}
      flat={variant === "ghost"}
      {...(cta.external ? { target: "_blank", rel: "noopener" } : {})}
    >
      {cta.label}
    </ArrowButton>
  );
}

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
                <PageCta cta={page.cta} />
                <PageCta cta={page.secondaryCta} variant="ghost" />
              </div>
            ) : null}
          </div>
        </div>
      </article>
    </InnerPageShell>
  );
}
