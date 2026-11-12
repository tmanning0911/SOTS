import { HOME_NEWSLETTER } from "../../../js/data.js";

/**
 * Collage newsletter band: headline + copy + “SIGN UP HERE” button.
 * Scrolls to the footer mailing list — same functional outcome as Collage’s signup CTA.
 */
export function Newsletter() {
  function handleSignUp(e) {
    e.preventDefault();
    const target =
      document.querySelector(".orpheum-footer__mailing") ||
      document.querySelector(".sots-mailing-list");
    if (!target) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    const input = target.querySelector('input[type="email"]');
    window.setTimeout(() => input?.focus?.(), reduceMotion ? 0 : 350);
  }

  return (
    <section className="cdc-newsletter" id="newsletter" aria-labelledby="cdc-newsletter-heading">
      <div className="cdc-newsletter__inner">
        <h2 id="cdc-newsletter-heading" className="cdc-newsletter__title">
          {HOME_NEWSLETTER.title}
        </h2>
        <div className="cdc-newsletter__aside">
          <p className="cdc-newsletter__body">{HOME_NEWSLETTER.body}</p>
          <button type="button" className="cdc-btn cdc-btn--navy" onClick={handleSignUp}>
            {HOME_NEWSLETTER.ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
