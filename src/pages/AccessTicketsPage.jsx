import { Link, useSearchParams } from "react-router-dom";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { OrderLookupPanel } from "../components/ticketing/OrderLookupPanel.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";

export function AccessTicketsPage() {
  const [params] = useSearchParams();
  const initialEmail = params.get("email") ?? "";
  const initialCode = (params.get("code") ?? "").toUpperCase();

  usePageMeta("/access-your-tickets/");

  return (
    <InnerPageShell showVisit={false} showNewsletter={false}>
      <article className="orpheum-inner-page sots-account-page">
        <InnerPageHero title="Ticket Lookup" />

        <div className="orpheum-inner-page__body">
          <div className="orpheum-container orpheum-container--narrow sots-account-page__body" data-reveal>
            <p className="sots-account-page__lede">
              Look up a single order with the email and confirmation code from your purchase
              receipt. Online ticket orders include a confirmation code in the email we send after
              checkout.
            </p>
            <OrderLookupPanel initialEmail={initialEmail} initialCode={initialCode} />
            <p className="sots-checkout__hint">
              Want all your shows in one place? <Link to="/my-tickets/">Open My Tickets</Link>
              {" · "}
              Need help? <Link to="/about/contact/">Contact us</Link>.
            </p>
          </div>
        </div>
      </article>
    </InnerPageShell>
  );
}
