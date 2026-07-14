import { Fragment } from "react";
import { splitTextWithEmails } from "../../js/contact-recipients.js";
import { MailLink } from "./MailLink.jsx";

/** Renders a string with staff email addresses as form-opening MailLinks. */
export function TextWithMailLinks({ text, className }) {
  const parts = splitTextWithEmails(text);
  const content = parts.map((part, index) =>
    part.type === "email" ? (
      <MailLink key={`email-${index}-${part.value}`} email={part.value} />
    ) : (
      <Fragment key={`text-${index}`}>{part.value}</Fragment>
    ),
  );

  if (className) {
    return <span className={className}>{content}</span>;
  }
  return <>{content}</>;
}
