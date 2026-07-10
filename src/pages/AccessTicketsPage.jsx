import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MEDIA } from "../../js/data.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { OrderLookupPanel } from "../components/ticketing/OrderLookupPanel.jsx";

export function AccessTicketsPage() {
  const [params] = useSearchParams();
  const initialEmail = params.get("email") ?? "";
  const initialCode = (params.get("code") ?? "").toUpperCase();

  useEffect(() => {
    document.title = "Ticket Lookup - Shakespeare on the Sound";
  }, []);

  return (
    <InnerPageShell showVisit showNewsletter>
      <article className="orpheum-inner-page sots-account-page">
        <header className="orpheum-inner-page__hero sots-account-page__hero">
          <div
            className="sots-account-page__hero-bg"
            style={{ backgroundImage: `url('${MEDIA.heroHome}')` }}
            aria-hidden="true"
          />
          <div className="sots-account-page__hero-veil" aria-hidden="true" />
          <div className="orpheum-inner-page__hero-inner sots-account-page__hero-inner" data-reveal>
            <p className="orpheum-inner-page__eyebrow">Confirmation Code</p>
            <h1>Look Up an Order</h1>
            <p className="orpheum-inner-page__intro">
              Enter the email and confirmation code from your purchase to view your tickets and QR codes.
            </p>
            <div className="sots-account-page__hero-actions">
              <ArrowButton href="/my-tickets/">My Tickets</ArrowButton>
              <ArrowButton href="/tickets/" variant="ghost">
                Buy Tickets
              </ArrowButton>
            </div>
          </div>
        </header>

        <div className="orpheum-inner-page__body">
          <div className="orpheum-container orpheum-container--narrow sots-account-page__body" data-reveal>
            <OrderLookupPanel initialEmail={initialEmail} initialCode={initialCode} />
            <p className="sots-checkout__hint">
              Want all your orders in one place? <Link to="/my-tickets/">Sign in to My Tickets</Link>
              {" · "}
              Purchased by phone or in person?{" "}
              <Link to="/about/contact/">Contact the box office</Link>.
            </p>
          </div>
        </div>
      </article>
    </InnerPageShell>
  );
}
