import { resolveContactRecipient } from "../../js/contact-recipients.js";
import { useUI } from "../context/UIContext.jsx";

/**
 * Looks like an email (or labeled contact), but opens the contact form
 * so the message is emailed to staff instead of launching mailto.
 */
export function MailLink({ email, children, className = "", ...rest }) {
  const { openContactForm } = useUI();
  const recipient = resolveContactRecipient(email);

  return (
    <button
      type="button"
      className={`sots-mail-link ${className}`.trim()}
      onClick={() =>
        openContactForm({
          to: recipient.email,
          toLabel: recipient.label,
          form: recipient.form,
          requested: recipient.requested || null,
        })
      }
      {...rest}
    >
      {children ?? email}
    </button>
  );
}
