import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  centsToDollarsLabel,
  chargeCentsWithFeesCovered,
  DONATE_CONTACT,
  DONATE_MONTHLY_LINK,
  DONATE_PATH,
  DONATE_SUGGESTED,
  dollarsToCents,
  feeCoverDeltaCents,
} from "../../js/donate.js";
import { openPaymentLinkCheckout } from "../../js/payment-link-checkout.js";
import { InnerPageHero } from "../components/InnerPageHero.jsx";
import { InnerPageShell } from "../components/InnerPageShell.jsx";
import { useBuyBusy } from "../components/checkout/QtyStepper.jsx";

export function DonatePage() {
  const [params] = useSearchParams();
  const thanks = params.get("thanks") === "1";
  const [frequency, setFrequency] = useState("once");
  const [amountDollars, setAmountDollars] = useState("67");
  const [custom, setCustom] = useState("");
  const [coverFees, setCoverFees] = useState(true);
  const { busy, error, runBuy } = useBuyBusy();

  useEffect(() => {
    document.title = "Donate - Shakespeare on the Sound";
  }, []);

  const baseCents = useMemo(() => {
    if (custom.trim()) return dollarsToCents(custom);
    return dollarsToCents(amountDollars);
  }, [amountDollars, custom]);

  const chargeCents = coverFees ? chargeCentsWithFeesCovered(baseCents) : baseCents;
  const feeDelta = coverFees ? feeCoverDeltaCents(baseCents) : 0;
  const canCheckout = baseCents >= 500;

  function selectSuggested(amount) {
    setCustom("");
    setAmountDollars(String(amount));
  }

  function handleCheckout() {
    if (!canCheckout || busy) return;

    if (frequency === "monthly" && DONATE_MONTHLY_LINK) {
      window.location.assign(DONATE_MONTHLY_LINK);
      return;
    }

    runBuy(() =>
      openPaymentLinkCheckout({
        kind: "donate",
        items: [
          {
            amountCents: chargeCents,
            coverFees,
            frequency,
          },
        ],
      }),
    );
  }

  return (
    <InnerPageShell showVisit={false} showNewsletter showSupport={false}>
      <article className="sots-donate-page">
        <InnerPageHero title="Support Our Mission" />

        <nav className="orpheum-page-quick" aria-label="Donate shortcuts">
          <a href="#give" className="orpheum-page-quick__link">
            Give online
          </a>
          <a href="#other-ways" className="orpheum-page-quick__link">
            Stocks &amp; DAFs
          </a>
          <a href={`mailto:${DONATE_CONTACT.email}`} className="orpheum-page-quick__link">
            Email Aaron
          </a>
        </nav>

        {thanks ? (
          <div className="sots-donate-page__thanks" role="status">
            <p>
              Thank you — if you completed payment, check your email for a receipt. Questions about
              stocks, DAFs, or monthly giving? Reach Aaron at{" "}
              <a href={`mailto:${DONATE_CONTACT.email}`}>{DONATE_CONTACT.email}</a>.
            </p>
          </div>
        ) : null}

        <section className="sots-donate-page__give" id="give" aria-labelledby="donate-give-heading">
          <div className="sots-donate-page__give-inner">
            <p className="orpheum-eyebrow">Secure checkout</p>
            <h2 id="donate-give-heading" className="orpheum-underline-heading">
              Give online
            </h2>
            <p className="sots-donate-page__lead">
              Ticket sales alone do not cover the season. It costs about $67 per patron to present
              our summer shows — your gift keeps Shakespeare in Pinkney Park accessible.
            </p>

            <div className="sots-donate-page__freq" role="group" aria-label="Gift frequency">
              <button
                type="button"
                className={`sots-donate-page__freq-btn${frequency === "once" ? " is-active" : ""}`}
                aria-pressed={frequency === "once"}
                onClick={() => setFrequency("once")}
              >
                One-time
              </button>
              <button
                type="button"
                className={`sots-donate-page__freq-btn${frequency === "monthly" ? " is-active" : ""}`}
                aria-pressed={frequency === "monthly"}
                onClick={() => setFrequency("monthly")}
              >
                Monthly
              </button>
            </div>

            <div className="sots-donate-page__amounts" role="group" aria-label="Suggested amounts">
              {DONATE_SUGGESTED.map((tier) => {
                const selected = !custom && Number(amountDollars) === tier.amount;
                return (
                  <button
                    key={tier.amount}
                    type="button"
                    className={`sots-donate-page__amount${selected ? " is-active" : ""}`}
                    aria-pressed={selected}
                    onClick={() => selectSuggested(tier.amount)}
                  >
                    <strong>{tier.label}</strong>
                    <span>{tier.hint}</span>
                  </button>
                );
              })}
            </div>

            <label className="sots-donate-page__custom">
              Other amount
              <input
                type="number"
                inputMode="decimal"
                min="5"
                step="1"
                placeholder="Enter amount"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
              />
            </label>

            <label className="sots-donate-page__fees">
              <input
                type="checkbox"
                checked={coverFees}
                onChange={(e) => setCoverFees(e.target.checked)}
              />
              <span>
                Cover processing fees
                {feeDelta > 0 ? (
                  <>
                    {" "}
                    (+{centsToDollarsLabel(feeDelta)}) so Shakespeare on the Sound receives about{" "}
                    {centsToDollarsLabel(baseCents)}
                  </>
                ) : (
                  <> so your full gift reaches the mission</>
                )}
              </span>
            </label>

            {frequency === "monthly" && !DONATE_MONTHLY_LINK ? (
              <p className="sots-donate-page__monthly-note">
                Monthly checkout confirms your gift amount today. To set up automatic monthly billing
                in Square, email{" "}
                <a href={`mailto:${DONATE_CONTACT.email}?subject=Monthly%20giving`}>
                  {DONATE_CONTACT.email}
                </a>{" "}
                after you give (or ask us to send a recurring donation link).
              </p>
            ) : null}

            {frequency === "monthly" && DONATE_MONTHLY_LINK ? (
              <p className="sots-donate-page__monthly-note">
                Continues to Square’s recurring donation form — you can confirm the monthly amount
                there.
              </p>
            ) : null}

            <div className="sots-donate-page__checkout">
              <p className="sots-donate-page__total">
                <span>{frequency === "monthly" ? "Monthly gift" : "Your gift"}</span>
                <strong>{canCheckout ? centsToDollarsLabel(chargeCents) : "—"}</strong>
              </p>
              <button
                type="button"
                className="orpheum-arrow-btn orpheum-arrow-btn--gold sots-donate-page__pay"
                disabled={!canCheckout || busy}
                onClick={handleCheckout}
              >
                <span className="orpheum-arrow-btn__label">
                  {busy ? "Starting…" : frequency === "monthly" ? "Continue monthly gift" : "Donate now"}
                </span>
                <span className="orpheum-arrow-btn__icon" aria-hidden="true">
                  →
                </span>
              </button>
              {error ? (
                <p className="sots-donate-page__error" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section
          className="sots-donate-page__other"
          id="other-ways"
          aria-labelledby="donate-other-heading"
        >
          <div className="sots-donate-page__other-inner">
            <p className="orpheum-eyebrow">Other ways to give</p>
            <h2 id="donate-other-heading" className="orpheum-underline-heading">
              Stocks, DAFs &amp; more
            </h2>
            <ul className="sots-donate-page__other-list">
              <li>
                <strong>Gifts of stock or securities</strong>
                <p>Appreciated shares can support the season. Aaron will send brokerage instructions.</p>
                <a
                  className="sots-shop-text-link"
                  href={`mailto:${DONATE_CONTACT.email}?subject=Gift%20of%20stock%20or%20securities`}
                >
                  Email Aaron Simms
                </a>
              </li>
              <li>
                <strong>Donor-advised funds (DAFs)</strong>
                <p>
                  Recommend a grant to Shakespeare on the Sound, Inc. (EIN 06-1437037). Questions
                  welcome.
                </p>
                <a
                  className="sots-shop-text-link"
                  href={`mailto:${DONATE_CONTACT.email}?subject=Donor-advised%20fund%20gift`}
                >
                  Email Aaron Simms
                </a>
              </li>
              <li>
                <strong>By check</strong>
                <p>Mail to Shakespeare on the Sound, Inc., P.O. Box 15, Norwalk, CT 06853.</p>
              </li>
              <li>
                <strong>IRA / QCD, matching gifts &amp; wire</strong>
                <p>Aaron can help with plan paperwork and acknowledgment letters.</p>
                <a
                  className="sots-shop-text-link"
                  href={`mailto:${DONATE_CONTACT.email}?subject=Other%20ways%20to%20give`}
                >
                  Email Aaron Simms
                </a>
              </li>
            </ul>

            <dl className="sots-donate-page__charity">
              <div>
                <dt>Legal name</dt>
                <dd>Shakespeare on the Sound, Inc.</dd>
              </div>
              <div>
                <dt>Tax ID (EIN)</dt>
                <dd>06-1437037</dd>
              </div>
              <div>
                <dt>Contact</dt>
                <dd>
                  {DONATE_CONTACT.name} ·{" "}
                  <a href={`mailto:${DONATE_CONTACT.email}`}>{DONATE_CONTACT.email}</a> ·{" "}
                  <a href={DONATE_CONTACT.phoneHref}>{DONATE_CONTACT.phone}</a>
                </dd>
              </div>
            </dl>

            <p className="sots-donate-page__foot">
              <Link to="/support/individual-giving/">Leadership giving levels</Link>
              {" · "}
              <Link to="/support/program-ads-sponsorships/">Sponsorships</Link>
              {" · "}
              <Link to={DONATE_PATH}>Back to top</Link>
            </p>
          </div>
        </section>
      </article>
    </InnerPageShell>
  );
}
