import { useId, useState } from "react";
import { submitMailingListSignup } from "../../js/mailing-list.js";
import { ArrowButton } from "./ArrowButton.jsx";

/**
 * @param {"banner" | "footer"} variant
 */
export function MailingListSignup({
  variant = "banner",
  heading = "Mailing List",
  lead = "Season news, gala updates, and education programs — straight to your inbox.",
  headingId,
}) {
  const uid = useId();
  const titleId = headingId || `mailing-list-${uid}`;
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
      await submitMailingListSignup({ email, name, botField: bot });
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err?.message || "Signup failed. Please try again.");
    }
  }

  const rootClass =
    variant === "footer" ? "sots-mailing-list sots-mailing-list--footer" : "sots-mailing-list sots-mailing-list--inline";

  return (
    <div className={rootClass}>
      <div className="sots-mailing-list__copy">
        <h2 id={titleId} className="sots-mailing-list__heading">
          {heading}
        </h2>
        {lead ? <p className="sots-mailing-list__lead">{lead}</p> : null}
      </div>

      {status === "success" ? (
        <p className="sots-mailing-list__success" role="status">
          You’re on the list — check your email for a confirmation.
        </p>
      ) : (
        <form className="sots-mailing-list__form" onSubmit={handleSubmit} noValidate aria-labelledby={titleId}>
          <div className="sots-mailing-list__honeypot" aria-hidden="true">
            <label htmlFor={`${uid}-bot`}>Leave blank</label>
            <input id={`${uid}-bot`} name="bot-field" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="sots-mailing-list__fields">
            <label className="visually-hidden" htmlFor={`${uid}-email`}>
              Email
            </label>
            <input
              id={`${uid}-email`}
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Email address"
              disabled={status === "loading"}
            />

            {variant !== "footer" ? (
              <>
                <label className="visually-hidden" htmlFor={`${uid}-name`}>
                  Name (optional)
                </label>
                <input
                  id={`${uid}-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Name (optional)"
                  disabled={status === "loading"}
                />
              </>
            ) : null}

            <ArrowButton
              type="submit"
              disabled={status === "loading"}
              aria-busy={status === "loading"}
              variant={variant === "footer" ? "gold" : undefined}
            >
              {status === "loading" ? "Signing up…" : "Join"}
            </ArrowButton>
          </div>

          {status === "error" && error ? (
            <p className="sots-mailing-list__error" role="alert">
              {error}
            </p>
          ) : null}

          <p className="sots-mailing-list__consent">Unsubscribe anytime. We never share your email.</p>
        </form>
      )}
    </div>
  );
}
