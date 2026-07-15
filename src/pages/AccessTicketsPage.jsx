import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
        <InnerPageHero title="Ticket Lookup" />

        <div className="orpheum-inner-page__body">
          <div className="orpheum-container orpheum-container--narrow sots-account-page__body" data-reveal>
            <OrderLookupPanel initialEmail={initialEmail} initialCode={initialCode} />
            <p className="sots-checkout__hint">
              Want all your shows in one place? <Link to="/my-tickets/">Open My Tickets</Link>
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
