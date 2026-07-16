import { isContactMailto } from "../../js/contact-recipients.js";
import { isTicketCheckoutUrl, TICKETS_PAGE_PATH } from "../../js/ticketing.js";
import { useUI } from "../context/UIContext.jsx";
import { ArrowButton } from "./ArrowButton.jsx";
import { ContactCtaButton } from "./ContactCtaButton.jsx";
import { InnerPageHero } from "./InnerPageHero.jsx";
import { InnerPageShell } from "./InnerPageShell.jsx";
import { PageSection } from "./PageSection.jsx";
import { TicketArrowButton } from "./ticketing/TicketArrowButton.jsx";

function PageCta({ cta, variant = "gold" }) {
  const { openBoardApplication } = useUI();
  if (!cta) return null;

  if (cta.action === "board-apply") {
    return (
      <ArrowButton type="button" variant={variant} flat={variant === "ghost"} onClick={openBoardApplication}>
        {cta.label}
      </ArrowButton>
    );
  }

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

  const isDonate = page.href === "/support/donate/" || page.href === "/support/individual-giving/";
  const isApprentice = page.href === "/education/apprentice-application/";

  return (
    <InnerPageShell
      showVisit={page.showVisit !== false}
      showSupport={Boolean(page.showSupport)}
      showNewsletter={page.showNewsletter !== false}
    >
      <article
        className={`orpheum-inner-page${isDonate ? " orpheum-inner-page--support" : ""}${
          isApprentice ? " orpheum-inner-page--apprentice" : ""
        }`}
      >
        <InnerPageHero
          title={String(page.heading || page.title || "").replace(/\.$/, "")}
          eyebrow={page.eyebrow}
        />

        {isDonate ? (
          <aside className="orpheum-support-band" aria-label="Support Shakespeare on the Sound">
            <div className="orpheum-support-band__inner">
              <p className="orpheum-eyebrow orpheum-eyebrow--light">Your gift matters</p>
              <h2 className="orpheum-underline-heading orpheum-underline-heading--light">
                Help keep Shakespeare in the park accessible
              </h2>
              <p>
                Contributions power productions, education programs, and free and low-cost seating for
                neighbors across Fairfield County.
              </p>
              {page.cta ? (
                <div className="orpheum-support-band__actions">
                  <PageCta cta={page.cta} />
                </div>
              ) : null}
            </div>
          </aside>
        ) : null}

        <div className="orpheum-inner-page__body">
          <div className="orpheum-inner-page__content" data-reveal>
            {page.intro ? <p className="orpheum-inner-page__intro">{page.intro}</p> : null}
            {isApprentice ? (
              <nav className="orpheum-page-quick sots-apprentice-jump" aria-label="Apprentice page shortcuts">
                <a href="#apprenticeships" className="orpheum-page-quick__link">
                  Tracks
                </a>
                <a href="#additional-materials" className="orpheum-page-quick__link">
                  Supplemental materials
                </a>
                <a href="#apply" className="orpheum-page-quick__link">
                  Apply
                </a>
              </nav>
            ) : null}
            {sections.map((section, index) => (
              <PageSection
                key={`${section.heading ?? "section"}-${index}`}
                section={section}
                band={index % 2 === 1 && section.type !== "apprentice-form"}
              />
            ))}

            {page.cta || page.secondaryCta ? (
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
