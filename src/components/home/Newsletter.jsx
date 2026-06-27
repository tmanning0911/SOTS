import { useState } from "react";
import { MEDIA } from "../../../js/data.js";
import { ArrowButton } from "../ArrowButton.jsx";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setEmail("");
  }

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

            {done ? (
              <p className="orpheum-newsletter-banner__success" role="status">
                Thanks for signing up!
              </p>
            ) : (
              <form className="orpheum-newsletter-banner__form" onSubmit={handleSubmit} noValidate>
                <div className="orpheum-newsletter-banner__field">
                  <label htmlFor="newsletter-email">Email address</label>
                  <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>
                <ArrowButton type="submit">Sign Up For Our Newsletter</ArrowButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
