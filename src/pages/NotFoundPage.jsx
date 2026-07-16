import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";

export function NotFoundPage() {
  usePageMeta({ path: "/404/", noindex: true });

  return (
    <InnerPageShell showVisit={false} showNewsletter={false}>
      <article className="orpheum-inner-page orpheum-not-found-page">
        <InnerPageHero title="Page Not Found" />

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
