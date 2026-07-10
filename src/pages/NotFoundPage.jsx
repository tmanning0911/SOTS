import { useEffect } from "react";
import { heroImageForHref } from "../../js/page-heroes.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";

export function NotFoundPage() {
  useEffect(() => {
    document.title = "Page Not Found - Shakespeare on the Sound";
  }, []);

  return (
    <InnerPageShell showVisit={false} showNewsletter={false}>
      <article className="orpheum-inner-page orpheum-not-found-page">
        <InnerPageHero
          eyebrow="404"
          title="Page Not Found."
          intro="The page you requested doesn't exist. Head back to the homepage or explore events and tickets."
          image={heroImageForHref("/about/")}
        />

        <div className="orpheum-inner-page__body">
          <div className="orpheum-inner-page__content" data-reveal>
            <div className="orpheum-not-found-page__actions orpheum-inner-page__cta">
              <ArrowButton href="/">Back to Home</ArrowButton>
              <ArrowButton href="/tickets/" variant="ghost">
                Get Tickets
              </ArrowButton>
              <ArrowButton href="/about/contact/" variant="ghost">
                Contact Us
              </ArrowButton>
            </div>
          </div>
        </div>
      </article>
    </InnerPageShell>
  );
}
