import { extractMailtoAddress, resolveContactRecipient } from "../../js/contact-recipients.js";
import { useUI } from "../context/UIContext.jsx";
import { ArrowButton } from "./ArrowButton.jsx";

/** CTA that opens the contact form when href is mailto: (or an email target is given). */
export function ContactCtaButton({ href, email, children, variant = "gold", className = "" }) {
  const { openContactForm } = useUI();
  const address = email || extractMailtoAddress(href) || href;
  const recipient = resolveContactRecipient(address);

  return (
    <ArrowButton
      type="button"
      variant={variant}
      className={className}
      onClick={() =>
        openContactForm({
          to: recipient.email,
          toLabel: recipient.label,
          form: recipient.form,
          requested: recipient.requested || null,
        })
      }
    >
      {children}
    </ArrowButton>
  );
}
