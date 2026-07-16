import { useMemo, useState } from "react";
import {
  formatSponsorCents,
  formatSponsorPrice,
  STANDARD_EVENT_SPONSORS,
} from "../../js/event-sponsorships.js";
import { openPaymentLinkCheckout } from "../../js/payment-link-checkout.js";
import { EventCheckoutPanel } from "./checkout/EventCheckoutPanel.jsx";
import { QtyStepper, useBuyBusy } from "./checkout/QtyStepper.jsx";

function SponsorRow({ item, quantity, onQty }) {
  return (
    <li className={`sots-event-sponsors__offer${quantity > 0 ? " is-selected" : ""}`}>
      <div className="sots-event-sponsors__copy">
        <h4>{item.name}</h4>
        <p>{item.description}</p>
      </div>
      <div className="sots-event-sponsors__action">
        <p className="sots-event-sponsors__price">{formatSponsorPrice(item.price)}</p>
        <QtyStepper
          value={quantity}
          min={0}
          max={4}
          label={`Quantity for ${item.name}`}
          onChange={onQty}
        />
      </div>
    </li>
  );
}

/**
 * Standard sponsor packages for any named event — Square checkout via kind "event-sponsor".
 */
export function EventSponsorSection({
  eventId,
  eventTitle,
  sectionId,
  sponsors = STANDARD_EVENT_SPONSORS,
  returnPath = "/events/?thanks=1",
  heading = "Sponsorships",
  eyebrow = "Partner with us",
  lede = "Standard sponsor packages for this event — recognition and support for Shakespeare on the Sound.",
  compact = false,
}) {
  const [qty, setQty] = useState(() => Object.fromEntries(sponsors.map((s) => [s.id, 0])));
  const [businessName, setBusinessName] = useState("");
  const [note, setNote] = useState("");
  const { busy, error, setError, runBuy } = useBuyBusy();
  const anchorId = sectionId || `${eventId}-sponsorship`;
  const headingId = `${anchorId}-heading`;
  const hasLede = Boolean(String(lede || "").trim());

  const selected = useMemo(
    () =>
      sponsors
        .map((item) => ({ item, quantity: qty[item.id] ?? 0 }))
        .filter((row) => row.quantity > 0),
    [qty, sponsors],
  );
  const totalQty = selected.reduce((sum, row) => sum + row.quantity, 0);
  const totalCents = selected.reduce((sum, row) => sum + row.item.price * 100 * row.quantity, 0);
  const lines = selected.map(({ item, quantity }) => ({
    id: item.id,
    name: item.name,
    quantity,
    priceLabel: formatSponsorPrice(item.price * quantity),
  }));

  function checkout() {
    if (!selected.length) return;
    if (!businessName.trim()) {
      setError("Enter a business or organization name before payment.");
      return;
    }
    runBuy(async () => {
      await openPaymentLinkCheckout({
        kind: "event-sponsor",
        items: selected.map(({ item, quantity }) => ({
          itemId: item.id,
          quantity,
          eventId,
          eventTitle,
        })),
        buyer: {
          businessName: businessName.trim(),
          note: note.trim(),
        },
        returnPath,
      });
    });
  }

  return (
    <section
      className={`sots-event-sponsors${compact ? " sots-event-sponsors--compact" : ""}`}
      id={anchorId}
      aria-labelledby={headingId}
    >
      <p className="orpheum-eyebrow">{eyebrow}</p>
      <h3 id={headingId} className="sots-event-sponsors__title">
        {heading}
      </h3>
      {hasLede ? <p className="sots-event-sponsors__lede">{lede}</p> : null}
      <ul className="sots-event-sponsors__offers">
        {sponsors.map((item) => (
          <SponsorRow
            key={item.id}
            item={item}
            quantity={qty[item.id] ?? 0}
            onQty={(n) => setQty((prev) => ({ ...prev, [item.id]: n }))}
          />
        ))}
      </ul>

      {totalQty > 0 ? (
        <EventCheckoutPanel
          sticky={false}
          lines={lines}
          totalQty={totalQty}
          totalLabel={formatSponsorCents(totalCents)}
          busy={busy}
          error={error}
          requireBusiness
          businessName={businessName}
          onBusinessName={(value) => {
            setBusinessName(value);
            if (error) setError("");
          }}
          note={note}
          onNote={setNote}
          notePlaceholder="How to list your name, contact person, recognition notes…"
          noteHelper="Optional — appears on the payment note for our team."
          checkoutLabel="Continue to payment"
          onCheckout={checkout}
        />
      ) : null}
    </section>
  );
}
