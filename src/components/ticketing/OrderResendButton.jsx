import { useState } from "react";
import { resendOrderEmail } from "../../../js/square-payments.js";
import { ArrowButton } from "../ArrowButton.jsx";

/**
 * Shared resend confirmation email control for My Tickets and order lookup.
 */
export function OrderResendButton({ email, confirmationCode, variant = "ghost", label = "Resend email" }) {
  const [resendState, setResendState] = useState("idle");
  const [resendError, setResendError] = useState("");

  async function handleResend() {
    setResendState("loading");
    setResendError("");
    try {
      await resendOrderEmail(email, confirmationCode);
      setResendState("sent");
    } catch (err) {
      setResendError(err.message || "Could not resend email");
      setResendState("idle");
    }
  }

  return (
    <div className="sots-order-resend">
      <ArrowButton
        type="button"
        variant={variant}
        onClick={handleResend}
        disabled={resendState === "loading" || resendState === "sent"}
      >
        {resendState === "loading" ? "Sending…" : resendState === "sent" ? "Email sent" : label}
      </ArrowButton>
      {resendError ? (
        <p className="sots-checkout__error" role="alert">
          {resendError}
        </p>
      ) : null}
      {resendState === "sent" ? (
        <p className="sots-checkout__hint">Check your inbox for your confirmation.</p>
      ) : null}
    </div>
  );
}
