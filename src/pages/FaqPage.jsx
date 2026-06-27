import { useState } from "react";
import { FAQ_SECTIONS, INNER_PAGES } from "../../js/pages-data.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";

export function FaqPage() {
  const page = INNER_PAGES.find((p) => p.faq);
  const [openKey, setOpenKey] = useState(null);

  return (
    <InnerPageShell showSupport={false}>
      <article className="orpheum-inner-page orpheum-faq-page">
        <header className="orpheum-inner-page__hero">
          <div className="orpheum-inner-page__hero-inner" data-reveal>
            {page?.eyebrow ? <p className="orpheum-inner-page__eyebrow">{page.eyebrow}</p> : null}
            <h1>{page?.heading ?? "FAQ."}</h1>
            {page?.intro ? <p className="orpheum-inner-page__intro">{page.intro}</p> : null}
          </div>
        </header>

        <div className="orpheum-inner-page__body">
          <div className="orpheum-inner-page__content orpheum-faq-page__content" data-reveal>
            {FAQ_SECTIONS.map((section) => (
              <section key={section.category} className="orpheum-faq-page__category">
                <h2 className="orpheum-inner-page__section-title">{section.category}.</h2>
                <div className="orpheum-faq-page__list">
                  {section.items.map((item) => {
                    const key = `${section.category}-${item.q}`;
                    const open = openKey === key;
                    return (
                      <div key={key} className={`orpheum-faq-item${open ? " is-open" : ""}`}>
                        <button
                          type="button"
                          className="orpheum-faq-item__trigger"
                          aria-expanded={open}
                          onClick={() => setOpenKey(open ? null : key)}
                        >
                          {item.q}
                        </button>
                        <div className="orpheum-faq-item__panel" hidden={!open}>
                          <p>{item.a}</p>
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
