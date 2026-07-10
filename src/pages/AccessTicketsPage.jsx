import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { OrderLookupPanel } from "../components/ticketing/OrderLookupPanel.jsx";

export function AccessTicketsPage() {
  const [params] = useSearchParams();
  const initialEmail = params.get("email") ?? "";
  const initialCode = (params.get("code") ?? "").toUpperCase();

  useEffect(() => {
    document.title = "Access Your Tickets - Shakespeare on the Sound";
  }, []);

  return (
    <main className="orpheum-page orpheum-page--inner">
      <div className="orpheum-container orpheum-container--narrow">
        <p className="orpheum-kicker">Tickets</p>
        <h1>Access Your Tickets</h1>
        <OrderLookupPanel initialEmail={initialEmail} initialCode={initialCode} />
        <p className="sots-checkout__hint">
          <Link to="/my-tickets/">My Tickets</Link>
          {" · "}
          <Link to="/tickets/">Buy tickets</Link>
          {" · "}
          Purchased by phone or in person?{" "}
          <Link to="/about/contact/">Contact the box office</Link>.
        </p>
      </div>
    </main>
  );
}
