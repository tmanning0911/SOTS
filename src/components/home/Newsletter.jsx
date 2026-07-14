import { useState } from "react";
import { MEDIA } from "../../../js/data.js";
import { ArrowButton } from "../ArrowButton.jsx";

export function Newsletter() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === "loading") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    const name = String(data.get("name") || "").trim();
    const bot = String(data.get("bot-field") || "");

    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form: "newsletter",
          fields: {
            email,
            name,
            "bot-field": bot,
          },
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload.error || "Signup failed.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err?.message || "Signup failed. Please try again.");
    }
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
        <span className="orpheum-newsletter-banner__wash" aria-hidden="true" />

        <div className="orpheum-newsletter-banner__shell">
          <div className="orpheum-newsletter-banner__content" data-reveal>
            <div className="orpheum-newsletter-banner__copy">
              <h2 id="newsletter-heading">Never Miss a Beat</h2>
              <p className="orpheum-newsletter-banner__lead">
                Season news, gala updates, and education programs — in your inbox.
              </p>
            </div>

            {status === "success" ? (
              <p className="orpheum-newsletter-banner__success" role="status">
                You’re on the list — check your email for a confirmation.
              </p>
            ) : (
              <form className="orpheum-newsletter-banner__form" onSubmit={handleSubmit} noValidate>
                <div className="orpheum-newsletter-banner__honeypot" aria-hidden="true">
                  <label htmlFor="newsletter-bot-field">Leave blank</label>
                  <input
                    id="newsletter-bot-field"
                    name="bot-field"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="orpheum-newsletter-banner__fields">
                  <label className="visually-hidden" htmlFor="newsletter-email">
                    Email
                  </label>
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Email address"
                    disabled={status === "loading"}
                  />

                  <label className="visually-hidden" htmlFor="newsletter-name">
                    Name (optional)
                  </label>
                  <input
                    id="newsletter-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Name (optional)"
                    disabled={status === "loading"}
                  />

                  <ArrowButton
                    type="submit"
                    disabled={status === "loading"}
                    aria-busy={status === "loading"}
                  >
                    {status === "loading" ? "Signing up…" : "Subscribe"}
                  </ArrowButton>
                </div>

                {status === "error" && error ? (
                  <p className="orpheum-newsletter-banner__error" role="alert">
                    {error}
                  </p>
                ) : null}

                <p className="orpheum-newsletter-banner__consent">
                  Unsubscribe anytime. We never share your email.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
