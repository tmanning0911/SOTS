import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { heroImageForHref } from "../../js/page-heroes.js";
import { ArrowButton } from "../components/ArrowButton.jsx";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
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
    <InnerPageShell showVisit={false} showNewsletter={false}>
      <article className="orpheum-inner-page sots-account-page">
        <InnerPageHero
          className="sots-account-page__hero"
          eyebrow="Confirmation Code"
          title="Look Up an Order"
          intro="Enter the email and confirmation code from your purchase to view your tickets and QR codes."
          image={heroImageForHref("/access-your-tickets/")}
          actions={
            <>
              <ArrowButton href="/my-tickets/">My Tickets</ArrowButton>
              <ArrowButton href="/tickets/" variant="ghost">
                Buy Tickets
              </ArrowButton>
            </>
          }
        />

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
