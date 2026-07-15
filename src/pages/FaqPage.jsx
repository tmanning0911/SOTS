import { useState } from "react";
import { FAQ_SECTIONS, INNER_PAGES } from "../../js/pages-data.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { TextWithMailLinks } from "../components/TextWithMailLinks.jsx";

function faqSlug(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function FaqPage() {
  const page = INNER_PAGES.find((p) => p.faq);
  const [openKey, setOpenKey] = useState(null);

  return (
    <InnerPageShell showSupport={false}>
      <article className="orpheum-inner-page orpheum-faq-page">
        <InnerPageHero title={page?.heading?.replace(/\.$/, "") || "FAQ"} />

        <div className="orpheum-inner-page__body">
          <div className="orpheum-inner-page__content orpheum-faq-page__content" data-reveal>
            {FAQ_SECTIONS.map((section) => (
              <section key={section.category} className="orpheum-faq-page__category">
                <h2 className="orpheum-underline-heading">{section.category}</h2>
                <div className="orpheum-faq-page__list">
                  {section.items.map((item) => {
                    const key = `${section.category}-${item.q}`;
                    const open = openKey === key;
                    const triggerId = `faq-trigger-${faqSlug(key)}`;
                    const panelId = `faq-panel-${faqSlug(key)}`;
                    return (
                      <div key={key} className={`orpheum-faq-item${open ? " is-open" : ""}`}>
                        <h3 className="orpheum-faq-item__heading">
                          <button
                            type="button"
                            id={triggerId}
                            className="orpheum-faq-item__trigger"
                            aria-expanded={open}
                            aria-controls={panelId}
                            onClick={() => setOpenKey(open ? null : key)}
                          >
                            {item.q}
                          </button>
                        </h3>
                        <div
                          id={panelId}
                          role="region"
                          aria-labelledby={triggerId}
                          className="orpheum-faq-item__panel"
                          hidden={!open}
                        >
                          <p>
                            <TextWithMailLinks text={item.a} />
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}

            <div className="orpheum-inner-page__cta">
              <ArrowButton href="/about/visit/">Plan Your Visit</ArrowButton>
              <ArrowButton href="/about/cancellation-policy/" variant="ghost">
                Cancellation Policy
              </ArrowButton>
            </div>
          </div>
        </div>
      </article>
    </InnerPageShell>
  );
}
