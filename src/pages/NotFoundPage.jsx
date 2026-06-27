import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";

export function NotFoundPage() {
  return (
    <InnerPageShell showVisit={false}>
      <article className="orpheum-inner-page orpheum-not-found-page">
        <header className="orpheum-inner-page__hero">
          <div className="orpheum-inner-page__hero-inner" data-reveal>
            <p className="orpheum-inner-page__eyebrow">404</p>
            <h1>Page Not Found.</h1>
            <p className="orpheum-inner-page__intro">
              The page you requested doesn&apos;t exist. Head back to the homepage or explore events and tickets.
            </p>
          </div>
        </header>

        <div className="orpheum-inner-page__body">
          <div className="orpheum-inner-page__content" data-reveal>
            <div className="orpheum-not-found-page__actions">
              <ArrowButton href="/">Back to Home</ArrowButton>
              <ArrowButton href="/productions/much-ado-about-nothing/" variant="ghost">
                View Events
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
