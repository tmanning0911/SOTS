import { MEDIA } from "../../../js/data.js";
import { MailingListSignup } from "../MailingListSignup.jsx";

/** Homepage mailing list band — sits under News & History. */
export function Newsletter() {
  return (
    <section className="orpheum-newsletter-banner" aria-labelledby="newsletter-heading">
      <div className="orpheum-newsletter-banner__stage">
        <img
          className="orpheum-newsletter-banner__bg"
          src={MEDIA.heroBanner}
          alt=""
          loading="lazy"
          width={1200}
          height={675}
        />
        <span className="orpheum-newsletter-banner__wash" aria-hidden="true" />

        <div className="orpheum-newsletter-banner__shell">
          <div className="orpheum-newsletter-banner__content" data-reveal>
            <MailingListSignup
              variant="banner"
              headingId="newsletter-heading"
              heading="Mailing List"
              lead="Never miss a beat — season news, gala updates, and education programs in your inbox."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
