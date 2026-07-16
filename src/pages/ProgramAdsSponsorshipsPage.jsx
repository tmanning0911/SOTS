import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  formatProgramAdsPrice,
  PROGRAM_ADS,
  PROGRAM_ADS_CONTACT,
  PROGRAM_ADS_PATH,
} from "../../js/program-ads-sponsorships.js";
import { openPaymentLinkCheckout } from "../../js/payment-link-checkout.js";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";

function PayButton({ itemId, busyItemId, onPay }) {
  const busy = busyItemId === itemId;
  const disabled = Boolean(busyItemId);
  return (
    <button
      type="button"
      className="orpheum-arrow-btn orpheum-arrow-btn--compact"
      disabled={disabled}
      aria-busy={busy}
      onClick={() => onPay(itemId)}
    >
      <span className="orpheum-arrow-btn__label">{busy ? "Opening…" : "Pay now"}</span>
      <span className="orpheum-arrow-btn__icon" aria-hidden="true">
        →
      </span>
    </button>
  );
}

export function ProgramAdsSponsorshipsPage() {
  const [params] = useSearchParams();
  const thanks = params.get("thanks") === "1";
  const [busyItemId, setBusyItemId] = useState(null);
  const [error, setError] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [note, setNote] = useState("");
  const page = PROGRAM_ADS;

  usePageMeta(PROGRAM_ADS_PATH);

  async function pay(itemId) {
    if (busyItemId) return;
    const biz = businessName.trim();
    if (!biz) {
      setError("Enter your business or organization name before paying.");
      document.getElementById("checkout-details")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setError("");
    setBusyItemId(itemId);
    try {
      await openPaymentLinkCheckout({
        kind: "sponsorship",
        items: [{ itemId, quantity: 1, businessName: biz }],
        buyer: {
          businessName: biz,
          contactName: contactName.trim(),
          note: note.trim(),
        },
      });
    } catch (err) {
      setError(err.message || "Could not start checkout");
      setBusyItemId(null);
    }
  }

  return (
    <InnerPageShell showVisit={false} showNewsletter showSupport={false}>
      <article className="sots-program-ads">
        <InnerPageHero title={page.heading.replace(/\.$/, "")} compact />

        <nav className="orpheum-page-quick" aria-label="Page shortcuts">
          <a href="#checkout-details" className="orpheum-page-quick__link">
            Your details
          </a>
          <a href="#ads" className="orpheum-page-quick__link">
            Ad rates
          </a>
          <a href="#sponsorships" className="orpheum-page-quick__link">
            Sponsorships
          </a>
          <a href={PROGRAM_ADS_CONTACT.mailto} className="orpheum-page-quick__link">
            Contact Marketing
          </a>
        </nav>

        {thanks ? (
          <div className="sots-program-ads__thanks" role="status">
            <p>
              Thank you — if you completed payment, check your email for a receipt. Send your logo or
              ad artwork to{" "}
              <a href={PROGRAM_ADS_CONTACT.mailto}>{PROGRAM_ADS_CONTACT.email}</a> so we can place
              your placement.
            </p>
          </div>
        ) : null}

        {error ? (
          <p className="sots-program-ads__error" role="alert">
            {error}
          </p>
        ) : null}

        <section className="sots-program-ads__section" aria-labelledby="program-ads-about">
          <div className="sots-program-ads__inner">
            <p className="orpheum-eyebrow">{page.eyebrow}</p>
            <h2 id="program-ads-about" className="orpheum-underline-heading">
              Program advertisement
            </h2>
            <p className="sots-program-ads__lede">{page.intro}</p>
            <ul className="sots-program-ads__bullets">
              {page.seasonNote.map((line) => (
                <li key={line}>{line}</li>
              ))}
              <li>
                Contact {PROGRAM_ADS_CONTACT.name}:{" "}
                <a href={PROGRAM_ADS_CONTACT.mailto}>{PROGRAM_ADS_CONTACT.email}</a>
              </li>
            </ul>
            <p className="sots-program-ads__note">
              Fill in your business details below, pay for a fixed rate or package, then email artwork
              or logo files to Marketing. Questions or custom packages? Reach out first — then pay
              when you&apos;re ready.
            </p>
          </div>
        </section>

        <section
          className="sots-program-ads__section sots-program-ads__section--band"
          id="checkout-details"
          aria-labelledby="checkout-details-heading"
        >
          <div className="sots-program-ads__inner">
            <h2 id="checkout-details-heading" className="orpheum-underline-heading">
              Your details
            </h2>
            <p className="sots-program-ads__lede">
              Required before Pay now — this shows up with your Square payment so Marketing can match
              your order.
            </p>
            <div className="sots-program-ads__buyer">
              <label className="sots-program-ads__field">
                <span>
                  Business / organization name <em>*</em>
                </span>
                <input
                  type="text"
                  name="businessName"
                  autoComplete="organization"
                  required
                  maxLength={100}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Acme Partners LLC"
                />
              </label>
              <label className="sots-program-ads__field">
                <span>Contact name</span>
                <input
                  type="text"
                  name="contactName"
                  autoComplete="name"
                  maxLength={100}
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Alex Rivera"
                />
              </label>
              <label className="sots-program-ads__field sots-program-ads__field--full">
                <span>Note for Marketing</span>
                <textarea
                  name="note"
                  rows={3}
                  maxLength={400}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Billing contact, preferred ad placement, how to list your name in the playbill…"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="sots-program-ads__section" id="ads" aria-labelledby="ad-rates-heading">
          <div className="sots-program-ads__inner">
            <h2 id="ad-rates-heading" className="orpheum-underline-heading">
              Ad rates
            </h2>
            <ul className="sots-program-ads__list">
              {page.ads.map((ad) => (
                <li key={ad.id} className="sots-program-ads__row">
                  <div className="sots-program-ads__copy">
                    <strong>{ad.name}</strong>
                    <span>
                      {formatProgramAdsPrice(ad.price)} — {ad.size}
                    </span>
                  </div>
                  <PayButton itemId={ad.id} busyItemId={busyItemId} onPay={pay} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="sots-program-ads__section sots-program-ads__section--band"
          id="sponsorships"
          aria-labelledby="sponsorships-heading"
        >
          <div className="sots-program-ads__inner">
            <h2 id="sponsorships-heading" className="orpheum-underline-heading">
              Sponsorship levels
            </h2>
            <ul className="sots-program-ads__tiers">
              {page.sponsorships.map((tier) => (
                <li key={tier.id} className="sots-program-ads__tier">
                  <div className="sots-program-ads__tier-head">
                    <div>
                      <h3>{tier.name}</h3>
                      <p className="sots-program-ads__price">{formatProgramAdsPrice(tier.price)}</p>
                    </div>
                    <PayButton itemId={tier.id} busyItemId={busyItemId} onPay={pay} />
                  </div>
                  <ul>
                    {tier.benefits.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            <p className="sots-program-ads__contact">
              Need a custom package?{" "}
              <a href={PROGRAM_ADS_CONTACT.mailto}>Contact Marketing</a>
            </p>
          </div>
        </section>
      </article>
    </InnerPageShell>
  );
}
