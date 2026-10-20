import {
  SITE,
  MEDIA,
  FOOTER_VENUES,
  FOOTER_MAIN,
  FOOTER_UTILITY,
  SOCIAL_LINKS,
} from "../../js/data.js";
import { isTicketCheckoutUrl } from "../../js/ticketing.js";
import { SocialIcon } from "./SocialIcon.jsx";
import { ArrowButton } from "./ArrowButton.jsx";
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

export function SiteFooter() {
  const phoneHref = `tel:${SITE.boxOffice.replace(/[^\d+]/g, "")}`;

  return (
    <footer className="orpheum-footer orpheum-wave-edge-top">
      <div className="orpheum-footer__shell">
        <div className="orpheum-footer__primary">
          <div className="orpheum-footer__brand">
            <a href="/" className="orpheum-footer__logo" aria-label={`${SITE.name} Home`}>
              <img src={MEDIA.logo} alt="" width={188} height={78} />
            </a>

            <p className="orpheum-footer__tagline">{SITE.tagline}</p>

            <address className="orpheum-footer__contact">
              <a href={phoneHref}>{SITE.boxOffice}</a>
              <MailLink email={SITE.email}>{SITE.email}</MailLink>
              <span>{SITE.address}</span>
            </address>

            <div className="orpheum-footer__venues" aria-label="Our venues">
              {FOOTER_VENUES.map((venue) => (
                <a key={venue.href} href={venue.href}>
                  {venue.label}
                </a>
              ))}
            </div>

            <div className="orpheum-footer__ctas">
              <ArrowButton href="/support/donate/" className="orpheum-footer__cta">
                Give now
              </ArrowButton>
              <ArrowButton href="/events/" variant="light" className="orpheum-footer__cta">
                Past events
              </ArrowButton>
            </div>
          </div>

          <nav className="orpheum-footer__nav" aria-label="Footer">
            {FOOTER_MAIN.columns.map((column) => (
              <div key={column.title} className="orpheum-footer__col">
                <h2 className="orpheum-footer__heading">{column.title}</h2>
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

        <div className="orpheum-footer__mailing" data-reveal>
          <MailingListSignup
            variant="footer"
            heading="Mailing List"
            lead="Season announcements and education news, delivered to your inbox."
          />
        </div>

        <div className="orpheum-footer__divider" aria-hidden="true" />

        <div className="orpheum-footer__meta">
          <div className="orpheum-footer__meta-start">
            <div className="orpheum-footer__social" aria-label="Social media">
              {FOOTER_SOCIAL.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialIcon platform={social.platform} size={18} />
                </a>
              ))}
            </div>
          </div>

          <nav className="orpheum-footer__utility" aria-label="Footer utility links">
            <ul>
              {FOOTER_UTILITY.map((link) => (
                <li key={link.label}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="orpheum-footer__legal">
          <div className="orpheum-footer__legal-start">
            <p className="orpheum-footer__copyright">&copy; 2026 {SITE.name}</p>
            <p className="orpheum-footer__credit">
              Made with love by the{" "}
              <a href="/about/board-of-directors/">Board of Directors</a>
            </p>
          </div>
          <p className="orpheum-footer__education-note">
            Education questions?{" "}
            <MailLink email={SITE.educationContact}>{SITE.educationDirectorName}</MailLink>
          </p>
        </div>
      </div>
    </footer>
  );
}
