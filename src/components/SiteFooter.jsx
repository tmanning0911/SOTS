import {
  SITE,
  FOOTER_MAIN,
  FOOTER_UTILITY,
  SOCIAL_LINKS,
} from "../../js/data.js";
import { isTicketCheckoutUrl } from "../../js/ticketing.js";
import { SocialIcon } from "./SocialIcon.jsx";
import { MailLink } from "./MailLink.jsx";
import { MailingListSignup } from "./MailingListSignup.jsx";
import { TicketCheckoutLink } from "./ticketing/TicketCheckoutLink.jsx";

const FOOTER_SOCIAL = SOCIAL_LINKS.filter((social) => social.platform !== "x");

function FooterLink({ link }) {
  if (isTicketCheckoutUrl(link.href, SITE.ticketsUrl)) {
    return (
      <TicketCheckoutLink href={link.href} className="sots-ticket-checkout-link">
        {link.label}
      </TicketCheckoutLink>
    );
  }

  const external = link.external || link.href?.startsWith("http");
  return (
    <a href={link.href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {link.label}
    </a>
  );
}

/** Collage-style multi-column footer: brand/contact + IA columns + mailing */
export function SiteFooter() {
  const phoneHref = `tel:${SITE.boxOffice.replace(/[^\d+]/g, "")}`;
  const year = new Date().getFullYear();

  return (
    <footer className="orpheum-footer cdc-footer">
      <div className="orpheum-footer__shell cdc-footer__shell">
        <div className="cdc-footer__top">
          <div className="cdc-footer__brand">
            <a href="/" className="cdc-footer__logo" aria-label={`${SITE.name} Home`}>
              <span className="cdc-brand cdc-brand--footer" aria-hidden="true">
                <span className="cdc-brand__primary">Shakespeare</span>
                <span className="cdc-brand__secondary">on the Sound</span>
              </span>
            </a>
            <address className="cdc-footer__contact">
              <span>{SITE.address}</span>
              <MailLink email={SITE.email}>{SITE.email}</MailLink>
              <a href={phoneHref}>Call us: {SITE.boxOffice}</a>
            </address>
            <nav className="cdc-footer__social" aria-label="Social media">
              {FOOTER_SOCIAL.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label} (opens in a new window)`}
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </nav>
          </div>

          <nav className="cdc-footer__nav" aria-label="Footer">
            {FOOTER_MAIN.columns.map((column) => (
              <div key={column.title} className="cdc-footer__col">
                <h2 className="cdc-footer__heading">{column.title}</h2>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="orpheum-footer__mailing cdc-footer__mailing" data-reveal>
          <MailingListSignup
            variant="footer"
            heading="Contact Us"
            lead="Season announcements and education news, delivered to your inbox."
          />
        </div>

        <div className="cdc-footer__meta">
          <p>© 1996 – {year} {SITE.name} | All Rights Reserved</p>
          <nav aria-label="Legal">
            {FOOTER_UTILITY.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
