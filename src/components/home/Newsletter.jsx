import { MEDIA } from "../../../js/data.js";
import { ArrowButton } from "../ArrowButton.jsx";

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
        <span className="orpheum-newsletter-banner__gradient" aria-hidden="true" />

        <div className="orpheum-newsletter-banner__shell">
          <div className="orpheum-newsletter-banner__frame" aria-hidden="true" />

          <div className="orpheum-newsletter-banner__content" data-reveal>
            <h2 id="newsletter-heading">Never Miss a Beat</h2>
            <p className="orpheum-newsletter-banner__lead">
              Get season announcements, presale reminders, and education news. Email us to join the
              list while we finalize online signup.
            </p>
            <ArrowButton href="mailto:contactus@shakespeareonthesound.org?subject=Newsletter%20signup">
              Email to subscribe
            </ArrowButton>
          </div>
        </div>
      </div>
    </section>
  );
}
